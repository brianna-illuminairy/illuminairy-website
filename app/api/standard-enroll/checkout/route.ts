/**
 * Standard enrollment checkout API.
 *
 * Step 1 of the on-page checkout. Mirrors Sohail's
 * `app/api/personalized-enroll/checkout/route.ts` shape — creates a Stripe
 * Customer + a PaymentIntent for the diagnostic price, with
 * `setup_future_usage: "off_session"` so the saved card can start the
 * weekly subscription on success (see ./finalize).
 *
 * Isolated from Sohail's stack on purpose. Do not import from
 * `lib/personalized-enroll.ts` here.
 */
import { NextResponse } from "next/server";
import {
  getStandardEnrollLead,
  type StandardEnrollLead
} from "@/lib/standard-enroll";
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

  // Slug is the only hard requirement at init time so the Stripe Elements
  // form can always load. The billing contact is validated client-side at
  // the Pay click and re-bound via `confirmCardPayment(billing_details)`,
  // so empty/partial values here are fine.
  if (!slug) {
    return NextResponse.json(
      { error: "Missing enrollment link." },
      { status: 400 }
    );
  }
  if (email && !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const lead: StandardEnrollLead | null = getStandardEnrollLead(slug);
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
    console.error("standard-enroll price resolve error:", err);
    return NextResponse.json(
      {
        error: `Could not start checkout. Email ${site.supportEmail} to enroll directly.`
      },
      { status: 502 }
    );
  }

  const diagnosticPrice = await stripe.prices.retrieve(diagnosticPriceId);
  const amountCents = diagnosticPrice.unit_amount;
  if (!amountCents) {
    console.error(
      "standard-enroll: diagnostic price has no unit_amount",
      diagnosticPriceId
    );
    return NextResponse.json(
      {
        error: `Could not start checkout. Email ${site.supportEmail} to enroll directly.`
      },
      { status: 502 }
    );
  }

  // Pass undefined (not empty strings) so Stripe doesn't store blanks.
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
      currency: diagnosticPrice.currency ?? "usd",
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
        "standard-enroll: PaymentIntent has no client_secret",
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
    console.error("standard-enroll Stripe intent error:", err);
    return NextResponse.json(
      {
        error: `Could not start checkout. Email ${site.supportEmail} to enroll directly.`
      },
      { status: 502 }
    );
  }
}
