/**
 * LOCKED — Sohail Yousaf custom enrollment finalize API (sent Jun 2026).
 *
 * Serves Sohail's `/enroll/sohail-shermeen` page only. New enrollment pages
 * use `app/api/standard-enroll/finalize/route.ts`. Editing this file risks
 * breaking the live enrollment link Sohail already has.
 *
 * See: app/enroll/sohail-shermeen/LOCK.md
 */
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { site } from "@/lib/site";
import {
  completePostCallEnrollAfterSubscription,
  finalizeRequestMeta
} from "@/lib/post-call-enroll-finalize";

type FinalizePayload = {
  paymentIntentId?: string;
  fbp?: string;
  fbc?: string;
};

/**
 * Step 2 of the on-page checkout, called by the client after the diagnostic
 * PaymentIntent succeeds.
 */
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
    console.error("personalized-enroll finalize: PI retrieve failed", err);
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
      "personalized-enroll finalize: missing pieces on PI",
      paymentIntentId,
      { customerId, paymentMethodId, weeklyPriceId }
    );
    return NextResponse.json(
      { error: "Payment succeeded but enrollment setup failed. We will reach out." },
      { status: 502 }
    );
  }

  const trialDays = Number.parseInt(trialDaysRaw ?? "7", 10) || 7;

  let alreadyExisted = false;
  let subscriptionId: string;
  let status: string;
  let trialEndsAt: number | null | undefined;

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
      subscriptionId = matched.id;
      status = matched.status;
      trialEndsAt = matched.trial_end;
      alreadyExisted = true;
    } else {
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
          program: "personalized-enroll",
          flow_step: "weekly_subscription",
          diagnostic_payment_intent_id: paymentIntentId,
          enrollment_idempotency_key: paymentIntentId,
          lead_slug: leadSlug ?? "",
          parent_first: meta.parent_first ?? "",
          parent_last: meta.parent_last ?? "",
          parent_email: meta.parent_email ?? "",
          student_first: meta.student_first ?? "",
          advisor_full: meta.advisor_full ?? ""
        }
      });

      subscriptionId = subscription.id;
      status = subscription.status;
      trialEndsAt = subscription.trial_end;
    }
  } catch (err) {
    console.error(
      "personalized-enroll finalize: subscription create failed",
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

  const reqMeta = finalizeRequestMeta(request);
  const { crm } = await completePostCallEnrollAfterSubscription({
    stripe,
    enrollFlow: "personalized-enroll",
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    subscriptionStatus: status,
    referenceId: paymentIntentId,
    paymentIntentId,
    meta: {
      lead_slug: leadSlug ?? "",
      parent_first: meta.parent_first ?? "",
      parent_last: meta.parent_last ?? "",
      parent_email: meta.parent_email ?? "",
      student_first: meta.student_first ?? ""
    },
    alreadyExisted,
    clientIp: reqMeta.clientIp,
    clientUserAgent: reqMeta.clientUserAgent,
    tracking: { fbp: body.fbp, fbc: body.fbc }
  });

  if (!crm.ok) {
    console.error("personalized-enroll finalize: CRM write failed", crm);
  }

  return NextResponse.json({
    subscriptionId,
    status,
    trial_ends_at: trialEndsAt,
    already_existed: alreadyExisted,
    metaPurchaseEventId:
      crm.ok && "metaPurchaseEventId" in crm
        ? crm.metaPurchaseEventId
        : undefined,
    crmOk: crm.ok
  });
}
