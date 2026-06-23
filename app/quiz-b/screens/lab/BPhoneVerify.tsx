'use client';

import { useEffect, useRef, useState } from 'react';
import type { ConfirmationResult } from 'firebase/auth';
import { QFScreen, QFButton } from '@/app/quiz/components/QFShell';
import {
  BOOKING_PHONE_INLINE_INVALID_MSG,
  isValidBookingPhone,
  showBookingPhoneInlineError,
} from '@/lib/calendly/phone-e164';
import {
  confirmFunnelPhoneVerificationCode,
  funnelFirebaseClientErrorMessage,
  funnelPhoneRecaptchaContainerId,
  sendFunnelPhoneVerificationCode,
} from '@/lib/firebase/funnel-phone-client';
import { isFirebaseClientConfigured } from '@/lib/firebase/public-config';

type Props = {
  phone: string;
  verifiedAt?: string;
  onPhoneChange: (value: string) => void;
  onVerified: (verifiedAt: string) => void;
  onContinue: () => void;
  onBack: () => void;
};

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
  const [phoneTouched, setPhoneTouched] = useState(false);
  const confirmationRef = useRef<ConfirmationResult | null>(null);

  const phoneValid = isValidBookingPhone(phone);
  const showPhoneError = showBookingPhoneInlineError(phone, { touched: phoneTouched });
  const verified = Boolean(verifiedAt);
  const clientConfigured = isFirebaseClientConfigured();
  const configured = clientConfigured && serverReady !== false;

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      try {
        const res = await fetch('/api/funnel-b/phone/send');
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        setServerReady(res.ok && data.ok === true);
      } catch {
        if (!cancelled) setServerReady(false);
      }
    }

    void loadStatus();
    return () => {
      cancelled = true;
    };
  }, []);

  async function sendCode() {
    if (!phoneValid || sending || !configured) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/funnel-b/phone/send', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.message === 'string' ? data.message : 'Could not send code.');
        return;
      }

      confirmationRef.current = await sendFunnelPhoneVerificationCode(phone);
      setOtpOpen(true);
    } catch (err) {
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
      confirmationRef.current = null;
      setOtpOpen(false);
    } catch (err) {
      setError(funnelFirebaseClientErrorMessage(err));
    } finally {
      setVerifying(false);
    }
  }

  return (
    <QFScreen
      stepIdx={18}
      onBack={onBack}
      actions={
        <QFButton kind="forest" onClick={onContinue} disabled={!verified}>
          Continue
        </QFButton>
      }
    >
      <div className="gap-22">
        <div>
          <p className="qf-meta" style={{ color: 'var(--qf-forest)', marginBottom: 8 }}>
            Confirm your number
          </p>
          <h1 className="qf-h1">We&apos;ll text lesson reminders to this phone.</h1>
        </div>

        <div className="qf-field">
          <span className="qf-label">Mobile number</span>
          <input
            className={showPhoneError ? 'qf-input qf-input--invalid' : 'qf-input'}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="404-555-1234"
            value={phone}
            disabled={verified}
            aria-invalid={showPhoneError}
            onBlur={() => setPhoneTouched(true)}
            onChange={(e) => onPhoneChange(e.target.value)}
          />
          {showPhoneError ? (
            <p className="qf-field-error" role="alert">
              {BOOKING_PHONE_INLINE_INVALID_MSG}
            </p>
          ) : null}
        </div>

        {verified ? (
          <p className="qfb-verified-badge">Number verified</p>
        ) : (
          <QFButton kind="ghost" onClick={sendCode} disabled={!phoneValid || sending || !configured}>
            {sending ? 'Sending…' : 'Send verification code'}
          </QFButton>
        )}

        {!configured && serverReady !== null ? (
          <p className="qf-field-error" role="alert">
            Phone verification is temporarily unavailable. Email support@illuminairy.com.
          </p>
        ) : null}

        {error ? (
          <p className="qf-field-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div id={funnelPhoneRecaptchaContainerId()} className="qfb-recaptcha-anchor" aria-hidden="true" />

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
