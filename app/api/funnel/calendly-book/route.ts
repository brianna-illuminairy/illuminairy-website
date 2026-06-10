import { NextResponse } from "next/server";
import { bookStrategyCallInvitee } from "@/lib/calendly/book-invitee";
import {
  fetchEventTypeBookingMeta,
  isSlotStillAvailable,
} from "@/lib/calendly/funnel-availability";
import { CalendlyBookError } from "@/lib/calendly/book-invitee-errors";
import {
  classifyBookingError,
  sanitizeBookingErrorMessage,
  type QuizBookingErrorCode
} from "@/lib/calendly/booking-errors";
import { funnelApiError } from "@/lib/calendly/funnel-api-errors";
import { countPhoneDigits, isValidBookingPhone } from "@/lib/calendly/phone-e164";
import { BOOKING_FEEDBACK } from "@/lib/quiz-funnel/booking-feedback";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { appendTouchEvent } from "@/lib/crm/touch";
import {
  mergeAttribution,
  sanitizeAttributionSnapshot,
  type AttributionSnapshot
} from "@/lib/attribution";
import { getVisitorById } from "@/lib/crm/visitors";
import {
  resolvePlanBuilderBookingGate,
} from "@/lib/quiz-funnel/plan-builder-booking-gate-server";
import { PLAN_BOOKING_GATE_AVAILABILITY_MSG } from "@/lib/quiz-funnel/plan-booking-gate-copy";

type CalendlyBookBody = {
  startTime?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  kidName?: string;
  visitorId?: string;
  attribution?: AttributionSnapshot;
  qWho?: string;
  sat_lp_variant?: string;
  lp_variant?: string;
};

function readQWhoFromVisitor(visitor: Record<string, unknown> | null): string | undefined {
  if (!visitor) return undefined;
  const answers = visitor.quiz_answers;
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return undefined;
  }
  const qWho = (answers as Record<string, unknown>).qWho;
  return typeof qWho === "string" ? qWho : undefined;
}

async function resolveVisitorContext(input: {
  visitorId?: string;
  attribution?: AttributionSnapshot;
  qWho?: string;
}) {
  const incoming = sanitizeAttributionSnapshot(input.attribution ?? {});
  if (!input.visitorId) {
    return { attribution: incoming, qWho: input.qWho };
  }
  const visitor = await getVisitorById(input.visitorId);
  const firstTouch = sanitizeAttributionSnapshot(
    ((visitor?.first_touch as AttributionSnapshot | null) ?? {}) as AttributionSnapshot
  );
  const withLast = mergeAttribution(
    firstTouch,
    sanitizeAttributionSnapshot(
      ((visitor?.last_touch as AttributionSnapshot | null) ?? {}) as AttributionSnapshot
    )
  );
  const attribution = mergeAttribution(withLast, incoming);
  const qWho = input.qWho ?? readQWhoFromVisitor(visitor as Record<string, unknown> | null);
  return { attribution, qWho };
}

async function recordBookingError(input: {
  errorCode: QuizBookingErrorCode;
  errorMessage: string;
  httpStatus?: number;
  parentEmail?: string;
  visitorId?: string;
  startTime?: string;
  attribution?: AttributionSnapshot;
  qWho?: string;
  field?: string;
  retryable?: boolean;
  payload?: Record<string, unknown>;
}) {
  const email = input.parentEmail?.trim().toLowerCase();
  let leadId: string | undefined;
  const supabase = getSupabaseAdmin();
  if (supabase && email) {
    const { data: lead } = await supabase
      .from("leads")
      .select("id")
      .eq("parent_email", email)
      .maybeSingle();
    leadId = lead?.id;
  }

  await appendTouchEvent({
    visitor_id: input.visitorId,
    lead_id: leadId,
    event_type: "booking_error",
    source: "server",
    attribution: input.attribution,
    payload: {
      error_code: input.errorCode,
      error_message: sanitizeBookingErrorMessage(input.errorMessage),
      http_status: input.httpStatus,
      start_time: input.startTime,
      field: input.field,
      retryable: input.retryable,
      funnel: "sat_quiz",
      step: "s5",
      booking_phase: "calendly_book",
      qWho: input.qWho,
      utm_source: input.attribution?.utm_source,
      utm_medium: input.attribution?.utm_medium,
      utm_campaign: input.attribution?.utm_campaign,
      utm_content: input.attribution?.utm_content,
      utm_term: input.attribution?.utm_term,
      ...input.payload,
    },
  });
}

export async function POST(request: Request) {
  let body: CalendlyBookBody;
  try {
    body = (await request.json()) as CalendlyBookBody;
  } catch {
    return funnelApiError(400, "unknown", { message: "Invalid request." });
  }

  const startTime = typeof body.startTime === "string" ? body.startTime.trim() : "";
  const parentName = typeof body.parentName === "string" ? body.parentName.trim() : "";
  const parentEmail = typeof body.parentEmail === "string" ? body.parentEmail.trim() : "";
  const parentPhone =
    typeof body.parentPhone === "string" ? body.parentPhone.trim() : undefined;
  const kidName = typeof body.kidName === "string" ? body.kidName.trim() : undefined;
  const visitorId =
    typeof body.visitorId === "string" ? body.visitorId.trim() : undefined;
  const resolved = await resolveVisitorContext({
    visitorId,
    attribution: body.attribution,
    qWho: typeof body.qWho === "string" ? body.qWho : undefined
  });
  const attribution = resolved.attribution;
  const qWho = resolved.qWho;

  const gate = await resolvePlanBuilderBookingGate({ attribution, request });
  if (gate.gated) {
    await recordBookingError({
      errorCode: "booking_paused",
      errorMessage: PLAN_BOOKING_GATE_AVAILABILITY_MSG,
      httpStatus: 403,
      parentEmail,
      visitorId,
      startTime,
      attribution,
      qWho,
      retryable: false,
      payload: {
        sat_lp_variant: body.sat_lp_variant,
        lp_variant: body.lp_variant,
        booking_gate: "paid_ad",
      },
    });
    return funnelApiError(403, "booking_paused", {
      retryable: false,
      message: PLAN_BOOKING_GATE_AVAILABILITY_MSG,
    });
  }

  const token = process.env.CALENDLY_API_TOKEN?.trim();
  if (!token) {
    await recordBookingError({
      errorCode: "calendly_api",
      errorMessage: BOOKING_FEEDBACK.bookingUnavailable,
      httpStatus: 503,
      parentEmail,
      visitorId,
      startTime,
      attribution,
      qWho,
      retryable: false,
      payload: {
        sat_lp_variant: body.sat_lp_variant,
        lp_variant: body.lp_variant
      }
    });
    return funnelApiError(503, "calendly_api", {
      retryable: false,
      message: BOOKING_FEEDBACK.bookingUnavailable,
    });
  }

  if (!startTime) {
    await recordBookingError({
      errorCode: "no_slot",
      errorMessage: BOOKING_FEEDBACK.slotRequired,
      httpStatus: 400,
      parentEmail,
      visitorId,
      attribution,
      qWho,
      field: "slot",
      retryable: false,
      payload: {
        sat_lp_variant: body.sat_lp_variant,
        lp_variant: body.lp_variant
      }
    });
    return funnelApiError(400, "no_slot", { field: "slot" });
  }
  if (!parentName) {
    await recordBookingError({
      errorCode: "invalid_contact",
      errorMessage: BOOKING_FEEDBACK.nameRequired,
      httpStatus: 400,
      parentEmail,
      visitorId,
      startTime,
      attribution,
      qWho,
      field: "parentName",
      retryable: false,
      payload: {
        sat_lp_variant: body.sat_lp_variant,
        lp_variant: body.lp_variant
      }
    });
    return funnelApiError(400, "invalid_contact", {
      field: "parentName",
      message: BOOKING_FEEDBACK.nameRequired,
    });
  }
  if (!parentEmail.includes("@")) {
    await recordBookingError({
      errorCode: "invalid_contact",
      errorMessage: BOOKING_FEEDBACK.emailInvalid,
      httpStatus: 400,
      parentEmail,
      visitorId,
      startTime,
      attribution,
      qWho,
      field: "parentEmail",
      retryable: false,
      payload: {
        sat_lp_variant: body.sat_lp_variant,
        lp_variant: body.lp_variant
      }
    });
    return funnelApiError(400, "invalid_contact", {
      field: "parentEmail",
      message: BOOKING_FEEDBACK.emailInvalid,
    });
  }

  if (!parentPhone || !isValidBookingPhone(parentPhone)) {
    await recordBookingError({
      errorCode: "invalid_phone",
      errorMessage: BOOKING_FEEDBACK.phoneInvalid,
      httpStatus: 400,
      parentEmail,
      visitorId,
      startTime,
      attribution,
      qWho,
      field: "parentPhone",
      retryable: false,
      payload: {
        phone_digit_count: countPhoneDigits(parentPhone ?? ""),
        sat_lp_variant: body.sat_lp_variant,
        lp_variant: body.lp_variant
      },
    });
    return funnelApiError(400, "invalid_phone", {
      field: "parentPhone",
      message: BOOKING_FEEDBACK.phoneInvalid,
    });
  }

  try {
    const [stillOpen, meta] = await Promise.all([
      isSlotStillAvailable(token, startTime),
      fetchEventTypeBookingMeta(token),
    ]);
    if (!stillOpen) {
      await recordBookingError({
        errorCode: "slot_taken",
        errorMessage: BOOKING_FEEDBACK.slotTakenStale,
        httpStatus: 409,
        parentEmail,
        visitorId,
        startTime,
        attribution,
        qWho,
        field: "slot",
        retryable: false,
        payload: {
          sat_lp_variant: body.sat_lp_variant,
          lp_variant: body.lp_variant
        }
      });
      return funnelApiError(409, "slot_taken", {
        field: "slot",
        message: BOOKING_FEEDBACK.slotTakenStale,
        retryable: false,
        extra: { refresh_slots: true },
      });
    }

    const result = await bookStrategyCallInvitee(
      token,
      {
        startTime,
        parentName,
        parentEmail,
        parentPhone,
        kidName,
      },
      { meta }
    );

    const email = parentEmail.toLowerCase();
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data: lead } = await supabase
        .from("leads")
        .select("id, visitor_id")
        .eq("parent_email", email)
        .maybeSingle();

      if (lead) {
        await supabase
          .from("leads")
          .update({
            stage: "call_booked",
            booked_call_at: result.startTime,
            calendly_event_uri: result.inviteeUri,
          })
          .eq("id", lead.id);

        const touchVisitorId = lead.visitor_id ?? visitorId;
        const touchContext =
          touchVisitorId && touchVisitorId !== visitorId
            ? await resolveVisitorContext({
                visitorId: touchVisitorId,
                attribution,
                qWho
              })
            : { attribution, qWho };
        await appendTouchEvent({
          visitor_id: touchVisitorId ?? undefined,
          lead_id: lead.id,
          event_type: "call_booked",
          source: "server",
          attribution: touchContext.attribution,
          payload: {
            calendly_uri: result.inviteeUri,
            strategy_call_at: result.startTime,
            qWho: touchContext.qWho,
            sat_lp_variant: body.sat_lp_variant,
            lp_variant: body.lp_variant
          },
        });
      }
    }

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    if (err instanceof CalendlyBookError) {
      console.error("[funnel/calendly-book]", err.code, err.message);
      await recordBookingError({
        errorCode: err.code,
        errorMessage: err.message,
        httpStatus: err.httpStatus,
        parentEmail,
        visitorId,
        startTime,
        attribution,
        qWho,
        field: err.field,
        retryable: err.code === "slot_taken" ? false : err.httpStatus >= 500,
        payload: {
          sat_lp_variant: body.sat_lp_variant,
          lp_variant: body.lp_variant
        }
      });
      return funnelApiError(err.httpStatus, err.code, {
        field: err.field,
        message: err.message,
        retryable: err.code === "slot_taken" ? false : err.httpStatus >= 500,
        extra: err.code === "slot_taken" ? { refresh_slots: true } : undefined,
      });
    }

    const message = err instanceof Error ? err.message : "Calendly booking failed";
    const code = classifyBookingError(message, { httpStatus: 502 });
    console.error("[funnel/calendly-book]", message);
    await recordBookingError({
      errorCode: code,
      errorMessage: message,
      httpStatus: 502,
      parentEmail,
      visitorId,
      startTime,
      attribution,
      qWho,
      retryable: true,
      payload: {
        sat_lp_variant: body.sat_lp_variant,
        lp_variant: body.lp_variant
      }
    });
    return funnelApiError(502, code, { retryable: true });
  }
}
