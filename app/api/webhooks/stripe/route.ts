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
    const meta = session.metadata ?? {};
    const amountCents = session.amount_total ?? 0;
    const amountFormatted = `$${(amountCents / 100).toFixed(2)}`;

    const studentName = [meta.studentFirstName, meta.studentLastName]
      .filter(Boolean)
      .join(" ");
    const parentName = [meta.parentFirstName, meta.parentLastName]
      .filter(Boolean)
      .join(" ");
    const legacyParentName = meta.parentName as string | undefined;

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      const inbox = process.env.CONTACT_INBOX || site.supportEmail;
      const from =
        process.env.RESEND_FROM_EMAIL || "Illuminairy <onboarding@resend.dev>";

      await resend.emails.send({
        from,
        to: inbox,
        subject: `New SAT enrollment paid · ${studentName || parentName || legacyParentName || "Family"}`,
        text: [
          `New enrollment payment received.`,
          "",
          `Student: ${studentName || "—"}`,
          `Student email: ${meta.studentEmail ?? "—"}`,
          `Student phone: ${meta.studentPhone ?? "—"}`,
          `Student zip: ${meta.studentZipCode ?? "—"}`,
          "",
          `Parent/guardian: ${parentName || legacyParentName || "—"}`,
          `Parent email: ${meta.parentEmail ?? session.customer_email ?? "—"}`,
          `Parent phone: ${meta.parentPhone ?? "—"}`,
          "",
          `Program: ${meta.program ?? "—"}`,
          `Amount: ${amountFormatted}`,
          `Session ID: ${session.id}`,
          "",
          `Next steps: student account setup, mentor match, parent onboarding email.`
        ].join("\n")
      });
    } else {
      console.log("Enrollment paid (Resend not configured):", session.id);
    }
  }

  return NextResponse.json({ received: true });
}
