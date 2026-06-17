/**
 * Server-only checkout init for the standard enrollment page.
 *
 * Used by the page route so the Stripe PaymentIntent (or SetupIntent when
 * the diagnostic is waived) is created during SSR and the client never
 * has to spin a "Loading secure checkout..." state.
 *
 * Do not import this file from a client component — it uses the server-only
 * Stripe SDK and would leak secrets to the browser bundle.
 */
import { getStripe } from "@/lib/stripe";
import { type StandardEnrollLead, standardEnrollDiagnosticDescription } from "@/lib/standard-enroll";

export type StandardEnrollInit =
  | {
      ok: true;
      mode: "payment";
      clientSecret: string;
      paymentIntentId: string;
    }
  | {
      ok: true;
      mode: "setup";
      clientSecret: string;
      setupIntentId: string;
    }
  | { ok: false; error: string };

async function resolveDefaultPriceId(productId: string): Promise<string> {
  const stripe = getStripe();
  const product = await stripe.products.retrieve(productId);
  const defaultPrice = product.default_price;
  if (typeof defaultPrice === "string" && defaultPrice) return defaultPrice;
  if (
    defaultPrice &&
    typeof defaultPrice === "object" &&
    "id" in defaultPrice &&
    defaultPrice.id
  ) {
    return defaultPrice.id;
  }
  throw new Error(
    `Stripe product ${productId} has no default price configured.`
  );
}

function isWaivedDiagnostic(lead: StandardEnrollLead): boolean {
  return (
    lead.diagnosticPromo?.chargePrice === 0 ||
    (lead.pricing.diagPrice === 0 && Boolean(lead.diagnosticPromo))
  );
}

function buildCustomerMetadata(lead: StandardEnrollLead) {
  const first = lead.parent.first;
  const last =
    lead.parent.last ?? lead.parent.full.replace(lead.parent.first, "").trim();
  return {
    program: "standard-enroll",
    lead_slug: lead.slug,
    parent_first: first,
    parent_last: last,
    student_first: lead.student.first,
    advisor_full: lead.advisor.full
  };
}

function buildFlowMetadata(
  lead: StandardEnrollLead,
  weeklyPriceId: string,
  extra?: Record<string, string>
) {
  const first = lead.parent.first;
  const last =
    lead.parent.last ?? lead.parent.full.replace(lead.parent.first, "").trim();
  const email = lead.parent.email ?? "";
  return {
    program: "standard-enroll",
    lead_slug: lead.slug,
    parent_first: first,
    parent_last: last,
    parent_email: email,
    student_first: lead.student.first,
    advisor_full: lead.advisor.full,
    weekly_price_id: weeklyPriceId,
    weekly_trial_days: String(lead.pricing.weeklyTrialDays),
    ...(lead.diagnosticPromo
      ? {
          diag_promo: lead.diagnosticPromo.displayCode,
          diag_promo_coupon_id: lead.diagnosticPromo.stripeCouponId,
          family_diag_promo: lead.diagnosticPromo.displayCode,
          family_diag_coupon_id: lead.diagnosticPromo.stripeCouponId
        }
      : {}),
    ...extra
  };
}

/**
 * Create a Stripe Customer + PaymentIntent (or SetupIntent when diagnostic
 * is waived) for this lead.
 */
export async function initStandardEnrollCheckout(
  lead: StandardEnrollLead
): Promise<StandardEnrollInit> {
  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      ok: false,
      error: `Checkout is not configured yet. Email ${lead.advisor.email} to enroll.`
    };
  }

  const stripe = getStripe();
  const waived = isWaivedDiagnostic(lead);

  let weeklyPriceId: string;
  let diagnosticPriceId: string | null = null;
  try {
    const resolves = [resolveDefaultPriceId(lead.pricing.stripeWeeklyProductId)];
    if (!waived) {
      resolves.unshift(
        resolveDefaultPriceId(lead.pricing.stripeDiagnosticProductId)
      );
    }
    const ids = await Promise.all(resolves);
    if (waived) {
      weeklyPriceId = ids[0]!;
    } else {
      diagnosticPriceId = ids[0]!;
      weeklyPriceId = ids[1]!;
    }
  } catch (err) {
    console.error("standard-enroll SSR price resolve error:", err);
    return {
      ok: false,
      error: `Could not start checkout. Email ${lead.advisor.email} to enroll directly.`
    };
  }

  let amountCents: number | null = null;
  if (!waived && diagnosticPriceId) {
    try {
      const diagnosticPrice = await stripe.prices.retrieve(diagnosticPriceId);
      amountCents = diagnosticPrice.unit_amount;
    } catch (err) {
      console.error("standard-enroll SSR price lookup error:", err);
      return {
        ok: false,
        error: `Could not start checkout. Email ${lead.advisor.email} to enroll directly.`
      };
    }

    if (!amountCents) {
      console.error(
        "standard-enroll SSR: diagnostic price has no unit_amount",
        diagnosticPriceId
      );
      return {
        ok: false,
        error: `Could not start checkout. Email ${lead.advisor.email} to enroll directly.`
      };
    }
  }

  const first = lead.parent.first;
  const last =
    lead.parent.last ?? lead.parent.full.replace(lead.parent.first, "").trim();
  const email = lead.parent.email ?? "";
  const customerName = `${first} ${last}`.trim() || undefined;
  const customerEmail = email || undefined;

  try {
    const customer = await stripe.customers.create({
      email: customerEmail,
      name: customerName,
      metadata: buildCustomerMetadata(lead)
    });

    if (waived) {
      const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        payment_method_types: ["card"],
        usage: "off_session",
        metadata: buildFlowMetadata(lead, weeklyPriceId, {
          flow_step: "setup_for_weekly"
        })
      });

      if (!setupIntent.client_secret) {
        console.error(
          "standard-enroll SSR: SetupIntent has no client_secret",
          setupIntent.id
        );
        return {
          ok: false,
          error: `Could not start checkout. Email ${lead.advisor.email} to enroll directly.`
        };
      }

      return {
        ok: true,
        mode: "setup",
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id
      };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents!,
      currency: "usd",
      customer: customer.id,
      receipt_email: customerEmail,
      setup_future_usage: "off_session",
      payment_method_types: ["card"],
      description: standardEnrollDiagnosticDescription(lead),
      metadata: buildFlowMetadata(lead, weeklyPriceId, {
        flow_step: "diagnostic_charge"
      })
    });

    if (!paymentIntent.client_secret) {
      console.error(
        "standard-enroll SSR: PaymentIntent has no client_secret",
        paymentIntent.id
      );
      return {
        ok: false,
        error: `Could not start checkout. Email ${lead.advisor.email} to enroll directly.`
      };
    }

    return {
      ok: true,
      mode: "payment",
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (err) {
    console.error("standard-enroll SSR Stripe error:", err);
    return {
      ok: false,
      error: `Could not start checkout. Email ${lead.advisor.email} to enroll directly.`
    };
  }
}
