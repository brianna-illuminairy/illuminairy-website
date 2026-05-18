import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import {
  handleCalendlyInviteeCanceled,
  handleCalendlyInviteeCreated
} from "@/lib/crm/calendly-webhook";

function verifyCalendlySignature(rawBody: string, signatureHeader: string | null) {
  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY?.trim();
  if (!signingKey || !signatureHeader) {
    return false;
  }

  const parts = signatureHeader.split(",");
  const tPart = parts.find((p) => p.startsWith("t="));
  const v1Part = parts.find((p) => p.startsWith("v1="));
  if (!tPart || !v1Part) {
    return false;
  }

  const timestamp = tPart.slice(2);
  const received = v1Part.slice(3);
  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = createHmac("sha256", signingKey)
    .update(signedPayload)
    .digest("hex");

  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(received));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY?.trim();
  if (!signingKey) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("Calendly-Webhook-Signature");

  if (!verifyCalendlySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let body: { event?: string; payload?: Record<string, unknown> };
  try {
    body = JSON.parse(rawBody) as { event?: string; payload?: Record<string, unknown> };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const event = body.event ?? "";

  if (event === "invitee.created") {
    await handleCalendlyInviteeCreated(body);
  } else if (event === "invitee.canceled") {
    await handleCalendlyInviteeCanceled(body);
  }

  return NextResponse.json({ received: true });
}
