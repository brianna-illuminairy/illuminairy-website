'use client';
import { useState, useRef, useEffect } from 'react';
import Script from 'next/script';
import { QFScreen, QFButton, QFConstellation } from '../components/QFShell';
import { cappedPromisedGain } from '../gains';
import {
  captureQuizLeadSubmitted,
  captureQuizBookingConfirmed
} from '@/lib/quiz-funnel/analytics';
import { QUIZ_TESTIMONIALS } from '@/lib/quiz-funnel/testimonials';
import { getClientAttributionPayload } from '@/lib/quiz-funnel/client-attribution';
import { site } from '@/lib/site';
import {
  buildCalendlyInlineWidgetOptions,
  calendlyEmbedUrl,
  CALENDLY_WIDGET_JS,
} from '@/lib/calendly-embed';

// ─── S5 · Approved + account ──────────────────────────────────────────────────
const S5_SCORE = { 'u1000': 1050, '1100-1200': 1150, '1200-1300': 1250, '1300-1400': 1350, '1400plus': 1430 };
const S5_TARGET = { '1250': 1250, '1300': 1300, '1350': 1350, '1400': 1400, '1450': 1450 };
const S5_DATE_NUMERIC = { 'aug22': '8/22', 'oct3': '10/3', 'nov7': '11/7', 'dec5': '12/5' };

export function QFS5Approved({ onContinue, onBack, answers = {}, dispatch }: {
  onContinue: () => void;
  onBack: () => void;
  answers?: Record<string, unknown>;
  dispatch?: (action: { type: string; key?: string; value?: unknown }) => void;
}) {
  const {
    q4 = '1200-1300', q5 = 'oct3', q8 = '1400',
    parentName = '', parentEmail = '', parentPhone = '', kidName = '',
    confirmTcpa = false,
  } = answers as Record<string, string | boolean>;

  const lastScore = S5_SCORE[q4 as keyof typeof S5_SCORE];
  const target = S5_TARGET[q8 as keyof typeof S5_TARGET];
  const rawGap = (target && lastScore) ? Math.max(0, target - lastScore) : null;
  const gap = cappedPromisedGain(rawGap, q5 as string);
  const dateNumeric = S5_DATE_NUMERIC[q5 as keyof typeof S5_DATE_NUMERIC];

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const formComplete =
    String(parentName).trim().length > 0 &&
    String(parentEmail).trim().includes('@') &&
    String(parentPhone).trim().length >= 7 &&
    String(kidName).trim().length > 0 &&
    Boolean(confirmTcpa);

  const setField = (key: string, value: unknown) => dispatch?.({ type: 'SET_FIELD', key, value });

  async function handleContinue() {
    if (!formComplete || submitting) return;
    setSubmitting(true);
    setError('');
    const { visitorId, attribution } = getClientAttributionPayload();
    try {
      const res = await fetch('/api/funnel/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...answers,
          confirmTcpa: true,
          visitorId,
          attribution,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Could not save — check your connection and try again.');
        setSubmitting(false);
        return;
      }
      captureQuizLeadSubmitted(answers as Record<string, unknown>, data.eventId);
      onContinue();
    } catch {
      setError('Could not save — check your connection and try again.');
      setSubmitting(false);
    }
  }

  return (
    <QFScreen stepIdx={18} ornament="glow" onBack={onBack}
      footer={
        <QFButton kind="forest" onClick={handleContinue} disabled={!formComplete || submitting}>
          {submitting ? 'Saving…' : 'See their plan'}
        </QFButton>
      }
    >
      <div className="gap-22">
        <div>
          <h1 className="qf-h1" style={{ marginBottom: 10 }}>
            You're <em>approved</em> for a personalized plan.
          </h1>
          {gap && (
            <p className="qf-lead">
              {dateNumeric ? (
                <>To help get their score up by <em>{gap} pts</em> for the <em>{dateNumeric}</em> SAT.</>
              ) : (
                <>To help get their score up by <em>{gap} pts</em>.</>
              )}
            </p>
          )}
        </div>

        <div className="qf-card gap-14" style={{ padding: 18 }}>
          <div className="qf-field">
            <span className="qf-label">Your name</span>
            <input className="qf-input" placeholder="First and last" value={String(parentName)}
              onChange={e => setField('parentName', e.target.value)} />
          </div>
          <div className="qf-field">
            <span className="qf-label">Your email</span>
            <input className="qf-input" type="email" placeholder="you@email.com" value={String(parentEmail)}
              onChange={e => setField('parentEmail', e.target.value)} />
          </div>
          <div className="qf-field">
            <span className="qf-label">Mobile (for the strategy call)</span>
            <input className="qf-input" type="tel" placeholder="(555) 123-4567" value={String(parentPhone)}
              onChange={e => setField('parentPhone', e.target.value)} />
          </div>
          <div className="qf-field">
            <span className="qf-label">Your kid&apos;s first name</span>
            <input className="qf-input" value={String(kidName)}
              onChange={e => setField('kidName', e.target.value)} />
          </div>
          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, lineHeight: 1.45, color: 'var(--qf-ink-mid)' }}>
            <input
              type="checkbox"
              checked={Boolean(confirmTcpa)}
              onChange={e => setField('confirmTcpa', e.target.checked)}
              style={{ marginTop: 3 }}
            />
            <span>
              I agree Illuminairy may call me about the SAT program. See{' '}
              <a href="/privacy" style={{ color: 'var(--qf-forest)' }}>Privacy</a> and{' '}
              <a href="/terms" style={{ color: 'var(--qf-forest)' }}>Terms</a>.
            </span>
          </label>
        </div>

        {error && (
          <p style={{ color: '#b42318', fontSize: 14, margin: 0 }}>{error}</p>
        )}

        <p className="qf-disclaimer">
          We never share your details.
        </p>
      </div>
    </QFScreen>
  );
}

export function QFS7PlanDetails({ onContinue, onBack }: { onContinue: () => void; onBack: () => void }) {
  return (
    <QFScreen stepIdx={20} onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>Book my free strategy call</QFButton>}
    >
      <div className="gap-22">
        <div>
          <p className="qf-meta" style={{ color: 'var(--qf-forest)', marginBottom: 8 }}>Testimonials</p>
          <h1 className="qf-h1">A word from our <em>clients</em>.</h1>
        </div>

        <div className="gap-14">
          {QUIZ_TESTIMONIALS.map((r, i) => (
            <div key={i} className="qf-card" style={{ padding: 18 }}>
              {(r.photo || r.ba) && (
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
                  {r.photo && (
                    <div style={{
                      width: 72, height: 72, borderRadius: 12,
                      overflow: 'hidden', flexShrink: 0,
                      background:
                        'linear-gradient(135deg, #C8E6CF 0%, #77C89A 60%, #2F6E47 100%)',
                      position: 'relative',
                    }}>
                      <img
                        src={r.photo}
                        alt=""
                        style={{
                          position: 'absolute', inset: 0,
                          width: '100%', height: '100%',
                          objectFit: 'cover', display: 'block',
                        }}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  )}
                  {r.ba && (
                    <div>
                      <div style={{
                        fontFamily: 'var(--qf-display)', fontSize: 22, color: 'var(--qf-forest)',
                        fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.1,
                      }}>{r.ba}</div>
                      <div className="qf-meta" style={{ color: 'var(--qf-forest)', marginTop: 4 }}>Verified</div>
                    </div>
                  )}
                </div>
              )}
              <p style={{ fontFamily: 'var(--qf-display)', fontSize: 15.5, lineHeight: 1.5, fontWeight: 500, color: 'var(--qf-ink-2)', margin: 0 }}>"{r.quote}"</p>
              <div className="qf-meta" style={{ marginTop: 10 }}>— {r.attribution}</div>
            </div>
          ))}
        </div>
      </div>
    </QFScreen>
  );
}

// ─── S9 · Booking (Calendly inline embed) ────────────────────────────────────

export function QFS9Booking({
  onComplete,
  onBack,
  answers = {},
}: {
  onComplete: () => void;
  onBack: () => void;
  answers?: Record<string, unknown>;
}) {
  const parentEmail = typeof answers.parentEmail === "string" ? answers.parentEmail : "";
  const parentName = typeof answers.parentName === "string" ? answers.parentName : "";
  const kidName = typeof answers.kidName === "string" ? answers.kidName : "";
  const fallbackUrl = calendlyEmbedUrl(site.calendlyUrl, {
    email: parentEmail || undefined,
    name: parentName || undefined,
  });
  const widgetRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== "https://calendly.com") return;
      const event = e.data?.event;
      if (event === "calendly.event_scheduled") {
        const inviteeUri = e.data?.payload?.invitee?.uri ?? "";
        const eventId = inviteeUri
          ? `schedule_${inviteeUri.split("/").pop()}`
          : `schedule_${Date.now()}`;
        captureQuizBookingConfirmed(eventId);
        setBooked(true);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!scriptReady || !widgetRef.current || !window.Calendly) return;
    const { attribution } = getClientAttributionPayload();
    widgetRef.current.innerHTML = "";
    window.Calendly.initInlineWidget(
      buildCalendlyInlineWidgetOptions(widgetRef.current, {
        prefill: {
          email: parentEmail || undefined,
          name: parentName || undefined,
          kidFirstName: kidName || undefined,
        },
        utm: {
          utmSource: attribution.utm_source,
          utmMedium: attribution.utm_medium,
          utmCampaign: attribution.utm_campaign,
          utmContent: attribution.utm_content,
          utmTerm: attribution.utm_term,
        },
      })
    );
  }, [scriptReady, parentEmail, parentName, kidName]);

  if (booked) {
    return (
      <QFScreen stepIdx={21} showBack={false} onBack={onBack}
        footer={<QFButton kind="forest" onClick={onComplete}>Done</QFButton>}
      >
        <div className="gap-22" style={{ paddingTop: 24 }}>
          <h1 className="qf-h1">You&apos;re <em>booked</em>.</h1>
          <p className="qf-lead">
            Check your email for a calendar invite. We&apos;ll walk through their goals, timeline, and recommended plan on the call.
          </p>
        </div>
      </QFScreen>
    );
  }

  return (
    <>
      <Script
        src={CALENDLY_WIDGET_JS}
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
      />
      <QFScreen stepIdx={21} onBack={onBack}>
        <div className="gap-22">
          <h1 className="qf-h1">Pick a time for your <em>free</em> strategy call.</h1>
          <p className="qf-lead">
            A plan specialist will walk through their goals, timeline, and recommended plan.
          </p>
          <div
            ref={widgetRef}
            className="calendly-inline-widget"
            style={{ minWidth: 320, height: "min(700px, 72dvh)", width: "100%" }}
          />
          <p className="qf-disclaimer">
            15 minutes · no obligation ·{" "}
            <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--qf-forest)" }}>
              open in new tab
            </a>
          </p>
        </div>
      </QFScreen>
    </>
  );
}
