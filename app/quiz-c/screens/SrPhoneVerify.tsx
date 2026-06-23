'use client';

import { useState } from 'react';
import { QFScreen, QFButton } from '@/app/quiz/components/QFShell';
import {
  BOOKING_PHONE_INLINE_INVALID_MSG,
  isValidBookingPhone,
  showBookingPhoneInlineError,
} from '@/lib/calendly/phone-e164';
import { captureScoreReviewPhoneVerified } from '@/lib/score-review-funnel/analytics';

type Props = {
  phone: string;
  verifiedAt?: string;
  onPhoneChange: (value: string) => void;
  onVerified: (verifiedAt: string) => void;
  onContinue: () => void;
  onBack: () => void;
};

export function SrPhoneVerify({
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
  const [phoneTouched, setPhoneTouched] = useState(false);

  const phoneValid = isValidBookingPhone(phone);
  const showPhoneError = showBookingPhoneInlineError(phone, { touched: phoneTouched });
  const verified = Boolean(verifiedAt);

  async function sendCode() {
    if (!phoneValid || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/score-review/phone/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Could not send code.');
        return;
      }
      setOtpOpen(true);
    } catch {
      setError('Connection problem. Try again.');
    } finally {
      setSending(false);
    }
  }

  async function verifyCode() {
    if (verifying || otp.trim().length < 4) return;
    setVerifying(true);
    setError(null);
    try {
      const res = await fetch('/api/score-review/phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Invalid code.');
        return;
      }
      const stamp =
        typeof data.verifiedAt === 'string' ? data.verifiedAt : new Date().toISOString();
      onVerified(stamp);
      captureScoreReviewPhoneVerified();
      setOtpOpen(false);
    } catch {
      setError('Connection problem. Try again.');
    } finally {
      setVerifying(false);
    }
  }

  return (
    <QFScreen
      stepIdx={9}
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
          <h1 className="qf-h1">We&apos;ll text reminders about your score review.</h1>
        </div>

        <div className="qf-field">
          <span className="qf-label">Mobile phone</span>
          <input
            className={showPhoneError ? 'qf-input qf-input--invalid' : 'qf-input'}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="404-555-1234"
            value={phone}
            aria-invalid={showPhoneError}
            onBlur={() => setPhoneTouched(true)}
            onChange={(e) => onPhoneChange(e.target.value)}
            disabled={verified}
          />
          {showPhoneError ? (
            <p className="qf-field-error" role="alert">
              {BOOKING_PHONE_INLINE_INVALID_MSG}
            </p>
          ) : null}
        </div>

        {!verified ? (
          <QFButton kind="ghost" onClick={sendCode} disabled={!phoneValid || sending}>
            {sending ? 'Sending code…' : 'Send verification code'}
          </QFButton>
        ) : (
          <p className="qf-meta" style={{ color: 'var(--qf-forest)' }}>
            Phone verified
          </p>
        )}

        {otpOpen && !verified ? (
          <div className="qf-card gap-14" style={{ padding: 18 }}>
            <div className="qf-field">
              <span className="qf-label">Verification code</span>
              <input
                className="qf-input"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <QFButton kind="forest" onClick={verifyCode} disabled={verifying}>
              {verifying ? 'Checking…' : 'Verify code'}
            </QFButton>
          </div>
        ) : null}

        {error ? (
          <p className="qf-field-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </QFScreen>
  );
}
