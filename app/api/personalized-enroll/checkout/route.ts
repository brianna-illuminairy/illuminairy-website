import { NextResponse } from "next/server";
import {
  getPersonalizedEnrollLead,
  type PersonalizedEnrollLead
} from "@/lib/personalized-enroll";
import { getStripe } from "@/lib/stripe";
import { site } from "@/lib/site";

type IntentPayload = {
  slug?: string;
  first?: string;
  last?: string;
  email?: string;
  tos?: boolean;
  /** Honeypot. Real browsers leave this empty; bots fill it. */
  company?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Resolve the Stripe Price ID for a given product. We do not store Price IDs
 * in code so the Stripe dashboard can swap prices without a deploy.
 */
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
 * Step 1 of the on-page checkout.
 *
 * Creates a Stripe Customer and a PaymentIntent for the diagnostic ($249).
 * We use `setup_future_usage: "off_session"` so the card collected for the
 * one-time diagnostic charge is saved on the customer and can be used to
 * start the weekly subscription with trial after this PaymentIntent
 * succeeds (see ./finalize for the second step).
 *
 * Returns a `clientSecret` the client uses to mount Stripe's Payment
 * Element. The whole purchase is completed on our page; no redirect.
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

  let body: IntentPayload;
  try {
    body = (await request.json()) as IntentPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const slug = (body.slug ?? "").trim();
  const first = (body.first ?? "").trim();
  const last = (body.last ?? "").trim();
  const email = (body.email ?? "").trim();

  if (!slug || !first || !last || !email) {
    return NextResponse.json(
      { error: "Please complete your billing contact." },
      { status: 400 }
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  // TOS is enforced client-side at submit time via the checkbox + button
  // disabled state. We do not enforce it here because the PaymentIntent
  // is created on page mount (before the user has had a chance to tick the
  // checkbox) so Stripe Elements can mount bound to the PI's allowed
  // payment methods (card only).

  const lead: PersonalizedEnrollLead | null = getPersonalizedEnrollLead(slug);
  if (!lead) {
    return NextResponse.json(
      { error: "Unknown enrollment link." },
      { status: 404 }
    );
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
    console.error("personalized-enroll price resolve error:", err);
    return NextResponse.json(
      {
        error: `Could not start checkout. Email ${site.supportEmail} to enroll directly.`
      },
      { status: 502 }
    );
  }

  // Look up the diagnostic price in cents from Stripe so we never trust
  // the lead config's display amount on the server side.
  const diagnosticPrice = await stripe.prices.retrieve(diagnosticPriceId);
  const amountCents = diagnosticPrice.unit_amount;
  if (!amountCents) {
    console.error(
      "personalized-enroll: diagnostic price has no unit_amount",
      diagnosticPriceId
    );
    return NextResponse.json(
      {
        error: `Could not start checkout. Email ${site.supportEmail} to enroll directly.`
      },
      { status: 502 }
    );
  }

  try {
    const customer = await stripe.customers.create({
      email,
      name: `${first} ${last}`.trim(),
      metadata: {
        program: "personalized-enroll",
        lead_slug: lead.slug,
        parent_first: first,
        parent_last: last,
        student_first: lead.student.first,
        advisor_full: lead.advisor.full
      }
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: diagnosticPrice.currency ?? "usd",
      customer: customer.id,
      receipt_email: email,
      // Save the payment method on the customer so we can attach it to the
      // weekly subscription after this PaymentIntent succeeds.
      setup_future_usage: "off_session",
      // Modern integration: Stripe-managed dynamic payment methods, but for
      // now we lock to card so the form stays simple and predictable.
      payment_method_types: ["card"],
      description: `${lead.student.first} — Skill Diagnostic + Personalized Plan`,
      metadata: {
        program: "personalized-enroll",
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
        "personalized-enroll: PaymentIntent has no client_secret",
        paymentIntent.id
      );
      return NextResponse.json(
        {
          error: `Could not start checkout. Email ${site.supportEmail} to enroll directly.`
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      customerId: customer.id
    });
  } catch (err) {
    console.error("personalized-enroll Stripe intent error:", err);
    return NextResponse.json(
      {
        error: `Could not start checkout. Email ${site.supportEmail} to enroll directly.`
      },
      { status: 502 }
    );
  }
}
