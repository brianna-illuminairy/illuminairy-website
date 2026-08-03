'use client';

import { useEffect, useRef, useState } from 'react';
import type { ConfirmationResult } from 'firebase/auth';
import '../phone-otp.css';
import {
  formatUsPhoneDisplay,
  phoneToCalendlyE164,
} from '@/lib/calendly/phone-e164';
import {
  cleanupFunnelPhoneSession,
  confirmFunnelPhoneVerificationCode,
  funnelFirebaseClientErrorMessage,
  sendFunnelPhoneVerificationCode,
} from '@/lib/firebase/funnel-phone-client';
import { getClientAttributionPayload } from '@/lib/quiz-funnel/client-attribution';

type Props = {
  open: boolean;
  phone: string;
  /** Set by parent after a successful Firebase send. */
  confirmation: ConfirmationResult | null;
  sending?: boolean;
  sendError?: string | null;
  onClose: () => void;
  onVerified: (verifiedAt: string) => void;
  onResend: () => void;
};

export function QFPhoneOtpModal({
  open,
  phone,
  confirmation,
  sending = false,
  sendError = null,
  onClose,
  onVerified,
  onResend,
}: Props) {
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirmationRef = useRef<ConfirmationResult | null>(null);

  const displayPhone = formatUsPhoneDisplay(phone);
  const e164Phone = phoneToCalendlyE164(phone);

  useEffect(() => {
    confirmationRef.current = confirmation;
  }, [confirmation]);

  async function verifyCode() {
    const active = confirmationRef.current;
    if (verifying || otp.trim().length < 4 || !active || !e164Phone) return;
    setVerifying(true);
    setError(null);
    try {
      const { idToken } = await confirmFunnelPhoneVerificationCode(active, otp.trim());
      const { visitorId } = getClientAttributionPayload();
      const res = await fetch('/api/funnel/phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: e164Phone, idToken, visitorId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.message === 'string' ? data.message : 'Invalid code.');
        return;
      }
      await cleanupFunnelPhoneSession();
      const stamp =
        typeof data.verifiedAt === 'string' ? data.verifiedAt : new Date().toISOString();
      confirmationRef.current = null;
      onVerified(stamp);
    } catch (err) {
      setError(funnelFirebaseClientErrorMessage(err));
    } finally {
      setVerifying(false);
    }
  }

  function handleClose() {
    confirmationRef.current = null;
    setOtp('');
    setError(null);
    void cleanupFunnelPhoneSession();
    onClose();
  }

  if (!open) return null;

  const bannerError = error || sendError;

  return (
    <div
      className="qf-phone-otp-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qf-phone-otp-title"
    >
      <div className="qf-phone-otp-modal">
        <button
          type="button"
          className="qf-phone-otp-close"
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 id="qf-phone-otp-title" className="qf-phone-otp-title">
          Enter the code we texted
        </h2>
        <p className="qf-phone-otp-lead">
          {sending
            ? 'Sending a code…'
            : `We sent a 6-digit code to ${displayPhone || 'your phone'}.`}
        </p>
        <label className="qf-phone-otp-label" htmlFor="qf-phone-otp-input">
          Verification code
        </label>
        <input
          id="qf-phone-otp-input"
          className="qf-phone-otp-input"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={8}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
          disabled={verifying || sending}
          autoFocus
        />
        {bannerError ? (
          <p className="qf-phone-otp-error" role="alert">
            {bannerError}
          </p>
        ) : null}
        <button
          type="button"
          className="qf-phone-otp-proceed"
          onClick={() => void verifyCode()}
          disabled={verifying || otp.trim().length < 4 || sending || !confirmation}
        >
          {verifying ? 'Checking…' : 'Confirm number'}
        </button>
        <button
          type="button"
          className="qf-phone-otp-resend"
          onClick={onResend}
          disabled={sending || verifying}
        >
          {sending ? 'Sending…' : 'Resend code'}
        </button>
      </div>
    </div>
  );
}

/** Send Firebase SMS for Plan A s5 (parent owns the ConfirmationResult). */
export async function sendPlanAPhoneOtp(phone: string): Promise<ConfirmationResult> {
  return sendFunnelPhoneVerificationCode(phone);
}
