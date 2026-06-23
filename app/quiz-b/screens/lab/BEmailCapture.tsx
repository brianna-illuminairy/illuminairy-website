'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { BSocialProofChipMarquee } from '@/app/quiz-b/screens/lab/BSocialProofChipMarquee';
import { PlanBOAuthButtons } from '@/app/quiz-b/screens/lab/PlanBOAuthButtons';
import { useQuiz } from '@/app/quiz-b/state';
import { QFScreen, QFButton } from '@/app/quiz/components/QFShell';
import {
  PLAN_B_EMAIL_CTA,
  PLAN_B_EMAIL_HEADLINE_AFTER_FREE,
  PLAN_B_EMAIL_HEADLINE_BEFORE_FREE,
  PLAN_B_EMAIL_LABEL,
  PLAN_B_EMAIL_PRIVACY,
  planBEmailSocialProofHeadline,
} from '@/lib/quiz-funnel-b/email-capture-copy';
import { planBuilderOAuthCallbackUrl } from '@/lib/oauth-providers';
import { persistQuizSnapshot } from '@/lib/quiz-funnel-b/quiz-storage';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
};

type OAuthProviders = {
  google: boolean;
  facebook: boolean;
};

type RecentSocialProof = {
  parentCount: number;
  maskedEmails: string[];
};

function isValidEmail(raw: string) {
  const v = raw.trim();
  if (!v.includes('@')) return false;
  const [local, domain] = v.split('@');
  return Boolean(local?.length && domain?.includes('.'));
}

export function BEmailCapture({ value, onChange, onContinue, onBack }: Props) {
  const params = useSearchParams();
  const search = params.toString();
  const { answers, lastStep } = useQuiz();
  const [touched, setTouched] = useState(false);
  const [providers, setProviders] = useState<OAuthProviders | null>(null);
  const [socialProof, setSocialProof] = useState<RecentSocialProof | null>(null);
  const oauthError = params.get('oauth_error') === '1';
  const oauthReason = params.get('oauth_reason');

  useEffect(() => {
    let cancelled = false;

    async function loadProviders() {
      try {
        const res = await fetch('/api/funnel-b/oauth');
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        setProviders({
          google: data?.providers?.google === true,
          facebook: data?.providers?.facebook === true,
        });
      } catch {
        if (!cancelled) setProviders({ google: false, facebook: false });
      }
    }

    void loadProviders();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadSocialProof() {
      try {
        const res = await fetch('/api/funnel-b/recent-leads-social');
        const data = (await res.json().catch(() => ({}))) as RecentSocialProof;
        if (cancelled) return;
        setSocialProof({
          parentCount: typeof data.parentCount === 'number' ? data.parentCount : 0,
          maskedEmails: Array.isArray(data.maskedEmails) ? data.maskedEmails : [],
        });
      } catch {
        if (!cancelled) setSocialProof({ parentCount: 0, maskedEmails: [] });
      }
    }

    void loadSocialProof();
    return () => {
      cancelled = true;
    };
  }, []);

  const callbackUrl = useMemo(() => planBuilderOAuthCallbackUrl(search), [search]);
  const flushProgressBeforeOAuth = useCallback(() => {
    persistQuizSnapshot({
      answers,
      lastStep: lastStep ?? 'b-email',
      updatedAt: Date.now(),
    });
  }, [answers, lastStep]);

  const valid = isValidEmail(value);
  const oauthReady = Boolean(providers?.google || providers?.facebook);

  const socialChips = socialProof?.maskedEmails.slice(0, 4) ?? [];

  return (
    <QFScreen
      stepIdx={15}
      onBack={onBack}
      actions={
        <QFButton kind="forest" onClick={onContinue} disabled={!valid}>
          {PLAN_B_EMAIL_CTA}
        </QFButton>
      }
    >
      <div className="qfb-email-capture gap-22">
        <h1 className="qfb-email-capture__headline">
          {PLAN_B_EMAIL_HEADLINE_BEFORE_FREE}
          <span className="qfb-email-capture__headline-free">FREE</span>
          {PLAN_B_EMAIL_HEADLINE_AFTER_FREE}
        </h1>

        {providers === null ? (
          <PlanBOAuthButtons
            callbackUrl={callbackUrl}
            onBeforeSignIn={flushProgressBeforeOAuth}
            google={false}
            facebook={false}
            loading
          />
        ) : oauthReady ? (
          <PlanBOAuthButtons
            callbackUrl={callbackUrl}
            onBeforeSignIn={flushProgressBeforeOAuth}
            google={providers.google}
            facebook={providers.facebook}
          />
        ) : (
          <p className="qfb-email-capture__subline" style={{ margin: 0 }}>
            Social sign-in is not configured in this environment. Use your email below.
          </p>
        )}

        {oauthError ? (
          <p className="qf-field-error" role="alert">
            Social sign-in did not finish. Try again or enter your email below.
            {oauthReason ? ` (${oauthReason})` : null}
          </p>
        ) : null}

        {oauthReady ? (
          <div className="qfb-email-divider">
            <span>or</span>
          </div>
        ) : null}

        <div className="qf-field">
          <label className="qf-label" htmlFor="qfb-parent-email">
            {PLAN_B_EMAIL_LABEL}
            <span className="qfb-email-capture__required" aria-hidden="true">
              {' '}
              *
            </span>
          </label>
          <input
            id="qfb-parent-email"
            className={touched && !valid ? 'qf-input qf-input--invalid' : 'qf-input'}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="example@mail.com"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setTouched(true)}
          />
          {touched && !valid ? (
            <p className="qf-field-error" role="alert">
              Enter a valid email address.
            </p>
          ) : null}
          <p className="qfb-email-capture__privacy">
            <span className="qfb-email-capture__privacy-icon" aria-hidden="true">
              🔒
            </span>
            {PLAN_B_EMAIL_PRIVACY}
          </p>
        </div>

        {socialProof && socialChips.length > 0 ? (
          <section className="qfb-email-capture__social" aria-label="Recent parent sign-ups">
            <p className="qfb-email-capture__social-headline">
              {planBEmailSocialProofHeadline(socialProof.parentCount)}
            </p>
            <BSocialProofChipMarquee chips={socialChips} staticLayout />
          </section>
        ) : null}
      </div>
    </QFScreen>
  );
}
