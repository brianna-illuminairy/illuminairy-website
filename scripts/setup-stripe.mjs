/**
 * One-time Stripe setup for Illuminairy SAT Accelerator.
 *
 * Prerequisites in .env.local:
 *   STRIPE_SECRET_KEY=sk_live_...
 *   STRIPE_TUITION_CENTS=150000   (example: $1,500.00)
 *
 * Optional:
 *   SITE_URL=https://illuminairy.com  (webhook URL; skip webhook if unset)
 *
 * Run:
 *   node --env-file=.env.local scripts/setup-stripe.mjs
 *
 * Prints STRIPE_PRICE_ID and STRIPE_WEBHOOK_SECRET to add to .env.local / Vercel.
 */

import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;
const tuitionCents = process.env.STRIPE_TUITION_CENTS;
const siteUrl = (process.env.SITE_URL || "https://illuminairy.com").replace(/\/$/, "");

if (!secret) {
  console.error("Missing STRIPE_SECRET_KEY in .env.local");
  process.exit(1);
}

if (!tuitionCents || !/^\d+$/.test(tuitionCents)) {
  console.error(
    "Missing STRIPE_TUITION_CENTS in .env.local (whole USD cents, e.g. 150000 for $1,500.00)"
  );
  process.exit(1);
}

const stripe = new Stripe(secret);

const productName = "Illuminairy SAT Accelerator — August 2026";

async function main() {
  console.log("Creating product…");
  const product = await stripe.products.create({
    name: productName,
    description:
      "Twelve-week SAT Accelerator: weekly R&W and Math classes, 6 private 1:1s, Georgia Tech-led mentors. For the August 22, 2026 SAT.",
    metadata: { program: "sat-accelerator" }
  });

  console.log("Creating one-time price…");
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: Number(tuitionCents),
    currency: "usd"
  });

  console.log("\n--- Add to .env.local and Vercel ---\n");
  console.log(`STRIPE_PRICE_ID=${price.id}`);
  console.log(`# Product: ${product.id}`);

  const webhookUrl = `${siteUrl}/api/webhooks/stripe`;
  console.log(`\nCreating webhook endpoint: ${webhookUrl}`);

  try {
    const webhook = await stripe.webhookEndpoints.create({
      url: webhookUrl,
      enabled_events: ["checkout.session.completed", "checkout.session.expired"],
      description: "Illuminairy enrollment (SAT Accelerator)"
    });

    console.log(`STRIPE_WEBHOOK_SECRET=${webhook.secret}`);
    console.log(`# Webhook endpoint: ${webhook.id}`);
  } catch (err) {
    console.warn(
      "\nWebhook creation failed (deploy the site first, or create webhook in Dashboard):"
    );
    console.warn(err.message || err);
    console.warn(
      `\nManual: Developers → Webhooks → ${webhookUrl} → checkout.session.completed`
    );
  }

  console.log("\nDone. Redeploy Vercel after updating env vars.\n");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
