/**
 * Server-only checkout init for the standard enrollment page.
 *
 * Used by the page route so the Stripe PaymentIntent is created during SSR
 * and the client never has to spin a "Loading secure checkout..." state.
 * The client `<PayCard>` receives the resulting clientSecret as a prop.
 *
 * Do not import this file from a client component — it uses the server-only
 * Stripe SDK and would leak secrets to the browser bundle.
 */
import { getStripe } from "@/lib/stripe";
import { type StandardEnrollLead } from "@/lib/standard-enroll";

export type StandardEnrollInit =
  | { ok: true; clientSecret: string; paymentIntentId: string }
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

/**
 * Create a Stripe Customer + PaymentIntent for this lead's diagnostic
 * charge. The customer is created with whatever name/email we already
 * know from the lead config; both can be edited and re-bound at confirm
 * time via `confirmCardPayment(billing_details)`.
 *
 * Returns `ok: true` with the clientSecret on success, `ok: false` with a
 * human-readable error message otherwise. Never throws.
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

  let diagnosticPriceId: string;
  let weeklyPriceId: string;
  try {
    [diagnosticPriceId, weeklyPriceId] = await Promise.all([
      resolveDefaultPriceId(lead.pricing.stripeDiagnosticProductId),
      resolveDefaultPriceId(lead.pricing.stripeWeeklyProductId)
    ]);
  } catch (err) {
    console.error("standard-enroll SSR price resolve error:", err);
    return {
      ok: false,
      error: `Could not start checkout. Email ${lead.advisor.email} to enroll directly.`
    };
  }

  let amountCents: number | null;
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
      metadata: {
        program: "standard-enroll",
        lead_slug: lead.slug,
        parent_first: first,
        parent_last: last,
        student_first: lead.student.first,
        advisor_full: lead.advisor.full
      }
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "usd",
      customer: customer.id,
      receipt_email: customerEmail,
      setup_future_usage: "off_session",
      payment_method_types: ["card"],
      description: `${lead.student.first} — Skill Diagnostic + Personalized Plan`,
      metadata: {
        program: "standard-enroll",
        flow_step: "diagnostic_charge",
        lead_slug: lead.slug,
        parent_first: first,
        parent_last: last,
        parent_email: email,
        student_first: lead.student.first,
        advisor_full: lead.advisor.full,
        weekly_price_id: weeklyPriceId,
        weekly_trial_days: String(lead.pricing.weeklyTrialDays)
      }
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
