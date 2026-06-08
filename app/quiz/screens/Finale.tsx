'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuiz, showGapScreen } from '../state';
import { QFScreen, QFButton, QFConstellation } from '../components/QFShell';
import { CalendlyInlineEmbed } from '@/components/calendly-inline-embed';
import { waitUrgencyFromQuiz, hasScheduledTestDate } from '../gains';
import { q5DisplayLabel } from '@/lib/quiz-funnel/quiz-profile';
import { STRATEGY_CALL_VALUE_BULLETS } from '@/lib/quiz-funnel/thank-you-copy';
import {
  captureQuizLeadSubmitted,
  captureQuizBookingConfirmed,
  captureQuizBookingError,
  captureQuizThankYouViewed,
} from '@/lib/quiz-funnel/analytics';
import { sanitizeBookingErrorMessage } from '@/lib/calendly/booking-errors';
import { countPhoneDigits } from '@/lib/calendly/phone-e164';
import { QUIZ_TESTIMONIALS } from '@/lib/quiz-funnel/testimonials';
import { getClientAttributionPayload } from '@/lib/quiz-funnel/client-attribution';
import { planBuilderStepHref } from '@/lib/plan-builder-routes';
import { resolveMetaClickIds } from '@/lib/meta-click-ids';
import { readPersistedLpVariant } from '@/lib/landing/variant-storage';
import { site } from '@/lib/site';
import {
  buildQuizCalendlyPrefill,
  calendlyEmbedUrl,
  hasQuizContactForBooking,
} from '@/lib/calendly-embed';
import {
  buildThankYouBeforeCallItems,
  formatStrategyCallDateTime,
  S9_SCHEDULING_SUBHEAD,
  strategyCallStartFromCalendlyPayload,
  STRATEGY_CALL_PARENT_ON_CALL,
  STRATEGY_CALL_PREP_ITEMS,
  THANK_YOU_ADD_CALENDAR_CTA,
  THANK_YOU_BEFORE_SECTION,
  THANK_YOU_DONE_CTA,
  thankYouHeadline,
  thankYouWhenLine,
} from '@/lib/quiz-funnel/thank-you-copy';
import { strategyCallGoogleCalendarUrl } from '@/lib/quiz-funnel/strategy-call-calendar';
import { QFPlanHandoff } from '../components/QFPlanHandoff';
import { QFPlanScheduler } from '../components/QFPlanScheduler';
import { planSchedulerConfirmLabel } from '@/lib/quiz-funnel/plan-scheduler-copy';
import {
  BOOKING_FEEDBACK,
  parseFunnelApiError,
  validateBookingContact,
  type BookingFieldKey,
} from '@/lib/quiz-funnel/booking-feedback';
import { QFBookingAlert } from '../components/QFBookingAlert';

type PlanSchedulerSlot = {
  startTime: string;
  schedulingUrl: string;
  label: string;
  weekdayShort: string;
  dayTitle: string;
};

// Funnel payoff: SAT Strategy Call schedules Week 1 Skill Diagnostic; activation after plan review.

function WhyNowCard({ q5 }: { q5?: string }) {
  if (!hasScheduledTestDate(q5)) {
    return null;
  }

  const { weeksUntil, gainNow, pointsLostIfWaitOneWeek } = waitUrgencyFromQuiz(q5);

  if (
    weeksUntil == null ||
    weeksUntil <= 0 ||
    gainNow == null ||
    pointsLostIfWaitOneWeek == null
  ) {
    return null;
  }

  const testLabel = q5DisplayLabel(q5) ?? 'SAT';

  return (
    <div
      className="qf-card gap-10"
      style={{
        padding: 18,
        borderColor: 'rgba(180, 35, 24, 0.28)',
        background: 'rgba(180, 35, 24, 0.04)',
      }}
    >
      <p className="qf-meta" style={{ color: '#b42318', margin: 0 }}>Why now</p>
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.5,
          color: 'var(--qf-ink-2)',
          margin: 0,
          fontFamily: 'var(--qf-display)',
          fontWeight: 500,
        }}
      >
        {weeksUntil} {weeksUntil === 1 ? 'week' : 'weeks'} until the {testLabel}. Start now to have the
        best chance at {gainNow}+ points, delays cost up to {pointsLostIfWaitOneWeek} pts per week.
      </p>
    </div>
  );
}

/** s4 · Plan review handoff (before lead form). */
export function QFS4PlanHandoff({
  onContinue,
  onBack,
  answers = {},
  ctaLabel = 'Reserve My SAT Plan Review',
}: {
  onContinue: () => void;
  onBack: () => void;
  answers?: Record<string, unknown>;
  ctaLabel?: string;
}) {
  return (
    <QFScreen stepIdx={17} ornament="glow" onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>{ctaLabel}</QFButton>}
    >
      <QFPlanHandoff answers={answers} />
    </QFScreen>
  );
}

export function QFS5Approved({
  onContinue,
  onBack,
  answers = {},
  dispatch,
  onBooked,
}: {
  onContinue: () => void;
  onBack: () => void;
  answers?: Record<string, unknown>;
  dispatch?: (action: { type: string; key?: string; value?: unknown }) => void;
  /** When set, Calendly confirm goes to booked (skips s7/s9). */
  onBooked?: () => void;
}) {
  const {
    parentName = '', parentEmail = '', parentPhone = '', kidName = '',
    confirmTcpa = false,
  } = answers as Record<string, string | boolean>;

  const [submitting, setSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [bookingAlert, setBookingAlert] = useState<{
    title?: string;
    message: string;
    retryable?: boolean;
    field?: BookingFieldKey;
    error_code?: string;
  } | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<PlanSchedulerSlot | null>(null);
  const [slotsAvailable, setSlotsAvailable] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const reloadSlotsRef = useRef<(() => void) | null>(null);

  const contact = useMemo(
    () => ({
      parentName: String(parentName),
      parentEmail: String(parentEmail),
      parentPhone: String(parentPhone),
      kidName: String(kidName),
    }),
    [parentName, parentEmail, parentPhone, kidName]
  );

  const validation = useMemo(
    () =>
      validateBookingContact({
        ...contact,
        confirmTcpa: Boolean(confirmTcpa),
        hasSlot: Boolean(selectedSlot?.startTime),
      }),
    [contact, confirmTcpa, selectedSlot?.startTime]
  );

  const canSubmit = !submitting && !availabilityLoading && slotsAvailable;

  function setField(key: string, value: unknown) {
    dispatch?.({ type: 'SET_FIELD', key, value });
    if (bookingAlert?.field === key) setBookingAlert(null);
  }

  function trackBookingError(
    errorCode: string,
    errorMessage: string,
    extra?: { http_status?: number; field?: BookingFieldKey; retryable?: boolean }
  ) {
    captureQuizBookingError({
      error_code: errorCode,
      error_message: sanitizeBookingErrorMessage(errorMessage),
      http_status: extra?.http_status,
      phone_digit_count: countPhoneDigits(String(parentPhone)),
      slot_weekday: selectedSlot?.weekdayShort,
      slots_available: slotsAvailable,
      field: extra?.field,
      retryable: extra?.retryable,
    });
  }

  function fieldToErrorCode(field: BookingFieldKey): string {
    if (field === 'parentPhone') return 'invalid_phone';
    if (field === 'slot') return 'no_slot';
    if (field === 'confirmTcpa') return 'unknown';
    return 'unknown';
  }

  function showValidationErrors(): boolean {
    const field = Object.keys(validation.errors)[0] as BookingFieldKey | undefined;
    if (!field) return false;
    const message = validation.errors[field] ?? BOOKING_FEEDBACK.bookingFailed;
    trackBookingError(fieldToErrorCode(field), message, { field });
    setBookingAlert(null);
    return false;
  }

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== 'https://calendly.com') return;
      if (e.data?.event !== 'calendly.event_scheduled') return;
      const payload = e.data?.payload as Record<string, unknown> | undefined;
      const startTime = strategyCallStartFromCalendlyPayload(payload);
      if (startTime) {
        dispatch?.({ type: 'SET_FIELD', key: 'strategyCallStart', value: startTime });
      }
      const inviteeUri = (payload?.invitee as { uri?: string } | undefined)?.uri ?? '';
      const eventId = inviteeUri
        ? `schedule_${inviteeUri.split('/').pop()}`
        : `schedule_${Date.now()}`;
      captureQuizBookingConfirmed(eventId);
      if (onBooked) onBooked();
      else onContinue();
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onBooked, onContinue, dispatch]);

  async function handleContinue() {
    setSubmitAttempted(true);
    if (!validation.valid) {
      showValidationErrors();
      return;
    }
    if (!canSubmit) return;

    setSubmitting(true);
    setBookingAlert(null);
    const { visitorId, attribution } = getClientAttributionPayload();
    const resolved = resolveMetaClickIds(attribution.fbclid);
    const fbp = resolved.fbp ?? attribution.fbp;
    const fbc = resolved.fbc ?? attribution.fbc;
    const sat_lp_variant = readPersistedLpVariant();
    try {
      const res = await fetch('/api/funnel/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...answers,
          confirmTcpa: true,
          visitorId,
          attribution,
          fbp,
          fbc,
          sat_lp_variant,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const parsed = parseFunnelApiError(
          data as Record<string, unknown>,
          res.status
        );
        trackBookingError(parsed.error_code, parsed.message, {
          http_status: res.status,
          field: parsed.field,
          retryable: parsed.retryable,
        });
        setBookingAlert(parsed);
        setSubmitting(false);
        return;
      }
      captureQuizLeadSubmitted(answers as Record<string, unknown>, data.eventId, {
        hasGapScreen: showGapScreen(answers as Parameters<typeof showGapScreen>[0]),
      });

      const slotStart = selectedSlot?.startTime;
      if (!slotStart) {
        showValidationErrors();
        setSubmitting(false);
        return;
      }

      const bookRes = await fetch('/api/funnel/calendly-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: slotStart,
          parentName: contact.parentName,
          parentEmail: contact.parentEmail,
          parentPhone: contact.parentPhone,
          kidName: contact.kidName,
          visitorId,
        }),
      });
      const bookData = await bookRes.json().catch(() => ({}));

      if (!bookRes.ok || !bookData.ok) {
        const parsed = parseFunnelApiError(
          bookData as Record<string, unknown>,
          bookRes.status
        );
        trackBookingError(parsed.error_code, parsed.message, {
          http_status: bookRes.status,
          field: parsed.field,
          retryable: parsed.retryable,
        });
        setBookingAlert(parsed);
        if (parsed.field === 'slot') {
          setSelectedSlot(null);
        }
        if (parsed.refresh_slots) {
          reloadSlotsRef.current?.();
        }
        setSubmitting(false);
        return;
      }

      const startTime =
        typeof bookData.startTime === 'string' ? bookData.startTime : selectedSlot.startTime;
      dispatch?.({ type: 'SET_FIELD', key: 'strategyCallStart', value: startTime });
      const inviteeUri = typeof bookData.inviteeUri === 'string' ? bookData.inviteeUri : '';
      const eventId = inviteeUri
        ? `schedule_${inviteeUri.split('/').pop()}`
        : `schedule_${Date.now()}`;
      captureQuizBookingConfirmed(eventId, { booking_source: 'api' });
      setSubmitting(false);
      if (onBooked) onBooked();
      else onContinue();
    } catch {
      const parsed = parseFunnelApiError(null, 0);
      trackBookingError('network', parsed.message, { retryable: true });
      setBookingAlert({ ...parsed, title: 'Connection problem' });
      setSubmitting(false);
    }
  }

  const footerLabel = availabilityLoading
    ? 'Loading open times…'
    : !slotsAvailable
      ? 'Reload times to continue'
      : selectedSlot
        ? planSchedulerConfirmLabel(selectedSlot.weekdayShort, selectedSlot.label)
        : 'Pick a time';

  return (
    <QFScreen stepIdx={18} ornament="glow" onBack={onBack}
      footer={
        <QFButton kind="forest" onClick={handleContinue} disabled={!canSubmit}>
          {submitting ? BOOKING_FEEDBACK.confirming : footerLabel}
        </QFButton>
      }
    >
      <QFPlanScheduler
        parentName={String(parentName)}
        parentEmail={String(parentEmail)}
        parentPhone={String(parentPhone)}
        confirmTcpa={Boolean(confirmTcpa)}
        fieldErrors={validation.errors}
        showFieldErrors={submitAttempted}
        onFieldChange={setField}
        selectedSlot={selectedSlot}
        onSelectSlot={(slot) => {
          setSelectedSlot(slot as PlanSchedulerSlot | null);
          setBookingAlert(null);
        }}
        onAvailabilityReady={setSlotsAvailable}
        onLoadingChange={setAvailabilityLoading}
        onSlotRequired={() => setSubmitAttempted(true)}
        onRegisterReload={(reload) => {
          reloadSlotsRef.current = reload;
        }}
      />
      {bookingAlert ? (
        <QFBookingAlert
          title={bookingAlert.title}
          message={bookingAlert.message}
          retryable={bookingAlert.retryable}
          onRetry={
            bookingAlert.retryable
              ? () => {
                  setBookingAlert(null);
                  void handleContinue();
                }
              : undefined
          }
        />
      ) : null}
    </QFScreen>
  );
}

export function QFS7PlanDetails({
  onContinue,
  onBack,
  answers = {},
}: {
  onContinue: () => void;
  onBack: () => void;
  answers?: Record<string, unknown>;
}) {
  const q5 = typeof answers.q5 === 'string' ? answers.q5 : undefined;

  return (
    <QFScreen stepIdx={20} onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>Book my SAT Strategy Call</QFButton>}
    >
      <div className="gap-22">
        <div>
          <p className="qf-meta" style={{ color: 'var(--qf-forest)', marginBottom: 8 }}>Step 1 · SAT Strategy Call</p>
          <h1 className="qf-h1">Book your free <em>SAT Strategy Call</em>.</h1>
          <p className="qf-lead" style={{ marginTop: 12 }}>
            Review your Improvement Plan with an SAT advisor: score history, school targets, the gap
            and timeline, and the fastest path. Next: schedule Skill Diagnostic Part 1 and Part 2 for
            Week 1 (proctored, 2 hr 14 min, split across two sessions).
          </p>
        </div>

        <WhyNowCard q5={q5} />

        <div className="qf-card gap-14" style={{ padding: 18 }}>
          <p className="qf-meta" style={{ color: 'var(--qf-ink-mid)', margin: 0 }}>On the call</p>
          <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {STRATEGY_CALL_VALUE_BULLETS.map((item) => (
              <li key={item} style={{ fontSize: 14, lineHeight: 1.45, color: 'var(--qf-ink-2)' }}>
                {item}
              </li>
            ))}
          </ul>
          <p style={{ fontSize: 13, lineHeight: 1.45, color: 'var(--qf-ink-mid)', margin: '4px 0 0' }}>
            15 minutes · free · no obligation · {STRATEGY_CALL_PARENT_ON_CALL}
          </p>
        </div>

        <div className="qf-card gap-10" style={{ padding: 16 }}>
          <p className="qf-meta" style={{ color: 'var(--qf-ink-mid)', margin: 0 }}>What to have ready</p>
          <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {STRATEGY_CALL_PREP_ITEMS.map((item) => (
              <li key={item} style={{ fontSize: 14, lineHeight: 1.45, color: 'var(--qf-ink-2)' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="qf-card gap-10" style={{ padding: 16, borderColor: 'rgba(47,110,71,0.25)' }}>
          <p className="qf-meta" style={{ color: 'var(--qf-forest)', margin: 0 }}>Step 2 · After the Skill Diagnostic</p>
          <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--qf-ink-2)', margin: 0 }}>
            Your child&apos;s personalized weekly SAT plan (which skills to fix, in what order, week by week) is built from what the Skill Diagnostic shows. Not from guesses.
          </p>
        </div>

        <div>
          <p className="qf-meta" style={{ color: 'var(--qf-forest)', marginBottom: 8 }}>From other parents</p>
          <h2 className="qf-h1" style={{ fontSize: 22, marginBottom: 0 }}>A word from our clients.</h2>
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
              <p style={{ fontFamily: 'var(--qf-display)', fontSize: 15.5, lineHeight: 1.5, fontWeight: 500, color: 'var(--qf-ink-2)', margin: 0 }}>
                &ldquo;{r.quote}&rdquo;
              </p>
              <div className="qf-meta" style={{ marginTop: 10 }}>{r.attribution}</div>
            </div>
          ))}
        </div>
      </div>
    </QFScreen>
  );
}

// ─── S9 · Booking (Calendly inline embed) ────────────────────────────────────

// ─── Post-book thank you (show-up + student alignment) ───────────────────────

function ThankYouChecklist({ items }: { items: readonly string[] }) {
  return (
    <ul className="qf-thank-you-checklist">
      {items.map((item) => (
        <li key={item} className="qf-thank-you-checklist__item">
          <span className="qf-thank-you-checklist__check" aria-hidden="true">
            ✓
          </span>
          <span className="qf-thank-you-checklist__text">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function QFS9ThankYou({
  onDone,
  answers = {},
}: {
  onDone: () => void;
  answers?: Record<string, unknown>;
}) {
  const parentFirst =
    typeof answers.parentName === 'string'
      ? answers.parentName.trim().split(/\s+/)[0]
      : '';
  const callStartIso =
    typeof answers.strategyCallStart === 'string' ? answers.strategyCallStart : undefined;
  const callWhen = formatStrategyCallDateTime(callStartIso);
  const calendarUrl = callStartIso
    ? strategyCallGoogleCalendarUrl(callStartIso)
    : null;

  const beforeCallItems = useMemo(
    () => buildThankYouBeforeCallItems(answers as Parameters<typeof buildThankYouBeforeCallItems>[0]),
    [answers]
  );

  useEffect(() => {
    captureQuizThankYouViewed(answers);
  }, [answers]);

  function openCalendar() {
    if (!calendarUrl) return;
    window.open(calendarUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <QFScreen stepIdx={22} showBack={false} onBack={onDone}
      footer={
        <div className="qf-thank-you-footer">
          <QFButton kind="forest" onClick={onDone}>
            {THANK_YOU_DONE_CTA}
          </QFButton>
          {calendarUrl ? (
            <QFButton kind="ghost" onClick={openCalendar}>
              {THANK_YOU_ADD_CALENDAR_CTA}
            </QFButton>
          ) : null}
        </div>
      }
    >
      <div className="qf-thank-you">
        <h1 className="qf-h1" style={{ marginBottom: 0 }}>
          {thankYouHeadline(parentFirst)}
        </h1>

        <p className="qf-lead" style={{ margin: 0 }}>
          {thankYouWhenLine(callWhen)}
        </p>

        <div>
          <p className="qf-meta qf-thank-you-section-label">{THANK_YOU_BEFORE_SECTION}</p>
          <ThankYouChecklist items={beforeCallItems} />
        </div>
      </div>
    </QFScreen>
  );
}

export function QFS9Booking({
  onBooked,
  onBack,
  answers = {},
  dispatch,
}: {
  onBooked: () => void;
  onBack: () => void;
  answers?: Record<string, unknown>;
  dispatch?: (action: { type: string; key?: string; value?: unknown }) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hydrated } = useQuiz();
  const contact = {
    parentName: typeof answers.parentName === "string" ? answers.parentName : "",
    parentEmail: typeof answers.parentEmail === "string" ? answers.parentEmail : "",
    parentPhone: typeof answers.parentPhone === "string" ? answers.parentPhone : "",
    kidName: typeof answers.kidName === "string" ? answers.kidName : "",
  };
  const q5 = typeof answers.q5 === "string" ? answers.q5 : undefined;
  const testLabel = q5DisplayLabel(q5) || "your next test";
  const contactReady = hasQuizContactForBooking(contact);

  useEffect(() => {
    if (!hydrated) return;
    if (!contactReady) {
      router.replace(planBuilderStepHref("s5", searchParams.toString()));
    }
  }, [hydrated, contactReady, router, searchParams]);

  const { prefill, utm, fallbackUrl } = useMemo(() => {
    const { attribution } = getClientAttributionPayload();
    const prefill = buildQuizCalendlyPrefill(contact);
    const utm = {
      utmSource: attribution.utm_source,
      utmMedium: attribution.utm_medium,
      utmCampaign: attribution.utm_campaign,
      utmContent: attribution.utm_content,
      utmTerm: attribution.utm_term,
    };
    return {
      prefill,
      utm,
      fallbackUrl: calendlyEmbedUrl(site.calendlyUrl, prefill),
    };
  }, [contact.parentEmail, contact.parentName, contact.parentPhone, contact.kidName]);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== "https://calendly.com") return;
      const event = e.data?.event;
      if (event === "calendly.event_scheduled") {
        const payload = e.data?.payload as Record<string, unknown> | undefined;
        const startTime = strategyCallStartFromCalendlyPayload(payload);
        if (startTime) {
          dispatch?.({ type: 'SET_FIELD', key: 'strategyCallStart', value: startTime });
        }
        const inviteeUri = (payload?.invitee as { uri?: string } | undefined)?.uri ?? "";
        const eventId = inviteeUri
          ? `schedule_${inviteeUri.split("/").pop()}`
          : `schedule_${Date.now()}`;
        captureQuizBookingConfirmed(eventId);
        onBooked();
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onBooked, dispatch]);

  return (
    <QFScreen stepIdx={21} onBack={onBack}
      footer={
        <QFButton
          kind="forest"
          onClick={() => window.open(fallbackUrl, "_blank", "noopener,noreferrer")}
        >
          Open calendar in new tab
        </QFButton>
      }
    >
      <div className="gap-22">
        <p className="qf-meta" style={{ color: 'var(--qf-forest)', marginBottom: 8 }}>Step 2 of 2</p>
        <h1 className="qf-h1">
          Pick a time for your free <em>SAT Strategy Call</em>.
        </h1>
        <p className="qf-lead">
          15 minutes with an SAT advisor before the {testLabel}. We&apos;ll review your Improvement
          Plan, schedule the Skill Diagnostic for Week 1, and map timeline and targets. Your name
          and email are pre-filled. {STRATEGY_CALL_PARENT_ON_CALL}
        </p>
        <p className="qf-lead" style={{ fontSize: 14, color: 'var(--qf-ink-mid)' }}>
          {S9_SCHEDULING_SUBHEAD} Pick a time below, then tap <strong>Schedule Event</strong>.
        </p>
        {hydrated && contactReady ? (
          <CalendlyInlineEmbed prefill={prefill} utm={utm} />
        ) : (
          <p className="qf-lead muted">Loading calendar…</p>
        )}
        <p className="qf-disclaimer">
          15 minutes · no obligation ·{" "}
          <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--qf-forest)" }}>
            open in new tab
          </a>
        </p>
      </div>
    </QFScreen>
  );
}
