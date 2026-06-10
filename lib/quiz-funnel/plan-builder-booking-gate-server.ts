import { cookies } from "next/headers";
import type { AttributionSnapshot } from "@/lib/attribution";
import {
  attributionFromSearchParams,
  isPlanBuilderBookingLivePublic,
  isPlanBuilderBookingQaSecretValid,
  PLAN_BUILDER_BOOKING_QA_COOKIE,
  shouldGatePlanBuilderBooking,
} from "@/lib/quiz-funnel/plan-builder-booking-gate";

function envTruthy(raw: string | undefined): boolean {
  const v = raw?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

/** Server routes — booking live unless PAUSED=1 (default live). */
export function isPlanBuilderBookingLive(): boolean {
  if (envTruthy(process.env.PLAN_BUILDER_BOOKING_PAUSED)) return false;
  if (isPlanBuilderBookingLivePublic()) return true;
  if (envTruthy(process.env.PLAN_BUILDER_BOOKING_LIVE)) return true;
  return true;
}

export async function hasPlanBuilderBookingQaBypassFromCookies(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(PLAN_BUILDER_BOOKING_QA_COOKIE)?.value === "1";
}

export async function resolvePlanBuilderBookingGate(input: {
  attribution: AttributionSnapshot;
  request?: Request;
}): Promise<{ gated: boolean; hasQaBypass: boolean }> {
  let hasQaBypass = await hasPlanBuilderBookingQaBypassFromCookies();
  if (!hasQaBypass && input.request) {
    const qa = new URL(input.request.url).searchParams.get("plan_booking_qa");
    if (isPlanBuilderBookingQaSecretValid(qa ?? undefined)) {
      hasQaBypass = true;
    }
  }
  const gated = shouldGatePlanBuilderBooking(
    input.attribution,
    hasQaBypass,
    isPlanBuilderBookingLive()
  );
  return { gated, hasQaBypass };
}

export { attributionFromSearchParams };
