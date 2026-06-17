/**
 * One-time Stripe setup for Nada Naveed / Soha August 22 bootcamp enrollment.
 *
 * Creates:
 * - Weekly tutoring product @ $149/wk (recurring)
 * - Complimentary diagnostic coupon ($249 off, display code NADA-DIAG)
 *
 * Run: node --env-file=.env.local scripts/setup-nada-stripe.mjs
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
  console.log("Creating $149/wk bootcamp weekly product…");
  const weeklyProduct = await stripe.products.create({
    name: "Illuminairy SAT Tutoring — 3×/wk August 22 Bootcamp",
    description:
      "Three weekly 45-minute one-on-one SAT tutoring sessions for August 22, 2026 bootcamp families.",
    metadata: {
      program: "standard-enroll",
      variant: "aug22-bootcamp-3x",
      lead: "nada-naveed"
    }
  });

  const weeklyPrice = await stripe.prices.create({
    product: weeklyProduct.id,
    unit_amount: 14900,
    currency: "usd",
    recurring: { interval: "week" }
  });

  await stripe.products.update(weeklyProduct.id, {
    default_price: weeklyPrice.id
  });

  console.log("Creating complimentary diagnostic coupon ($249 off)…");
  const coupon = await stripe.coupons.create({
    amount_off: 24900,
    currency: "usd",
    duration: "once",
    name: "Complimentary diagnostic",
    metadata: {
      program: "standard-enroll",
      promo: "nada-diag-comp"
    }
  });

  let promotionCode;
  try {
    promotionCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: "NADA-DIAG",
      max_redemptions: 10,
      metadata: { lead: "nada-naveed" }
    });
  } catch (err) {
    console.warn("Promotion code may already exist:", err.message);
    const existing = await stripe.promotionCodes.list({
      code: "NADA-DIAG",
      limit: 1
    });
    promotionCode = existing.data[0];
  }

  console.log("\n--- Add to lead config (lib/standard-enroll.ts nadaSohaAug22Bootcamp) ---\n");
  console.log(`stripeWeeklyProductId: "${weeklyProduct.id}"`);
  console.log(`stripeCouponId: "${coupon.id}"`);
  console.log(`displayCode: "NADA-DIAG" (promo id: ${promotionCode?.id ?? "n/a"})`);
  console.log(`# Weekly price: ${weeklyPrice.id}`);
  console.log(`# Diagnostic product (unchanged): ${DIAG_PRODUCT_ID}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
