import { NextResponse } from "next/server";
import { bookFreeLessonInvitee } from "@/lib/calendly/book-free-lesson";
import {
  fetchEventTypeBookingMeta,
  isSlotStillAvailable,
} from "@/lib/calendly/funnel-availability";
import { CalendlyBookError } from "@/lib/calendly/book-invitee-errors";
import {
  classifyBookingError,
  sanitizeBookingErrorMessage,
  type QuizBookingErrorCode,
} from "@/lib/calendly/booking-errors";
import { funnelApiError } from "@/lib/calendly/funnel-api-errors";
import {
  countPhoneDigits,
  isSamePhoneNumber,
  isValidBookingPhone,
} from "@/lib/calendly/phone-e164";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { appendTouchEvent } from "@/lib/crm/touch";
import { notifyLabFreeLessonBooked } from "@/lib/crm/lab-free-lesson-notify";
import {
  mergeAttribution,
  sanitizeAttributionSnapshot,
  type AttributionSnapshot,
} from "@/lib/attribution";
import { getVisitorById } from "@/lib/crm/visitors";
import { site } from "@/lib/site";
import { setPortalSessionCookie } from "@/lib/portal-auth";
import {
  attributionFromLeadFbclid,
  metaCapiUserFromLead,
  sendMetaCapiEvent,
} from "@/lib/meta-capi";
import { trackKlaviyoEvent } from "@/lib/klaviyo-server";
import { KlaviyoEvents } from "@/lib/analytics-registry";
import { PLAN_BUILDER_FUNNEL_ID, PLAN_BUILDER_VARIANT } from "@/lib/quiz-funnel-b/constants";

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

function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

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
      funnel: PLAN_BUILDER_FUNNEL_ID,
      plan_builder_variant: PLAN_BUILDER_VARIANT,
      step: "b-book",
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
    qWho: typeof body.qWho === "string" ? body.qWho : undefined,
  });
  const attribution = resolved.attribution;
  const qWho = resolved.qWho;

  const token = process.env.CALENDLY_API_TOKEN?.trim();
  if (!token) {
    await recordBookingError({
      errorCode: "calendly_api",
      errorMessage: "Booking is temporarily unavailable. Please try again shortly.",
      httpStatus: 503,
      parentEmail,
      visitorId,
      startTime,
      attribution,
      qWho,
      retryable: false,
    });
    return funnelApiError(503, "calendly_api", {
      retryable: false,
      message: "Booking is temporarily unavailable. Please try again shortly.",
    });
  }

  if (!startTime) {
    return funnelApiError(400, "no_slot", { field: "slot" });
  }
  if (!parentName) {
    return funnelApiError(400, "invalid_contact", {
      field: "parentName",
      message: "Please enter your name.",
    });
  }
  if (!parentEmail.includes("@")) {
    return funnelApiError(400, "invalid_contact", {
      field: "parentEmail",
      message: "Please enter a valid email.",
    });
  }
  if (!parentPhone || !isValidBookingPhone(parentPhone)) {
    return funnelApiError(400, "invalid_phone", {
      field: "parentPhone",
      message: "Please enter a valid US mobile number.",
      extra: { phone_digit_count: countPhoneDigits(parentPhone ?? "") },
    });
  }

  // The OTP is bound to a number, so reject a phone swapped in after verifying.
  // Only an outright mismatch blocks: this screen has no OTP step to recover on,
  // and b-phone already required verification to reach it.
  const supabaseForVerify = getSupabaseAdmin();
  if (supabaseForVerify && parentEmail) {
    const { data: leadForVerify } = await supabaseForVerify
      .from("leads")
      .select("phone_verified_phone")
      .eq("parent_email", parentEmail.toLowerCase())
      .maybeSingle();
    const verifiedPhone =
      typeof leadForVerify?.phone_verified_phone === "string"
        ? leadForVerify.phone_verified_phone
        : null;
    if (verifiedPhone && !isSamePhoneNumber(verifiedPhone, parentPhone)) {
      return funnelApiError(400, "invalid_phone", {
        field: "parentPhone",
        message:
          "That number does not match the one you verified. Use the verified number or request a new code.",
      });
    }
  }

  const freeLessonUrl = site.freeLessonCalendlyUrl;

  try {
    const [stillOpen, meta] = await Promise.all([
      isSlotStillAvailable(token, startTime, freeLessonUrl),
      fetchEventTypeBookingMeta(token, freeLessonUrl),
    ]);
    if (!stillOpen) {
      await recordBookingError({
        errorCode: "slot_taken",
        errorMessage: "That time was just taken. Pick another open slot.",
        httpStatus: 409,
        parentEmail,
        visitorId,
        startTime,
        attribution,
        qWho,
        field: "slot",
        retryable: false,
      });
      return funnelApiError(409, "slot_taken", {
        field: "slot",
        message: "That time was just taken. Pick another open slot.",
        retryable: false,
        extra: { refresh_slots: true },
      });
    }

    const result = await bookFreeLessonInvitee(
      token,
      {
        startTime,
        parentName,
        parentEmail,
        parentPhone,
        kidName,
      },
      { meta, publicUrl: freeLessonUrl }
    );

    const email = parentEmail.toLowerCase();
    const supabase = getSupabaseAdmin();
    let leadId: string | undefined;

    if (supabase) {
      const { data: lead } = await supabase
        .from("leads")
        .select(
          "id, visitor_id, parent_email, parent_first, parent_last, parent_phone, fbclid, meta_fbp, meta_fbc, meta_fbc_ts, meta_client_ip, meta_client_user_agent"
        )
        .eq("parent_email", email)
        .maybeSingle();

      if (lead) {
        leadId = lead.id;
        await supabase
          .from("leads")
          .update({
            stage: "call_booked",
            booked_call_at: result.startTime,
            calendly_event_uri: result.inviteeUri,
            plan_builder_variant: PLAN_BUILDER_VARIANT,
          })
          .eq("id", lead.id);

        const callRow = {
          lead_id: lead.id,
          call_at: result.startTime,
          scheduled_start: result.startTime,
          calendly_invitee_uri: result.inviteeUri,
          call_status: "booked" as const,
          call_type: "free_lesson" as const,
        };

        const { data: existingCall } = await supabase
          .from("lead_calls")
          .select("id")
          .eq("calendly_invitee_uri", result.inviteeUri)
          .maybeSingle();

        if (existingCall) {
          await supabase.from("lead_calls").update(callRow).eq("id", existingCall.id);
        } else {
          await supabase.from("lead_calls").insert(callRow);
        }

        const touchVisitorId = lead.visitor_id ?? visitorId;
        await appendTouchEvent({
          visitor_id: touchVisitorId ?? undefined,
          lead_id: lead.id,
          event_type: "lab_lesson_booked",
          source: "server",
          attribution,
          payload: {
            calendly_uri: result.inviteeUri,
            free_lesson_at: result.startTime,
            funnel: PLAN_BUILDER_FUNNEL_ID,
            plan_builder_variant: PLAN_BUILDER_VARIANT,
            qWho,
            sat_lp_variant: body.sat_lp_variant,
            lp_variant: body.lp_variant,
          },
        });

        const { first: parentFirst } = splitName(parentName);
        void notifyLabFreeLessonBooked({
          parentEmail: email,
          parentFirst,
          studentFirst: kidName,
          lessonStartIso: result.startTime,
          calendlyUri: result.inviteeUri,
          portalUrl: `${site.url}/portal/home`,
          leadId: lead.id,
          visitorId: touchVisitorId ?? visitorId,
          satLpVariant: body.sat_lp_variant,
          lpVariant: body.lp_variant,
        });

        void trackKlaviyoEvent(email, KlaviyoEvents.freeLessonBooked, {
          funnel: PLAN_BUILDER_FUNNEL_ID,
          free_lesson_at: result.startTime,
          calendly_uri: result.inviteeUri,
          plan_builder_variant: PLAN_BUILDER_VARIANT,
        });

        const inviteeId = result.inviteeUri.split("/").pop();
        const scheduleEventId = inviteeId
          ? `schedule_${inviteeId}`
          : `schedule_${lead.id}`;
        void sendMetaCapiEvent(
          "Schedule",
          scheduleEventId,
          metaCapiUserFromLead({ ...lead, parent_email: email }, email),
          {
            funnel: PLAN_BUILDER_FUNNEL_ID,
            call_type: "free_lesson",
            plan_builder_variant: PLAN_BUILDER_VARIANT,
            qWho: qWho ?? "",
            sat_lp_variant: body.sat_lp_variant ?? "",
            lp_variant: body.lp_variant ?? "",
          },
          attributionFromLeadFbclid(lead.fbclid) ?? attribution,
          { eventTimeSec: Math.floor(Date.now() / 1000) }
        );
      }
    }

    const inviteeIdForClient = result.inviteeUri.split("/").pop();
    const scheduleEventIdForClient = inviteeIdForClient
      ? `schedule_${inviteeIdForClient}`
      : undefined;

    const response = NextResponse.json({
      ok: true,
      ...result,
      portalUrl: "/portal/home",
      funnel: PLAN_BUILDER_FUNNEL_ID,
      eventId: scheduleEventIdForClient,
    });

    if (leadId) {
      setPortalSessionCookie(response, leadId, email);
    }

    return response;
  } catch (err) {
    if (err instanceof CalendlyBookError) {
      console.error("[funnel-b/calendly-book]", err.code, err.message);
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
    console.error("[funnel-b/calendly-book]", message);
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
    });
    return funnelApiError(502, code, { retryable: true });
  }
}
