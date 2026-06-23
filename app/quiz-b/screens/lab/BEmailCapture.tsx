'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { QFScreen, QFButton } from '@/app/quiz/components/QFShell';
import { OAuthSignInButton } from '@/components/oauth-sign-in-button';
import {
  PLAN_B_EMAIL_CTA,
  PLAN_B_EMAIL_HEADLINE,
  PLAN_B_EMAIL_LABEL,
  PLAN_B_EMAIL_PRIVACY,
  planBEmailSocialProofHeadline,
} from '@/lib/quiz-funnel-b/email-capture-copy';
import { planBuilderOAuthCallbackUrl } from '@/lib/oauth-providers';

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
  const [touched, setTouched] = useState(false);
  const [providers, setProviders] = useState<OAuthProviders | null>(null);
  const [socialProof, setSocialProof] = useState<RecentSocialProof | null>(null);
  const oauthError = params.get('oauth_error') === '1';
  const oauthReturn = params.get('oauth_return') === '1';

  useEffect(() => {
    if (oauthReturn) return;

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
  }, [oauthReturn]);

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

  const valid = isValidEmail(value);
  const oauthReady = Boolean(providers?.google || providers?.facebook);

  if (oauthReturn) {
    return (
      <QFScreen stepIdx={15} onBack={onBack}>
        <div className="gap-22">
          <h1 className="qfb-email-capture__headline">Finishing sign-in…</h1>
          <p className="qfb-email-capture__subline">
            Saving your email and moving you to the next step.
          </p>
        </div>
      </QFScreen>
    );
  }

  return (
    <QFScreen
      stepIdx={15}
      onBack={onBack}
      actions={
        <div className="qfb-email-capture__actions">
          <QFButton kind="forest" onClick={onContinue} disabled={!valid}>
            {PLAN_B_EMAIL_CTA}
          </QFButton>

          {socialProof && socialProof.maskedEmails.length > 0 ? (
            <section className="qfb-email-capture__social" aria-label="Recent parent sign-ups">
              <p className="qfb-email-capture__social-headline">
                {planBEmailSocialProofHeadline(socialProof.parentCount)}
              </p>
              <div className="qfb-email-capture__chips">
                {socialProof.maskedEmails.map((masked) => (
                  <span key={masked} className="qfb-email-capture__chip">
                    {masked}
                  </span>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      }
    >
      <div className="qfb-email-capture gap-22">
        <h1 className="qfb-email-capture__headline">{PLAN_B_EMAIL_HEADLINE}</h1>

        {providers === null ? (
          <div className="gap-10" aria-busy="true" aria-label="Loading sign-in options">
            <div className="qfb-oauth-btn qfb-oauth-btn--google qfb-oauth-btn--loading">
              Continue with Google
            </div>
          </div>
        ) : oauthReady ? (
          <div className="gap-10">
            {providers?.google ? (
              <OAuthSignInButton
                provider="google"
                callbackUrl={callbackUrl}
                className="qfb-oauth-btn qfb-oauth-btn--google"
              >
                Continue with Google
              </OAuthSignInButton>
            ) : null}
            {providers?.facebook ? (
              <OAuthSignInButton
                provider="facebook"
                callbackUrl={callbackUrl}
                className="qfb-oauth-btn qfb-oauth-btn--facebook"
              >
                Continue with Facebook
              </OAuthSignInButton>
            ) : null}
          </div>
        ) : (
          <p className="qfb-email-capture__subline" style={{ margin: 0 }}>
            Social sign-in is not configured in this environment. Use your email below.
          </p>
        )}

        {oauthError ? (
          <p className="qf-field-error" role="alert">
            Social sign-in did not finish. Try again or enter your email below.
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
      </div>
    </QFScreen>
  );
}
