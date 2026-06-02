import { NextResponse } from "next/server";
import { fetchFunnelSchedulerDays } from "@/lib/calendly/funnel-availability";
import { funnelApiError } from "@/lib/calendly/funnel-api-errors";
import { classifyBookingError } from "@/lib/calendly/booking-errors";
import { BOOKING_FEEDBACK } from "@/lib/quiz-funnel/booking-feedback";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
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
    return NextResponse.json(
      { ok: true, days },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
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
