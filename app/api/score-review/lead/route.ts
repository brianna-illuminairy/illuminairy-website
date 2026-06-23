import { NextResponse } from "next/server";
import {
  mergeAttribution,
  sanitizeAttributionSnapshot,
  type AttributionSnapshot,
} from "@/lib/attribution";
import { buildKlaviyoQuizProperties } from "@/lib/klaviyo-quiz-props";
import { KlaviyoEvents } from "@/lib/analytics-registry";
import { upsertKlaviyoProfile, trackKlaviyoEvent } from "@/lib/klaviyo-server";
import { makeMetaEventId, sendMetaCapiEvent } from "@/lib/meta-capi";
import { getVisitorById } from "@/lib/crm/visitors";
import { funnelApiError } from "@/lib/calendly/funnel-api-errors";
import {
  sanitizeBookingErrorMessage,
  type QuizBookingErrorCode,
} from "@/lib/calendly/booking-errors";
import { appendTouchEvent } from "@/lib/crm/touch";
import {
  upsertLeadFromScoreReviewFunnel,
  type ScoreReviewAnswersPayload,
} from "@/lib/crm/score-review-leads";
import {
  SCORE_REVIEW_FUNNEL_ID,
  SCORE_REVIEW_FUNNEL_KEY,
} from "@/lib/score-review-funnel/constants";

type Body = ScoreReviewAnswersPayload & {
  visitorId?: string;
  attribution?: AttributionSnapshot;
  company?: string;
  fbp?: string;
  fbc?: string;
  fbcTs?: number;
  lp_variant?: string;
};

async function resolveVisitorContext(input: {
  visitorId?: string;
  attribution?: AttributionSnapshot;
}) {
  const incoming = sanitizeAttributionSnapshot(input.attribution ?? {});
  if (!input.visitorId) {
    return { attribution: incoming };
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
  return { attribution: mergeAttribution(withLast, incoming) };
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
      funnel: SCORE_REVIEW_FUNNEL_KEY,
      step: "sr-book",
      booking_phase: "lead_submit",
      lp_variant: input.body.lp_variant,
      utm_source: attr?.utm_source,
      utm_medium: attr?.utm_medium,
      utm_campaign: attr?.utm_campaign,
      utm_content: attr?.utm_content,
      utm_term: attr?.utm_term,
    },
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
  });
  body = { ...body, visitorId, attribution: resolved.attribution };

  if (!body.confirmTcpa) {
    await recordLeadBookingError({
      body,
      errorCode: "tcpa_required",
      message: "Please confirm you agree to receive texts about your score review.",
      httpStatus: 400,
      field: "confirmTcpa",
      retryable: false,
    });
    return funnelApiError(400, "tcpa_required", {
      field: "confirmTcpa",
      retryable: false,
      message: "Please confirm you agree to receive texts about your score review.",
    });
  }

  const email = body.parentEmail?.trim() ?? "";
  const phone = body.parentPhone?.trim() ?? "";
  const name = body.parentName?.trim() ?? "";
  const kid = body.kidName?.trim() ?? "";

  if (!name) {
    return funnelApiError(400, "invalid_contact", {
      field: "parentName",
      retryable: false,
      message: "Please enter your name.",
    });
  }
  if (!email || !isValidEmail(email)) {
    return funnelApiError(400, "invalid_contact", {
      field: "parentEmail",
      retryable: false,
      message: "Please enter a valid email.",
    });
  }
  if (!phone) {
    return funnelApiError(400, "invalid_contact", {
      field: "parentPhone",
      retryable: false,
      message: "Please enter your phone number.",
    });
  }
  if (!kid) {
    return funnelApiError(400, "invalid_contact", {
      field: "kidName",
      retryable: false,
      message: "Please enter your student's first name.",
    });
  }

  const result = await upsertLeadFromScoreReviewFunnel(body, {
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
      clientUserAgent: request.headers.get("user-agent") ?? undefined,
    },
  });

  if (!result.ok) {
    console.error("[score-review/lead]", result.error);
    const isDev = process.env.NODE_ENV === "development";
    let message = "Could not save your details. Please try again.";
    if (isDev && result.error === "supabase_not_configured") {
      message =
        "Database not configured: add SUPABASE_SERVICE_ROLE_KEY to .env.local, then restart the dev server.";
    } else if (isDev) {
      message = `Could not save your details: ${result.error}`;
    }
    await recordLeadBookingError({
      body,
      errorCode: "lead_save_failed",
      message,
      httpStatus: 500,
      retryable: true,
    });
    return funnelApiError(500, "lead_save_failed", { retryable: true, message });
  }

  const { first, last } = splitName(name);
  const visitorRow = body.visitorId ? await getVisitorById(body.visitorId) : null;
  const klaviyoProps = {
    ...buildKlaviyoQuizProperties({
      answers: body,
      attribution: result.attribution,
      quizFurthestStep: (visitorRow?.quiz_furthest_step as string | undefined) ?? "sr-book",
    }),
    lead_source: result.leadSource,
    funnel: SCORE_REVIEW_FUNNEL_ID,
    school_referral: body.srSchoolReferral ?? "",
    ...(body.lp_variant ? { lp_variant: body.lp_variant } : {}),
  };

  void upsertKlaviyoProfile(result.email, {
    firstName: first,
    lastName: last,
    phone,
    properties: klaviyoProps,
  });
  void trackKlaviyoEvent(result.email, KlaviyoEvents.scoreReviewLeadSubmitted, klaviyoProps);

  const eventId = makeMetaEventId("sr_lead", result.leadId);
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
      fbcTs: typeof body.fbcTs === "number" ? body.fbcTs : undefined,
    },
    {
      funnel: SCORE_REVIEW_FUNNEL_ID,
      srGrade: body.srGrade ?? "",
      srRecentScore: body.srRecentScore ?? "",
      lp_variant: body.lp_variant ?? "",
    },
    result.attribution,
    { eventTimeSec: Math.floor(Date.now() / 1000) }
  );

  await appendTouchEvent({
    visitor_id: body.visitorId,
    lead_id: result.leadId,
    event_type: "score_review_lead_submitted",
    attribution: result.attribution,
    source: "server",
    payload: {
      parent_email: result.email,
      funnel: SCORE_REVIEW_FUNNEL_KEY,
    },
  });

  return NextResponse.json({ ok: true, leadId: result.leadId, eventId });
}
