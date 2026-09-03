/**
 * Plan A (`/plan`) phone OTP gate — Firebase verify before lead + Calendly book.
 * Reuses Plan B Firebase helpers; does not change Plan B routes.
 */

import { isSamePhoneNumber } from "@/lib/calendly/phone-e164";
import { isFunnelBVerifyConfigured } from "@/lib/funnel-b-verify";

export function isPlanAPhoneVerifyRequired(): boolean {
  return isFunnelBVerifyConfigured();
}

/** A verification happened at some point. No age limit: re-prompting a parent
 * who already passed the OTP costs them a second code for no added safety,
 * because booking checks the number itself. */
export function hasPhoneVerifiedAt(value: unknown): boolean {
  if (typeof value !== "string" || !value.trim()) return false;
  return Number.isFinite(Date.parse(value.trim()));
}

/**
 * The OTP is bound to a number, so the phone being booked must be the phone
 * that passed it. Without this a parent can verify a real number, edit it to a
 * fake one, and still book.
 *
 * `verifiedPhone` is null on leads created before the column existed; those
 * fall back to the timestamp alone rather than being forced to re-verify.
 */
export function phoneVerificationCoversBooking(input: {
  verifiedAt: string | null | undefined;
  verifiedPhone: string | null | undefined;
  bookingPhone: string | null | undefined;
}): boolean {
  if (!hasPhoneVerifiedAt(input.verifiedAt)) return false;
  if (!input.verifiedPhone) return true;
  return isSamePhoneNumber(input.verifiedPhone, input.bookingPhone);
}

/** Non-production only — `?qa=phone` / `?qa=1` client stamp + body.qaPhoneBypass. */
export function isPlanPhoneVerifyQaBypassAllowed(): boolean {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv === "production") return false;
  if (process.env.NODE_ENV === "production" && !vercelEnv) return false;
  return true;
}

export function acceptPhoneVerifyQaBypass(body: {
  qaPhoneBypass?: unknown;
}): boolean {
  if (!isPlanPhoneVerifyQaBypassAllowed()) return false;
  return body.qaPhoneBypass === true;
}
