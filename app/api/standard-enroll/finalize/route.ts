/**
 * Standard enrollment finalize API.
 *
 * Step 2 of the on-page checkout. Mirrors Sohail's
 * `app/api/personalized-enroll/finalize/route.ts` shape — reads the
 * customer + payment method off the succeeded PaymentIntent and creates
 * the weekly tutoring Subscription with a 7-day trial.
 *
 * Idempotent: if a subscription already exists for this customer with the
 * matching `diagnostic_payment_intent_id` metadata, we return that one
 * instead of creating a duplicate.
 *
 * Isolated from Sohail's stack on purpose. Do not import from
 * `lib/personalized-enroll.ts` here.
 */
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { site } from "@/lib/site";

type FinalizePayload = {
  paymentIntentId?: string;
};

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        error: `Checkout is not configured yet. Email ${site.supportEmail} to enroll.`
      },
      { status: 503 }
    );
  }

  let body: FinalizePayload;
  try {
    body = (await request.json()) as FinalizePayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const paymentIntentId = (body.paymentIntentId ?? "").trim();
  if (!paymentIntentId) {
    return NextResponse.json(
      { error: "Missing payment intent." },
      { status: 400 }
    );
  }

  const stripe = getStripe();

  let pi;
  try {
    pi = await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (err) {
    console.error("standard-enroll finalize: PI retrieve failed", err);
    return NextResponse.json(
      { error: "Could not verify payment. Please contact support." },
      { status: 502 }
    );
  }

  if (pi.status !== "succeeded") {
    return NextResponse.json(
      {
        error: `Payment is not yet complete (status: ${pi.status}). Try again in a moment.`
      },
      { status: 409 }
    );
  }

  const customerId = typeof pi.customer === "string" ? pi.customer : null;
  const paymentMethodId =
    typeof pi.payment_method === "string" ? pi.payment_method : null;
  const meta = pi.metadata ?? {};
  const weeklyPriceId = meta.weekly_price_id;
  const trialDaysRaw = meta.weekly_trial_days;
  const leadSlug = meta.lead_slug;

  if (!customerId || !paymentMethodId || !weeklyPriceId) {
    console.error(
      "standard-enroll finalize: missing pieces on PI",
      paymentIntentId,
      { customerId, paymentMethodId, weeklyPriceId }
    );
    return NextResponse.json(
      { error: "Payment succeeded but enrollment setup failed. We will reach out." },
      { status: 502 }
    );
  }

  const trialDays = Number.parseInt(trialDaysRaw ?? "7", 10) || 7;

  try {
    const existing = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 10
    });
    const matched = existing.data.find(
      (s) => s.metadata?.diagnostic_payment_intent_id === paymentIntentId
    );
    if (matched) {
      return NextResponse.json({
        subscriptionId: matched.id,
        status: matched.status,
        already_existed: true
      });
    }
  } catch (err) {
    console.warn("standard-enroll finalize: idempotency check failed", err);
  }

  try {
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId }
    });

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: weeklyPriceId, quantity: 1 }],
      trial_period_days: trialDays,
      default_payment_method: paymentMethodId,
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription"
      },
      metadata: {
        program: "standard-enroll",
        flow_step: "weekly_subscription",
        diagnostic_payment_intent_id: paymentIntentId,
        lead_slug: leadSlug ?? "",
        parent_first: meta.parent_first ?? "",
        parent_last: meta.parent_last ?? "",
        parent_email: meta.parent_email ?? "",
        student_first: meta.student_first ?? "",
        advisor_full: meta.advisor_full ?? ""
      }
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      status: subscription.status,
      trial_ends_at: subscription.trial_end,
      already_existed: false
    });
  } catch (err) {
    console.error(
      "standard-enroll finalize: subscription create failed",
      err,
      { paymentIntentId }
    );
    return NextResponse.json(
      {
        error:
          "We charged the diagnostic but could not enroll the weekly tutoring automatically. We will reach out within 1 business day to complete it. Reference: " +
          paymentIntentId
      },
      { status: 502 }
    );
  }
}
