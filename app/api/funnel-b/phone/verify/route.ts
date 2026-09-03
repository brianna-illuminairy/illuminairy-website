import { NextResponse } from "next/server";
import {
  funnelBVerifyErrorMessage,
  isFunnelBVerifyConfigured,
  verifyFunnelBPhoneIdToken,
} from "@/lib/funnel-b-verify";
import { appendTouchEvent } from "@/lib/crm/touch";
import { PLAN_BUILDER_VARIANT } from "@/lib/quiz-funnel-b/constants";

export async function POST(request: Request) {
  if (!isFunnelBVerifyConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "verify_not_configured",
        message: funnelBVerifyErrorMessage("firebase_not_configured"),
      },
      { status: 503 }
    );
  }

  let body: { phone?: string; idToken?: string; visitorId?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const idToken = typeof body.idToken === "string" ? body.idToken.trim() : "";

  if (!phone || !idToken) {
    return NextResponse.json(
      {
        ok: false,
        error: "phone_and_token_required",
        message: funnelBVerifyErrorMessage("id_token_required"),
      },
      { status: 400 }
    );
  }

  const result = await verifyFunnelBPhoneIdToken({ phone, idToken });

  if (!result.ok) {
    const status =
      result.error === "invalid_phone" ||
      result.error === "id_token_required" ||
      result.error === "invalid_id_token" ||
      result.error === "invalid_token_provider" ||
      result.error === "phone_mismatch"
        ? 400
        : 502;

    return NextResponse.json(
      {
        ok: false,
        error: result.error,
        channel: result.channel,
        message: funnelBVerifyErrorMessage(result.error),
      },
      { status }
    );
  }

  await appendTouchEvent({
    visitor_id: typeof body.visitorId === "string" ? body.visitorId.trim() : undefined,
    event_type: "lab_phone_verified",
    source: "server",
    payload: {
      funnel: "sat_quiz_b",
      plan_builder_variant: PLAN_BUILDER_VARIANT,
      verify_channel: result.channel,
    },
  });

  return NextResponse.json({
    ok: true,
    verifiedAt: result.verifiedAt,
    phoneVerifiedAt: result.verifiedAt,
    verifiedPhone: result.verifiedPhone,
    channel: result.channel,
  });
}
