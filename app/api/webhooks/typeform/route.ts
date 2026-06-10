import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { parseTypeformEnrollmentWebhook } from "@/lib/crm/typeform-enrollment-parse";
import { recordEnrollmentFromTypeform } from "@/lib/crm/typeform-enrollment";

function verifyTypeformSignature(rawBody: string, signatureHeader: string | null) {
  const secret = process.env.TYPEFORM_WEBHOOK_SECRET?.trim();
  if (!secret || !signatureHeader) return false;

  const expected = `sha256=${createHmac("sha256", secret)
    .update(rawBody)
    .digest("base64")}`;

  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const secret = process.env.TYPEFORM_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("Typeform-Signature");

  if (!verifyTypeformSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const intake = parseTypeformEnrollmentWebhook(
    body as Parameters<typeof parseTypeformEnrollmentWebhook>[0]
  );
  if ("error" in intake) {
    console.error("[webhooks/typeform] parse:", intake.error);
    return NextResponse.json({ error: intake.error }, { status: 400 });
  }

  const result = await recordEnrollmentFromTypeform(intake);
  if (!result.ok) {
    console.error("[webhooks/typeform] CRM:", result.error);
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    received: true,
    duplicate: result.duplicate,
    enrollment_id: result.enrollmentId,
  });
}
