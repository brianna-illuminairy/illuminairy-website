import { NextResponse } from "next/server";
import { upsertLeadFromQuizFunnel, type QuizAnswersPayload } from "@/lib/crm/quiz-leads";
import type { AttributionSnapshot } from "@/lib/attribution";
import { buildKlaviyoQuizProperties } from "@/lib/klaviyo-quiz-props";
import { KlaviyoEvents } from "@/lib/analytics-registry";
import { upsertKlaviyoProfile, trackKlaviyoEvent } from "@/lib/klaviyo-server";
import { makeMetaEventId, sendMetaCapiEvent } from "@/lib/meta-capi";
import { getVisitorById } from "@/lib/crm/visitors";

type Body = QuizAnswersPayload & {
  visitorId?: string;
  attribution?: AttributionSnapshot;
  company?: string;
  fbp?: string;
  fbc?: string;
};

function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  if (!body.confirmTcpa) {
    return NextResponse.json(
      { error: "Please confirm we may contact you about the SAT program." },
      { status: 400 }
    );
  }

  const email = body.parentEmail?.trim() ?? "";
  const phone = body.parentPhone?.trim() ?? "";
  const name = body.parentName?.trim() ?? "";
  const kid = body.kidName?.trim() ?? "";

  if (!email || !phone || !name || !kid || !email.includes("@")) {
    return NextResponse.json(
      { error: "Please complete all required fields." },
      { status: 400 }
    );
  }

  const result = await upsertLeadFromQuizFunnel(body, {
    visitorId: body.visitorId,
    attribution: body.attribution
  });

  if (!result.ok) {
    console.error("[funnel/lead]", result.error);
    const isDev = process.env.NODE_ENV === "development";
    let error = "Could not save your details. Please try again.";
    if (isDev) {
      if (result.error === "supabase_not_configured") {
        error =
          "Database not configured: add SUPABASE_SERVICE_ROLE_KEY to .env.local (Supabase → Project Settings → API → service_role), then restart the dev server.";
      } else {
        error = `Could not save your details: ${result.error}`;
      }
    }
    return NextResponse.json({ error }, { status: 500 });
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
    lead_source: result.leadSource
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
      clientIp,
      clientUserAgent,
      fbp: body.fbp,
      fbc: body.fbc
    },
    {
      funnel: "sat_quiz",
      qWho: body.qWho ?? "",
      qScoreLower: body.qScoreLower ?? "",
      q1: body.q1 ?? "",
      q4: body.q4 ?? "",
      sat_lp_variant: body.sat_lp_variant ?? ""
    },
    result.attribution
  );

  return NextResponse.json({ ok: true, leadId: result.leadId, eventId });
}
