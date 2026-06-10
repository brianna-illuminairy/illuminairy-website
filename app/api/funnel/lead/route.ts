import { NextResponse } from "next/server";
import { upsertLeadFromQuizFunnel, type QuizAnswersPayload } from "@/lib/crm/quiz-leads";
import {
  mergeAttribution,
  sanitizeAttributionSnapshot,
  type AttributionSnapshot
} from "@/lib/attribution";
import { buildKlaviyoQuizProperties } from "@/lib/klaviyo-quiz-props";
import { KlaviyoEvents } from "@/lib/analytics-registry";
import { upsertKlaviyoProfile, trackKlaviyoEvent } from "@/lib/klaviyo-server";
import { makeMetaEventId, sendMetaCapiEvent } from "@/lib/meta-capi";
import { getVisitorById } from "@/lib/crm/visitors";
import { funnelApiError } from "@/lib/calendly/funnel-api-errors";
import {
  sanitizeBookingErrorMessage,
  type QuizBookingErrorCode
} from "@/lib/calendly/booking-errors";
import { BOOKING_FEEDBACK } from "@/lib/quiz-funnel/booking-feedback";
import { appendTouchEvent } from "@/lib/crm/touch";

type Body = QuizAnswersPayload & {
  visitorId?: string;
  attribution?: AttributionSnapshot;
  company?: string;
  fbp?: string;
  fbc?: string;
  fbcTs?: number;
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

async function recordLeadBookingError(input: {
  body: Body;
  errorCode: QuizBookingErrorCode;
  message: string;
  httpStatus: number;
  field?: string;
  retryable?: boolean;
}) {
  const attr = input.body.attribution;
  await appendTouchEvent({
    visitor_id: input.body.visitorId,
    event_type: "booking_error",
    source: "server",
    attribution: attr,
    payload: {
      error_code: input.errorCode,
      error_message: sanitizeBookingErrorMessage(input.message),
      http_status: input.httpStatus,
      field: input.field,
      retryable: input.retryable,
      funnel: "sat_quiz",
      step: "s5",
      booking_phase: "lead_submit",
      qWho: input.body.qWho,
      sat_lp_variant: input.body.sat_lp_variant,
      lp_variant: input.body.lp_variant,
      utm_source: attr?.utm_source,
      utm_medium: attr?.utm_medium,
      utm_campaign: attr?.utm_campaign,
      utm_content: attr?.utm_content,
      utm_term: attr?.utm_term
    }
  });
}

function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

function isValidEmail(raw: string): boolean {
  const v = raw.trim();
  if (!v.includes("@")) return false;
  const [local, domain] = v.split("@");
  return Boolean(local?.length && domain?.includes("."));
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request.", error_code: "unknown" },
      { status: 400 }
    );
  }

  if (body.company) {
    return NextResponse.json({ ok: true });
  }
  const visitorId =
    typeof body.visitorId === "string" ? body.visitorId.trim() : undefined;
  const resolved = await resolveVisitorContext({
    visitorId,
    attribution: body.attribution,
    qWho: typeof body.qWho === "string" ? body.qWho : undefined
  });
  body = {
    ...body,
    visitorId,
    attribution: resolved.attribution,
    qWho: resolved.qWho
  };

  if (!body.confirmTcpa) {
    await recordLeadBookingError({
      body,
      errorCode: "tcpa_required",
      message: BOOKING_FEEDBACK.tcpaRequired,
      httpStatus: 400,
      field: "confirmTcpa",
      retryable: false
    });
    return funnelApiError(400, "tcpa_required", {
      field: "confirmTcpa",
      retryable: false,
      message: BOOKING_FEEDBACK.tcpaRequired
    });
  }

  const email = body.parentEmail?.trim() ?? "";
  const phone = body.parentPhone?.trim() ?? "";
  const name = body.parentName?.trim() ?? "";
  const kid = body.kidName?.trim() ?? "";

  if (!name) {
    await recordLeadBookingError({
      body,
      errorCode: "invalid_contact",
      message: BOOKING_FEEDBACK.nameRequired,
      httpStatus: 400,
      field: "parentName",
      retryable: false
    });
    return funnelApiError(400, "invalid_contact", {
      field: "parentName",
      retryable: false,
      message: BOOKING_FEEDBACK.nameRequired
    });
  }
  if (!email) {
    await recordLeadBookingError({
      body,
      errorCode: "invalid_contact",
      message: BOOKING_FEEDBACK.emailRequired,
      httpStatus: 400,
      field: "parentEmail",
      retryable: false
    });
    return funnelApiError(400, "invalid_contact", {
      field: "parentEmail",
      retryable: false,
      message: BOOKING_FEEDBACK.emailRequired
    });
  }
  if (!isValidEmail(email)) {
    await recordLeadBookingError({
      body,
      errorCode: "invalid_contact",
      message: BOOKING_FEEDBACK.emailInvalid,
      httpStatus: 400,
      field: "parentEmail",
      retryable: false
    });
    return funnelApiError(400, "invalid_contact", {
      field: "parentEmail",
      retryable: false,
      message: BOOKING_FEEDBACK.emailInvalid
    });
  }
  if (!phone) {
    await recordLeadBookingError({
      body,
      errorCode: "invalid_contact",
      message: BOOKING_FEEDBACK.phoneRequired,
      httpStatus: 400,
      field: "parentPhone",
      retryable: false
    });
    return funnelApiError(400, "invalid_contact", {
      field: "parentPhone",
      retryable: false,
      message: BOOKING_FEEDBACK.phoneRequired
    });
  }
  if (!kid) {
    await recordLeadBookingError({
      body,
      errorCode: "invalid_contact",
      message: BOOKING_FEEDBACK.kidRequired,
      httpStatus: 400,
      field: "kidName",
      retryable: false
    });
    return funnelApiError(400, "invalid_contact", {
      field: "kidName",
      retryable: false,
      message: BOOKING_FEEDBACK.kidRequired
    });
  }

  const result = await upsertLeadFromQuizFunnel(body, {
    visitorId: body.visitorId,
    attribution: body.attribution,
    metaMatch: {
      fbp: body.fbp,
      fbc: body.fbc,
      fbcTs: typeof body.fbcTs === "number" ? body.fbcTs : undefined,
      clientIp:
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        request.headers.get("x-real-ip") ??
        undefined,
      clientUserAgent: request.headers.get("user-agent") ?? undefined
    }
  });

  if (!result.ok) {
    console.error("[funnel/lead]", result.error);
    const isDev = process.env.NODE_ENV === "development";
    let message = "Could not save your details. Please try again.";
    if (isDev) {
      if (result.error === "supabase_not_configured") {
        message =
          "Database not configured: add SUPABASE_SERVICE_ROLE_KEY to .env.local (Supabase → Project Settings → API → service_role), then restart the dev server.";
      } else {
        message = `Could not save your details: ${result.error}`;
      }
    }
    await recordLeadBookingError({
      body,
      errorCode: "lead_save_failed",
      message,
      httpStatus: 500,
      retryable: true
    });
    return funnelApiError(500, "lead_save_failed", {
      retryable: true,
      message
    });
  }

  const { first, last } = splitName(name);
  const visitorRow = body.visitorId
    ? await getVisitorById(body.visitorId)
    : null;
  const klaviyoProps = {
    ...buildKlaviyoQuizProperties({
      answers: body,
      attribution: result.attribution,
      quizFurthestStep:
        (visitorRow?.quiz_furthest_step as string | undefined) ?? "s5",
      satLpVariant: body.sat_lp_variant ?? undefined
    }),
    lead_source: result.leadSource,
    ...(body.lp_variant ? { lp_variant: body.lp_variant } : {})
  };

  void upsertKlaviyoProfile(result.email, {
    firstName: first,
    lastName: last,
    phone,
    properties: klaviyoProps
  });
  void trackKlaviyoEvent(result.email, KlaviyoEvents.quizLeadSubmitted, klaviyoProps);

  const eventId = makeMetaEventId("lead", result.leadId);
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    undefined;
  const clientUserAgent = request.headers.get("user-agent") ?? undefined;

  void sendMetaCapiEvent(
    "Lead",
    eventId,
    {
      email: result.email,
      phone,
      firstName: first,
      lastName: last,
      externalId: result.leadId,
      clientIp,
      clientUserAgent,
      fbp: body.fbp,
      fbc: body.fbc,
      fbcTs: typeof body.fbcTs === "number" ? body.fbcTs : undefined
    },
    {
      funnel: "sat_quiz",
      qWho: body.qWho ?? "",
      qScoreLower: body.qScoreLower ?? "",
      q1: body.q1 ?? "",
      q4: body.q4 ?? "",
      sat_lp_variant: body.sat_lp_variant ?? "",
      lp_variant: body.lp_variant ?? ""
    },
    result.attribution,
    { eventTimeSec: Math.floor(Date.now() / 1000) }
  );

  return NextResponse.json({ ok: true, leadId: result.leadId, eventId });
}
