import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getStripe } from "@/lib/stripe";
import { site } from "@/lib/site";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  const stripe = getStripe();
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customerEmail = session.customer_email ?? "unknown";
    const meta = session.metadata ?? {};
    const amountCents = session.amount_total ?? 0;
    const amountFormatted = `$${(amountCents / 100).toFixed(2)}`;

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      const inbox = process.env.CONTACT_INBOX || site.supportEmail;
      const from =
        process.env.RESEND_FROM_EMAIL || "Illuminairy <onboarding@resend.dev>";

      await resend.emails.send({
        from,
        to: inbox,
        subject: `New SAT enrollment paid · ${customerEmail}`,
        text: [
          `New enrollment payment received.`,
          "",
          `Email: ${customerEmail}`,
          `Parent/guardian: ${meta.parentName ?? "—"}`,
          `Student: ${meta.studentName ?? "—"}`,
          `Program: ${meta.program ?? "—"}`,
          `Amount: ${amountFormatted}`,
          `Session ID: ${session.id}`,
          "",
          `Next step: send onboarding details to this family.`
        ].join("\n")
      });
    } else {
      console.log(
        "Enrollment paid (Resend not configured):",
        customerEmail,
        session.id
      );
    }
  }

  return NextResponse.json({ received: true });
}
