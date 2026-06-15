import { NextResponse } from "next/server";
import {
  getPersonalizedEnrollLead,
  type PersonalizedEnrollLead
} from "@/lib/personalized-enroll";
import { getStripe } from "@/lib/stripe";
import { site } from "@/lib/site";

type CheckoutPayload = {
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
 * Resolve the Stripe Price ID to use for a given product. We do not store
 * Price IDs in code because Stripe lets us swap a product's default price
 * (price changes, coupons) without a deploy. We always charge the product's
 * current default price.
 */
async function resolveDefaultPriceId(
  productId: string
): Promise<string> {
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

  let body: CheckoutPayload;
  try {
    body = (await request.json()) as CheckoutPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot
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
  if (body.tos !== true) {
    return NextResponse.json(
      { error: "Please agree to the terms to continue." },
      { status: 400 }
    );
  }

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

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      // Subscription mode accepts both recurring and one-time prices in
      // line_items. The recurring price ($99/wk) carries the trial; the
      // one-time price ($249 diagnostic) is billed at session completion
      // (today). The first weekly invoice generates at trial end (day 7).
      line_items: [
        { price: weeklyPriceId, quantity: 1 },
        { price: diagnosticPriceId, quantity: 1 }
      ],
      subscription_data: {
        trial_period_days: lead.pricing.weeklyTrialDays,
        metadata: {
          program: "personalized-enroll",
          lead_slug: lead.slug,
          parent_first: first,
          parent_last: last,
          student_first: lead.student.first,
          advisor_full: lead.advisor.full
        }
      },
      customer_email: email,
      // Top-level metadata mirrors subscription metadata so the webhook can
      // identify the lead from either object.
      metadata: {
        program: "personalized-enroll",
        lead_slug: lead.slug,
        parent_first: first,
        parent_last: last,
        parent_email: email,
        student_first: lead.student.first,
        advisor_full: lead.advisor.full
      },
      client_reference_id: lead.slug,
      success_url: `${site.url}/enroll/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site.url}/enroll/${lead.slug}?canceled=1`,
      payment_method_collection: "always",
      allow_promotion_codes: false
    });

    if (!session.url) {
      console.error(
        "personalized-enroll checkout: Stripe returned a session with no url",
        session.id
      );
      return NextResponse.json(
        {
          error: `Could not start checkout. Email ${site.supportEmail} to enroll directly.`
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("personalized-enroll Stripe checkout error:", err);
    return NextResponse.json(
      {
        error: `Could not start checkout. Email ${site.supportEmail} to enroll directly.`
      },
      { status: 502 }
    );
  }
}
