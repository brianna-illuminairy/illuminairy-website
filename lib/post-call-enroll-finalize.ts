import type Stripe from "stripe";
import { recordPostCallEnrollCompletion } from "@/lib/crm/enrollment";

export type PostCallFinalizeMeta = {
  fbp?: string;
  fbc?: string;
};

export async function completePostCallEnrollAfterSubscription(opts: {
  stripe: Stripe;
  enrollFlow: "standard-enroll" | "personalized-enroll";
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  subscriptionStatus: string;
  referenceId: string;
  setupIntentId?: string;
  paymentIntentId?: string;
  meta: Record<string, string>;
  diagnosticWaived?: boolean;
  alreadyExisted: boolean;
  clientIp?: string;
  clientUserAgent?: string;
  tracking?: PostCallFinalizeMeta;
}) {
  const parentEmail = (opts.meta.parent_email ?? "").trim().toLowerCase();
  if (!parentEmail) {
    return { crm: { ok: false as const, error: "missing_parent_email" } };
  }

  let diagnosticCents = 0;
  if (opts.paymentIntentId && !opts.diagnosticWaived) {
    try {
      const pi = await opts.stripe.paymentIntents.retrieve(opts.paymentIntentId);
      diagnosticCents = pi.amount ?? 0;
    } catch (err) {
      console.warn("post-call enroll: PI amount lookup failed", err);
    }
  }

  let weeklyCents = 0;
  try {
    const sub = await opts.stripe.subscriptions.retrieve(
      opts.stripeSubscriptionId,
      { expand: ["items.data.price"] }
    );
    const item = sub.items.data[0];
    const price = item?.price;
    if (price && typeof price !== "string" && price.unit_amount != null) {
      weeklyCents = price.unit_amount;
    }
  } catch (err) {
    console.warn("post-call enroll: subscription price lookup failed", err);
  }

  const crm = await recordPostCallEnrollCompletion({
    enrollFlow: opts.enrollFlow,
    leadSlug: opts.meta.lead_slug ?? "",
    parentEmail,
    parentFirst: opts.meta.parent_first,
    parentLast: opts.meta.parent_last,
    studentFirst: opts.meta.student_first,
    stripeCustomerId: opts.stripeCustomerId,
    stripeSubscriptionId: opts.stripeSubscriptionId,
    referenceId: opts.referenceId,
    diagnosticCents,
    weeklyCents,
    diagnosticWaived: opts.diagnosticWaived,
    subscriptionStatus: opts.subscriptionStatus,
    alreadyExisted: opts.alreadyExisted,
    fbp: opts.tracking?.fbp,
    fbc: opts.tracking?.fbc,
    clientIp: opts.clientIp,
    clientUserAgent: opts.clientUserAgent
  });

  return { crm };
}

export function finalizeRequestMeta(request: Request) {
  return {
    clientIp:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      undefined,
    clientUserAgent: request.headers.get("user-agent") ?? undefined
  };
}
