import { NextResponse } from "next/server";
import { upsertLeadFromQuizFunnel, type QuizAnswersPayload } from "@/lib/crm/quiz-leads";
import type { AttributionSnapshot } from "@/lib/attribution";
import { upsertKlaviyoProfile, trackKlaviyoEvent } from "@/lib/klaviyo-server";
import { makeMetaEventId, sendMetaCapiEvent } from "@/lib/meta-capi";

type Body = QuizAnswersPayload & {
  visitorId?: string;
  attribution?: AttributionSnapshot;
  company?: string;
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
      { error: "Please confirm we may call you about the SAT program." },
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
    return NextResponse.json(
      { error: "Could not save your details. Please try again." },
      { status: 500 }
    );
  }

  const { first, last } = splitName(name);
  const klaviyoProps = {
    q1: body.q1 ?? "",
    q2: body.q2 ?? "",
    q3: body.q3 ?? "",
    q4: body.q4 ?? "",
    q5: body.q5 ?? "",
    q8: body.q8 ?? "",
    q9: body.q9 ?? "",
    q6: (body.q6 ?? []).join(","),
    q7: (body.q7 ?? []).join(","),
    target_score: body.q8 ?? "",
    gpa_band: body.q9 ?? "",
    promised_gain_pts: result.promisedGain ?? "",
    showed_gpa_gap: result.showedGpaGap ? "yes" : "no",
    lead_source: result.leadSource,
    funnel: "sat_quiz"
  };

  void upsertKlaviyoProfile(result.email, {
    firstName: first,
    lastName: last,
    phone,
    properties: klaviyoProps
  });
  void trackKlaviyoEvent(result.email, "Quiz Lead Submitted", klaviyoProps);

  const eventId = makeMetaEventId("lead", result.leadId);
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    undefined;
  const clientUserAgent = request.headers.get("user-agent") ?? undefined;

  void sendMetaCapiEvent(
    "Lead",
    eventId,
    { email: result.email, phone, clientIp, clientUserAgent },
    { funnel: "sat_quiz", q4: body.q4 ?? "" },
    result.attribution
  );

  return NextResponse.json({ ok: true, leadId: result.leadId, eventId });
}
