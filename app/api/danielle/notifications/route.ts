import { NextResponse } from "next/server";
import { getDanielleSessionEmail, isDanielleAuthenticated } from "@/lib/danielle-auth";
import { dispatchDaniellePortalUpdates } from "@/lib/danielle-portal-notify";
import {
  getDanielleNotifySubscription,
  isDanielleNotifyConfigured,
  upsertDanielleNotifySubscription
} from "@/lib/danielle-portal-subscriptions";

export async function GET() {
  const authed = await isDanielleAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const email = await getDanielleSessionEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isDanielleNotifyConfigured()) {
    return NextResponse.json({
      configured: false,
      subscription: null
    });
  }

  const subscription = await getDanielleNotifySubscription(email);

  return NextResponse.json({
    configured: true,
    subscription
  });
}

export async function POST(request: Request) {
  const authed = await isDanielleAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const email = await getDanielleSessionEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isDanielleNotifyConfigured()) {
    return NextResponse.json({ error: "Notifications are not configured yet." }, { status: 503 });
  }

  let body: {
    phone?: string;
    emailOptIn?: boolean;
    smsOptIn?: boolean;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const emailOptIn = Boolean(body.emailOptIn);
  const smsOptIn = Boolean(body.smsOptIn);

  if (!emailOptIn && !smsOptIn) {
    return NextResponse.json(
      { error: "Choose at least one notification method." },
      { status: 400 }
    );
  }

  const saved = await upsertDanielleNotifySubscription({
    email,
    phone: body.phone,
    emailOptIn,
    smsOptIn
  });

  if (!saved.ok) {
    if (saved.error === "invalid_phone") {
      return NextResponse.json({ error: "Enter a valid US phone number." }, { status: 400 });
    }
    if (saved.error === "phone_required_for_sms") {
      return NextResponse.json(
        { error: "Add a phone number to receive text alerts." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Could not save preferences." }, { status: 500 });
  }

  const dispatch = await dispatchDaniellePortalUpdates({ email });

  const subscription = await getDanielleNotifySubscription(email);

  return NextResponse.json({
    ok: true,
    subscription,
    dispatched: dispatch.filter((row) => row.ok && row.skipped !== "already_sent").length
  });
}
