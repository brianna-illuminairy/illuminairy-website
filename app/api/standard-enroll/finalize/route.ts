/**
 * Standard enrollment finalize API.
 *
 * Step 2 of the on-page checkout. Reads the customer + payment method off
 * a succeeded PaymentIntent, or a succeeded SetupIntent when the diagnostic
 * was waived, then creates the weekly tutoring Subscription with a 7-day trial.
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
  setupIntentId?: string;
  fbp?: string;
  fbc?: string;
};

async function createWeeklySubscription(opts: {
  customerId: string;
  paymentMethodId: string;
  weeklyPriceId: string;
  trialDays: number;
  leadSlug: string;
  meta: Record<string, string>;
  idempotencyKey: string;
  couponId?: string;
}) {
  const stripe = getStripe();

  try {
    const existing = await stripe.subscriptions.list({
      customer: opts.customerId,
      status: "all",
      limit: 10
    });
    const matched = existing.data.find(
      (s) => s.metadata?.enrollment_idempotency_key === opts.idempotencyKey
    );
    if (matched) {
      return {
        subscriptionId: matched.id,
        status: matched.status,
        trial_ends_at: matched.trial_end,
        already_existed: true as const
      };
    }
  } catch (err) {
    console.warn("standard-enroll finalize: idempotency check failed", err);
  }

  await stripe.customers.update(opts.customerId, {
    invoice_settings: { default_payment_method: opts.paymentMethodId }
  });

  const subscription = await stripe.subscriptions.create({
    customer: opts.customerId,
    items: [{ price: opts.weeklyPriceId, quantity: 1 }],
    trial_period_days: opts.trialDays > 0 ? opts.trialDays : undefined,
    ...(opts.couponId ? { discounts: [{ coupon: opts.couponId }] } : {}),
    default_payment_method: opts.paymentMethodId,
    payment_behavior: "default_incomplete",
    payment_settings: {
      save_default_payment_method: "on_subscription"
    },
    metadata: {
      program: "standard-enroll",
      flow_step: "weekly_subscription",
      enrollment_idempotency_key: opts.idempotencyKey,
      lead_slug: opts.leadSlug,
      ...opts.meta
    }
  });

  return {
    subscriptionId: subscription.id,
    status: subscription.status,
    trial_ends_at: subscription.trial_end,
    already_existed: false as const
  };
}

async function respondWithCrm(
  request: Request,
  body: FinalizePayload,
  result: {
    subscriptionId: string;
    status: string;
    trial_ends_at?: number | null;
    already_existed: boolean;
  },
  context: {
    customerId: string;
    referenceId: string;
    setupIntentId?: string;
    paymentIntentId?: string;
    meta: Record<string, string>;
    diagnosticWaived?: boolean;
  }
) {
  const stripe = getStripe();
  const reqMeta = finalizeRequestMeta(request);
  const { crm } = await completePostCallEnrollAfterSubscription({
    stripe,
    enrollFlow: "standard-enroll",
    stripeCustomerId: context.customerId,
    stripeSubscriptionId: result.subscriptionId,
    subscriptionStatus: result.status,
    referenceId: context.referenceId,
    setupIntentId: context.setupIntentId,
    paymentIntentId: context.paymentIntentId,
    meta: context.meta,
    diagnosticWaived: context.diagnosticWaived,
    alreadyExisted: result.already_existed,
    clientIp: reqMeta.clientIp,
    clientUserAgent: reqMeta.clientUserAgent,
    tracking: { fbp: body.fbp, fbc: body.fbc }
  });

  if (!crm.ok) {
    console.error("standard-enroll finalize: CRM write failed", crm);
  }

  return NextResponse.json({
    subscriptionId: result.subscriptionId,
    status: result.status,
    trial_ends_at: result.trial_ends_at,
    already_existed: result.already_existed,
    metaPurchaseEventId:
      crm.ok && "metaPurchaseEventId" in crm
        ? crm.metaPurchaseEventId
        : undefined,
    crmOk: crm.ok
  });
}

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
  const setupIntentId = (body.setupIntentId ?? "").trim();

  if (!paymentIntentId && !setupIntentId) {
    return NextResponse.json(
      { error: "Missing payment or setup intent." },
      { status: 400 }
    );
  }

  const stripe = getStripe();

  if (setupIntentId) {
    let si;
    try {
      si = await stripe.setupIntents.retrieve(setupIntentId);
    } catch (err) {
      console.error("standard-enroll finalize: SI retrieve failed", err);
      return NextResponse.json(
        { error: "Could not verify card setup. Please contact support." },
        { status: 502 }
      );
    }

    if (si.status !== "succeeded") {
      return NextResponse.json(
        {
          error: `Card setup is not yet complete (status: ${si.status}). Try again in a moment.`
        },
        { status: 409 }
      );
    }

    const customerId = typeof si.customer === "string" ? si.customer : null;
    const paymentMethodId =
      typeof si.payment_method === "string" ? si.payment_method : null;
    const meta = si.metadata ?? {};
    const weeklyPriceId = meta.weekly_price_id;
    const trialDaysRaw = meta.weekly_trial_days;
    const leadSlug = meta.lead_slug ?? "";

    if (!customerId || !paymentMethodId || !weeklyPriceId) {
      console.error(
        "standard-enroll finalize: missing pieces on SI",
        setupIntentId,
        { customerId, paymentMethodId, weeklyPriceId }
      );
      return NextResponse.json(
        { error: "Card saved but enrollment setup failed. We will reach out." },
        { status: 502 }
      );
    }

    const trialDays = Number.parseInt(trialDaysRaw ?? "7", 10) || 7;
    const couponId =
      typeof meta.regional_discount_coupon === "string" &&
      meta.regional_discount_coupon.trim()
        ? meta.regional_discount_coupon.trim()
        : undefined;

    try {
      const result = await createWeeklySubscription({
        customerId,
        paymentMethodId,
        weeklyPriceId,
        trialDays,
        leadSlug,
        couponId,
        meta: {
          setup_intent_id: setupIntentId,
          parent_first: meta.parent_first ?? "",
          parent_last: meta.parent_last ?? "",
          parent_email: meta.parent_email ?? "",
          student_first: meta.student_first ?? "",
          advisor_full: meta.advisor_full ?? "",
          family_diag_promo: meta.family_diag_promo ?? "",
          diagnostic_waived: "true"
        },
        idempotencyKey: setupIntentId
      });

      return respondWithCrm(request, body, result, {
        customerId,
        referenceId: setupIntentId,
        setupIntentId,
        meta: {
          lead_slug: leadSlug,
          parent_first: meta.parent_first ?? "",
          parent_last: meta.parent_last ?? "",
          parent_email: meta.parent_email ?? "",
          student_first: meta.student_first ?? ""
        },
        diagnosticWaived: true
      });
    } catch (err) {
      console.error(
        "standard-enroll finalize: subscription create failed (setup)",
        err,
        { setupIntentId }
      );
      return NextResponse.json(
        {
          error:
            "We saved your card but could not enroll weekly tutoring automatically. We will reach out within 1 business day to complete it. Reference: " +
            setupIntentId
        },
        { status: 502 }
      );
    }
  }

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
  const leadSlug = meta.lead_slug ?? "";

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
  const couponId =
    typeof meta.regional_discount_coupon === "string" &&
    meta.regional_discount_coupon.trim()
      ? meta.regional_discount_coupon.trim()
      : undefined;

  try {
    const result = await createWeeklySubscription({
      customerId,
      paymentMethodId,
      weeklyPriceId,
      trialDays,
      leadSlug,
      couponId,
      meta: {
        diagnostic_payment_intent_id: paymentIntentId,
        parent_first: meta.parent_first ?? "",
        parent_last: meta.parent_last ?? "",
        parent_email: meta.parent_email ?? "",
        student_first: meta.student_first ?? "",
        advisor_full: meta.advisor_full ?? ""
      },
      idempotencyKey: paymentIntentId
    });

    return respondWithCrm(request, body, result, {
      customerId,
      referenceId: paymentIntentId,
      paymentIntentId,
      meta: {
        lead_slug: leadSlug,
        parent_first: meta.parent_first ?? "",
        parent_last: meta.parent_last ?? "",
        parent_email: meta.parent_email ?? "",
        student_first: meta.student_first ?? ""
      }
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
