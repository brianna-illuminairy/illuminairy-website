import { NextResponse } from "next/server";
import { fetchFunnelSchedulerDays } from "@/lib/calendly/funnel-availability";
import { funnelApiError } from "@/lib/calendly/funnel-api-errors";
import { classifyBookingError } from "@/lib/calendly/booking-errors";
import { BOOKING_FEEDBACK } from "@/lib/quiz-funnel/booking-feedback";
import { PLAN_BOOKING_GATE_AVAILABILITY_MSG } from "@/lib/quiz-funnel/plan-booking-gate-copy";
import {
  attributionFromSearchParams,
  resolvePlanBuilderBookingGate,
} from "@/lib/quiz-funnel/plan-builder-booking-gate-server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const attribution = attributionFromSearchParams(url.searchParams);
  const gate = await resolvePlanBuilderBookingGate({ attribution, request });
  if (gate.gated) {
    return NextResponse.json(
      {
        ok: false,
        error: PLAN_BOOKING_GATE_AVAILABILITY_MSG,
        error_code: "booking_paused",
        retryable: false,
        days: [],
      },
      { status: 403 }
    );
  }

  const fresh =
    new URL(request.url).searchParams.get("fresh") === "1" ||
    request.headers.get("cache-control")?.includes("no-cache");
  const token = process.env.CALENDLY_API_TOKEN?.trim();
  if (!token) {
    return funnelApiError(503, "calendly_api", {
      retryable: false,
      message: BOOKING_FEEDBACK.availabilityFailed,
      extra: { days: [] },
    });
  }

  try {
    const days = await fetchFunnelSchedulerDays(token, undefined, { fresh });
    if (days.length === 0) {
      return NextResponse.json({
        ok: false,
        error: BOOKING_FEEDBACK.availabilityEmpty,
        error_code: "availability_load",
        retryable: false,
        days: [],
      });
    }
    const cacheHeaders = fresh
      ? { "Cache-Control": "no-store, max-age=0" }
      : {
          "Cache-Control":
            "public, s-maxage=45, stale-while-revalidate=120, max-age=30"
        };
    return NextResponse.json({ ok: true, days }, { headers: cacheHeaders });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Calendly fetch failed";
    const code = classifyBookingError(message, { httpStatus: 502 });
    console.error("[funnel/calendly-availability]", message);
    return NextResponse.json(
      {
        ok: false,
        error: BOOKING_FEEDBACK.availabilityFailed,
        error_code: code,
        retryable: true,
        days: [],
      },
      { status: 502 }
    );
  }
}
