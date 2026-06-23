import { NextResponse } from "next/server";
import { checkPhoneVerification, isTwilioVerifyConfigured } from "@/lib/twilio-verify";
import { appendTouchEvent } from "@/lib/crm/touch";
import { SCORE_REVIEW_FUNNEL_KEY } from "@/lib/score-review-funnel/constants";

export async function POST(request: Request) {
  if (!isTwilioVerifyConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Phone verification is not configured." },
      { status: 503 }
    );
  }

  let body: { phone?: string; code?: string; visitorId?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!phone || !code) {
    return NextResponse.json({ ok: false, error: "Phone and code are required." }, { status: 400 });
  }

  const result = await checkPhoneVerification(phone, code);
  if (!result.ok) {
    const status =
      result.error === "invalid_phone" || result.error === "invalid_code" ? 400 : 502;
    return NextResponse.json({ ok: false, error: result.error }, { status });
  }

  await appendTouchEvent({
    visitor_id: typeof body.visitorId === "string" ? body.visitorId.trim() : undefined,
    event_type: "score_review_phone_verified",
    source: "server",
    payload: { funnel: SCORE_REVIEW_FUNNEL_KEY },
  });

  return NextResponse.json({
    ok: true,
    verifiedAt: result.verifiedAt,
    phoneVerifiedAt: result.verifiedAt,
  });
}
