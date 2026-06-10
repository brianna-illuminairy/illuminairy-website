import { cookies } from "next/headers";
import type { AttributionSnapshot } from "@/lib/attribution";
import {
  attributionFromSearchParams,
  isPlanBuilderBookingQaSecretValid,
  isPlanBuilderBookingLivePublic,
  PLAN_BUILDER_BOOKING_QA_COOKIE,
  shouldGatePlanBuilderBooking,
} from "@/lib/quiz-funnel/plan-builder-booking-gate";

function envTruthy(raw: string | undefined): boolean {
  const v = raw?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

/** Server routes: either public or private live flag enables booking. */
export function isPlanBuilderBookingLive(): boolean {
  if (isPlanBuilderBookingLivePublic()) return true;
  return envTruthy(process.env.PLAN_BUILDER_BOOKING_LIVE);
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
