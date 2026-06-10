import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id")?.trim();
  if (!sessionId) {
    return NextResponse.json({ error: "session_id required." }, { status: 400 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Stripe not configured." }, { status: 503 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed." }, { status: 402 });
    }

    const meta = session.metadata ?? {};
    return NextResponse.json({
      ok: true,
      prefill: {
        parentFirst: meta.parentFirstName ?? "",
        parentLast: meta.parentLastName ?? "",
        parentPhone: meta.parentPhone ?? "",
        parentEmail: meta.parentEmail ?? session.customer_email ?? "",
        studentFirst: meta.studentFirstName ?? "",
        studentLast: meta.studentLastName ?? "",
        studentPhone: meta.studentPhone ?? "",
        studentEmail: meta.studentEmail ?? ""
      }
    });
  } catch (err) {
    console.error("[enroll/session]", err);
    return NextResponse.json({ error: "Invalid session." }, { status: 400 });
  }
}
