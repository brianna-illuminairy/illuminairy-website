/**
 * One-time Stripe setup for Shelly Sood sprint enrollment.
 *
 * Creates:
 * - Weekly tutoring product @ $175/wk (recurring)
 * - 100% off diagnostic coupon (family bundle — second child)
 * - Promotion code SHELLY-2DIAG (for display; sprint page auto-applies coupon server-side)
 *
 * Run: node --env-file=.env.local scripts/setup-shelly-stripe.mjs
 */

import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;
if (!secret) {
  console.error("Missing STRIPE_SECRET_KEY");
  process.exit(1);
}

const stripe = new Stripe(secret);

const DIAG_PRODUCT_ID =
  process.env.STRIPE_STANDARD_DIAG_PRODUCT_ID ?? "prod_UfmBm2GawHFXRA";

async function main() {
  console.log("Creating $175/wk sprint weekly product…");
  const weeklyProduct = await stripe.products.create({
    name: "Illuminairy SAT Tutoring — 4×/wk Sprint",
    description:
      "Four weekly one-on-one SAT tutoring sessions for August 22, 2026 sprint families.",
    metadata: { program: "standard-enroll", variant: "aug22-bootcamp" }
  });

  const weeklyPrice = await stripe.prices.create({
    product: weeklyProduct.id,
    unit_amount: 17500,
    currency: "usd",
    recurring: { interval: "week" }
  });

  await stripe.products.update(weeklyProduct.id, {
    default_price: weeklyPrice.id
  });

  console.log("Creating family diagnostic coupon (100% off diagnostic)…");
  const coupon = await stripe.coupons.create({
    amount_off: 24900,
    currency: "usd",
    duration: "once",
    name: "Family diagnostic bundle",
    metadata: {
      program: "standard-enroll",
      promo: "shelly-family-diag"
    }
  });

  let promotionCode;
  try {
    promotionCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: "SHELLY-2DIAG",
      max_redemptions: 10,
      metadata: { lead: "shelly-sood" }
    });
  } catch (err) {
    console.warn("Promotion code may already exist:", err.message);
    const existing = await stripe.promotionCodes.list({
      code: "SHELLY-2DIAG",
      limit: 1
    });
    promotionCode = existing.data[0];
  }

  console.log("\n--- Add to lead config (lib/standard-enroll.ts shelly-shaun-sprint) ---\n");
  console.log(`stripeWeeklyProductId: "${weeklyProduct.id}"`);
  console.log(`stripeCouponId: "${coupon.id}"`);
  console.log(`displayCode: "SHELLY-2DIAG" (promo id: ${promotionCode?.id ?? "n/a"})`);
  console.log(`# Weekly price: ${weeklyPrice.id}`);
  console.log(`# Diagnostic product (unchanged): ${DIAG_PRODUCT_ID}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
