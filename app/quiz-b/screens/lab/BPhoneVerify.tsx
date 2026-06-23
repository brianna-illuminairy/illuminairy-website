'use client';

import { useEffect, useRef, useState } from 'react';
import type { ConfirmationResult } from 'firebase/auth';
import { captureLabPhoneVerified } from '@/lib/quiz-funnel-b/analytics';
import { QFScreen, QFButton } from '@/app/quiz/components/QFShell';
import {
  BOOKING_PHONE_INLINE_INVALID_MSG,
  formatUsPhoneDisplay,
  isValidBookingPhone,
  showBookingPhoneInlineError,
} from '@/lib/calendly/phone-e164';
import {
  executeFunnelPhoneRecaptchaEnterprise,
  funnelRecaptchaEnterpriseClientErrorMessage,
} from '@/lib/firebase/recaptcha-enterprise-client';
import {
  confirmFunnelPhoneVerificationCode,
  funnelFirebaseClientErrorMessage,
  funnelPhoneRecaptchaContainerId,
  preloadFunnelPhoneRecaptcha,
  sendFunnelPhoneVerificationCode,
} from '@/lib/firebase/funnel-phone-client';
import { isFirebaseClientConfigured } from '@/lib/firebase/public-config';

const PHONE_SMS_CONSENT =
  'By pressing Continue I agree to receive text messages (SMS) from Illuminairy about your free lesson and booking reminders. Msg and data rates may apply. Reply STOP to end messages.';

type Props = {
  phone: string;
  verifiedAt?: string;
  onPhoneChange: (value: string) => void;
  onVerified: (verifiedAt: string) => void;
  onContinue: () => void;
  onBack: () => void;
};

function UsFlagIcon() {
  return (
    <svg
      className="qfb-phone-flag"
      viewBox="0 0 22 15"
      width={22}
      height={15}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="22" height="15" fill="#B22234" />
      <path
        fill="#fff"
        d="M0 1.15h22V2.3H0V3.45h22V4.6H0V5.75h22V6.9H0V8.05h22V9.2H0v1.15h22v1.15H0V12.65h22v1.15H0V15h22V0H0z"
      />
      <rect width="9.5" height="8.05" fill="#3C3B6E" />
      <g fill="#fff">
        <circle cx="1.2" cy="1.2" r="0.45" />
        <circle cx="2.8" cy="1.2" r="0.45" />
        <circle cx="4.4" cy="1.2" r="0.45" />
        <circle cx="6" cy="1.2" r="0.45" />
        <circle cx="7.6" cy="1.2" r="0.45" />
        <circle cx="2" cy="2.5" r="0.45" />
        <circle cx="3.6" cy="2.5" r="0.45" />
        <circle cx="5.2" cy="2.5" r="0.45" />
        <circle cx="6.8" cy="2.5" r="0.45" />
        <circle cx="1.2" cy="3.8" r="0.45" />
        <circle cx="2.8" cy="3.8" r="0.45" />
        <circle cx="4.4" cy="3.8" r="0.45" />
        <circle cx="6" cy="3.8" r="0.45" />
        <circle cx="7.6" cy="3.8" r="0.45" />
        <circle cx="2" cy="5.1" r="0.45" />
        <circle cx="3.6" cy="5.1" r="0.45" />
        <circle cx="5.2" cy="5.1" r="0.45" />
        <circle cx="6.8" cy="5.1" r="0.45" />
        <circle cx="1.2" cy="6.4" r="0.45" />
        <circle cx="2.8" cy="6.4" r="0.45" />
        <circle cx="4.4" cy="6.4" r="0.45" />
        <circle cx="6" cy="6.4" r="0.45" />
        <circle cx="7.6" cy="6.4" r="0.45" />
      </g>
    </svg>
  );
}

export function BPhoneVerify({
  phone,
  verifiedAt,
  onPhoneChange,
  onVerified,
  onContinue,
  onBack,
}: Props) {
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverReady, setServerReady] = useState<boolean | null>(null);
  const [enterpriseRecaptchaEnabled, setEnterpriseRecaptchaEnabled] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const confirmationRef = useRef<ConfirmationResult | null>(null);

  const phoneValid = isValidBookingPhone(phone);
  const showPhoneError = showBookingPhoneInlineError(phone, { touched: phoneTouched });
  const verified = Boolean(verifiedAt);
  const clientConfigured = isFirebaseClientConfigured();
  const configured = clientConfigured && serverReady !== false;
  const displayPhone = formatUsPhoneDisplay(phone);

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      try {
        const res = await fetch('/api/funnel-b/phone/send');
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        setServerReady(res.ok && data.ok === true);
        setEnterpriseRecaptchaEnabled(data.enterpriseRecaptchaEnabled === true);
      } catch {
        if (!cancelled) setServerReady(false);
      }
    }

    void loadStatus();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!clientConfigured) return;
    funnelPhoneRecaptchaContainerId();
    void preloadFunnelPhoneRecaptcha().catch(() => {
      // Firebase will retry when user taps Continue.
    });
  }, [clientConfigured]);

  async function sendCode() {
    if (!phoneValid || sending || !configured) return;
    setSending(true);
    setError(null);
    try {
      let postBody: { recaptchaToken?: string; recaptchaAction?: string } | undefined;

      if (enterpriseRecaptchaEnabled) {
        const { token: recaptchaToken, action: recaptchaAction } =
          await executeFunnelPhoneRecaptchaEnterprise();
        postBody = { recaptchaToken, recaptchaAction };
      }

      const res = await fetch('/api/funnel-b/phone/send', {
        method: 'POST',
        headers: postBody ? { 'Content-Type': 'application/json' } : undefined,
        body: postBody ? JSON.stringify(postBody) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.message === 'string' ? data.message : 'Could not send code.');
        return;
      }

      confirmationRef.current = await sendFunnelPhoneVerificationCode(phone);
      setOtpOpen(true);
    } catch (err) {
      if (
        err instanceof Error &&
        (err.message.startsWith('recaptcha_') || err.message === 'recaptcha_browser_only')
      ) {
        setError(funnelRecaptchaEnterpriseClientErrorMessage(err));
        return;
      }
      setError(funnelFirebaseClientErrorMessage(err));
    } finally {
      setSending(false);
    }
  }

  async function verifyCode() {
    if (verifying || otp.trim().length < 4 || !confirmationRef.current) return;
    setVerifying(true);
    setError(null);
    try {
      const idToken = await confirmFunnelPhoneVerificationCode(confirmationRef.current, otp.trim());
      const res = await fetch('/api/funnel-b/phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, idToken }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.message === 'string' ? data.message : 'Invalid code.');
        return;
      }
      const stamp =
        typeof data.verifiedAt === 'string' ? data.verifiedAt : new Date().toISOString();
      onVerified(stamp);
      captureLabPhoneVerified();
      confirmationRef.current = null;
      setOtpOpen(false);
    } catch (err) {
      setError(funnelFirebaseClientErrorMessage(err));
    } finally {
      setVerifying(false);
    }
  }

  function handleContinueClick() {
    if (verified) {
      onContinue();
      return;
    }
    setPhoneTouched(true);
    if (!phoneValid) return;
    void sendCode();
  }

  function handlePhoneInput(value: string) {
    onPhoneChange(formatUsPhoneDisplay(value));
  }

  return (
    <QFScreen stepIdx={18} onBack={onBack}>
      <div className="qfb-phone-screen">
        <h1 className="qfb-phone-title">Enter your phone</h1>
        <p className="qfb-phone-lead">
          You&apos;ll receive a text message with a code to confirm your booking.
        </p>

        <div className="qfb-phone-field">
          <label className="qfb-phone-label" htmlFor="qfb-phone-input">
            Mobile Phone Number*
          </label>
          <div className={`qfb-phone-input-wrap${showPhoneError ? ' is-invalid' : ''}`}>
            <span className="qfb-phone-prefix">
              <UsFlagIcon />
            </span>
            <input
              id="qfb-phone-input"
              className="qfb-phone-input"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="(201) 555-0123"
              value={displayPhone}
              disabled={verified}
              aria-invalid={showPhoneError}
              aria-describedby={showPhoneError ? 'qfb-phone-error' : 'qfb-phone-consent'}
              onBlur={() => setPhoneTouched(true)}
              onChange={(e) => handlePhoneInput(e.target.value)}
            />
          </div>
          {showPhoneError ? (
            <p className="qf-field-error" id="qfb-phone-error" role="alert">
              {BOOKING_PHONE_INLINE_INVALID_MSG}
            </p>
          ) : null}
        </div>

        {verified ? <p className="qfb-verified-badge">Number verified</p> : null}

        {!configured && serverReady !== null ? (
          <p className="qf-field-error" role="alert">
            Phone verification is temporarily unavailable. Email support@illuminairy.com.
          </p>
        ) : null}

        {error && !otpOpen ? (
          <p className="qf-field-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="qfb-phone-actions">
          <button
            type="button"
            className="qfb-phone-continue"
            onClick={handleContinueClick}
            disabled={verified ? false : sending || !configured || !phoneValid}
          >
            {verified ? 'Continue' : sending ? 'Sending…' : 'Continue'}
          </button>
          {!verified ? (
            <p className="qfb-phone-legal" id="qfb-phone-consent">
              {PHONE_SMS_CONSENT}
            </p>
          ) : null}
        </div>
      </div>

      {otpOpen ? (
        <div
          className="qfb-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Enter verification code"
        >
          <div className="qfb-modal qf-card gap-14">
            <h2 className="qf-h1" style={{ fontSize: 22, margin: 0 }}>
              Enter the code we texted you
            </h2>
            <input
              className="qf-input"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="6-digit code"
              maxLength={8}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {error ? (
              <p className="qf-field-error" role="alert">
                {error}
              </p>
            ) : null}
            <div className="gap-10">
              <QFButton kind="forest" onClick={verifyCode} disabled={verifying || otp.trim().length < 4}>
                {verifying ? 'Verifying…' : 'Verify'}
              </QFButton>
              <QFButton kind="ghost" onClick={() => setOtpOpen(false)}>
                Cancel
              </QFButton>
            </div>
          </div>
        </div>
      ) : null}
    </QFScreen>
  );
}
