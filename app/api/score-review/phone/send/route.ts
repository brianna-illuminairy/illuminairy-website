import { NextResponse } from "next/server";
import { sendPhoneVerification, isTwilioVerifyConfigured } from "@/lib/twilio-verify";

export async function POST(request: Request) {
  if (!isTwilioVerifyConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Phone verification is not configured." },
      { status: 503 }
    );
  }

  let body: { phone?: string };
  try {
    body = (await request.json()) as { phone?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  if (!phone) {
    return NextResponse.json({ ok: false, error: "Phone is required." }, { status: 400 });
  }

  const result = await sendPhoneVerification(phone);
  if (!result.ok) {
    const status = result.error === "invalid_phone" ? 400 : 502;
    return NextResponse.json({ ok: false, error: result.error }, { status });
  }

  return NextResponse.json({ ok: true });
}
