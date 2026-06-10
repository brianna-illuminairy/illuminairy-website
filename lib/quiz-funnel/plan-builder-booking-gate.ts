import type { AttributionSnapshot } from "@/lib/attribution";
import { isMetaPaidSearch } from "@/lib/landing/meta-traffic";

export const PLAN_BUILDER_BOOKING_QA_COOKIE = "plan_builder_booking_qa";

function envTruthy(raw: string | undefined): boolean {
  const v = raw?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

/** Optional kill switch — set PAUSED=1 to hold paid ad traffic on lead-only s5. Default: booking live. */
export function isPlanBuilderBookingPausedPublic(): boolean {
  return envTruthy(process.env.NEXT_PUBLIC_PLAN_BUILDER_BOOKING_PAUSED);
}

/** @deprecated Legacy opt-in flag; booking is live by default. LIVE=1 still forces gate off. */
export function isPlanBuilderBookingLivePublic(): boolean {
  if (isPlanBuilderBookingPausedPublic()) return false;
  if (envTruthy(process.env.NEXT_PUBLIC_PLAN_BUILDER_BOOKING_LIVE)) return true;
  return true;
}

export function getPlanBuilderBookingQaSecret(): string {
  return process.env.PLAN_BUILDER_BOOKING_QA_SECRET?.trim() ?? "";
}

export function isPlanBuilderBookingQaSecretValid(code: string | undefined): boolean {
  const secret = getPlanBuilderBookingQaSecret();
  if (!secret || !code?.trim()) return false;
  return code.trim() === secret;
}

/**
 * Paid click captured in session — not LP-inferred UTMs (those must not block booking).
 * Requires fb/gclid/msclkid or an explicit paid utm_medium from the landing URL.
 */
export function isPaidAdAttribution(attr: AttributionSnapshot): boolean {
  if (attr.fbclid?.trim()) return true;
  if (attr.gclid?.trim()) return true;
  if (attr.msclkid?.trim()) return true;

  const medium = attr.utm_medium?.trim().toLowerCase() ?? "";
  return (
    medium === "paid_social" ||
    medium === "cpc" ||
    medium === "ppc" ||
    medium === "paid"
  );
}

export function isPaidAdSearch(search: string): boolean {
  if (isMetaPaidSearch(search)) return true;
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  if (params.get("gclid")) return true;
  if (params.get("msclkid")) return true;
  const medium = params.get("utm_medium")?.toLowerCase() ?? "";
  return medium === "cpc" || medium === "ppc" || medium === "paid";
}

const ATTRIBUTION_QUERY_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
] as const;

export function attributionFromSearchParams(
  params: URLSearchParams
): AttributionSnapshot {
  const attr: AttributionSnapshot = {};
  for (const key of ATTRIBUTION_QUERY_KEYS) {
    const value = params.get(key)?.trim();
    if (value) attr[key] = value;
  }
  return attr;
}

export function shouldGatePlanBuilderBooking(
  attribution: AttributionSnapshot,
  hasQaBypass: boolean,
  bookingLive = isPlanBuilderBookingLivePublic()
): boolean {
  if (bookingLive) return false;
  if (hasQaBypass) return false;
  return isPaidAdAttribution(attribution);
}

export function hasPlanBuilderBookingQaBypassFromDocument(): boolean {
  if (typeof document === "undefined") return false;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${PLAN_BUILDER_BOOKING_QA_COOKIE}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) === "1" : false;
}

export function planBuilderBookingGateCookieOptions(maxAge = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
