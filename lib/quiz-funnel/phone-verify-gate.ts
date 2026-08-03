/**
 * Plan A (`/plan`) phone OTP gate — Firebase verify before lead + Calendly book.
 * Reuses Plan B Firebase helpers; does not change Plan B routes.
 */

import { isFunnelBVerifyConfigured } from "@/lib/funnel-b-verify";

/** How long a client/server `phoneVerifiedAt` stamp stays valid. */
export const PHONE_VERIFY_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function isPlanAPhoneVerifyRequired(): boolean {
  return isFunnelBVerifyConfigured();
}

export function isFreshPhoneVerifiedAt(
  value: unknown,
  maxAgeMs: number = PHONE_VERIFY_MAX_AGE_MS
): boolean {
  if (typeof value !== "string" || !value.trim()) return false;
  const ms = Date.parse(value.trim());
  if (!Number.isFinite(ms)) return false;
  const age = Date.now() - ms;
  return age >= 0 && age <= maxAgeMs;
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
