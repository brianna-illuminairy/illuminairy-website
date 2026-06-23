/**
 * Stripe setup for Plan B post-lesson membership (2× and 3× weekly + partner coupons).
 *
 * Run:
 *   node --env-file=.env.local scripts/setup-plan-b-stripe.mjs
 *
 * Creates products, weekly prices, and partner-college2 / partner-college3 coupons.
 */

import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;
if (!secret) {
  console.error("Missing STRIPE_SECRET_KEY in .env.local");
  process.exit(1);
}

const stripe = new Stripe(secret);

const PARTNER_COUPONS = [
  ["partner-college2", "Partner College 2x/week 10% off"],
  ["partner-college3", "Partner College 3x/week 10% off"],
];

async function findOrCreateProduct(name, metadata) {
  const existing = await stripe.products.search({
    query: `name:'${name}' AND metadata['program']:'plan_b_post_lesson'`,
  });
  if (existing.data[0]) return existing.data[0];
  return stripe.products.create({ name, metadata });
}

async function findOrCreateWeeklyPrice(productId, unitAmount, lookupKey) {
  const prices = await stripe.prices.list({ product: productId, active: true, limit: 20 });
  const match = prices.data.find((p) => p.lookup_key === lookupKey);
  if (match) return match;
  return stripe.prices.create({
    product: productId,
    currency: "usd",
    unit_amount: unitAmount,
    recurring: { interval: "week" },
    lookup_key: lookupKey,
  });
}

async function findOrCreateCoupon(id, name) {
  try {
    return await stripe.coupons.retrieve(id);
  } catch {
    return stripe.coupons.create({
      id,
      name,
      percent_off: 10,
      duration: "forever",
      metadata: {
        program: "plan_b_post_lesson",
        cadence: id.endsWith("3") ? "3x" : "2x",
      },
    });
  }
}

async function main() {
  const product2x = await findOrCreateProduct(
    "Plan B SAT Tutoring · 2×45 min/week",
    { program: "plan_b_post_lesson", cadence: "2x" }
  );
  const product3x = await findOrCreateProduct(
    "Plan B SAT Tutoring · 3×45 min/week",
    { program: "plan_b_post_lesson", cadence: "3x" }
  );

  const price2x = await findOrCreateWeeklyPrice(product2x.id, 11000, "plan_b_weekly_2x_list");
  const price3x = await findOrCreateWeeklyPrice(product3x.id, 16500, "plan_b_weekly_3x_list");

  await stripe.products.update(product2x.id, { default_price: price2x.id });
  await stripe.products.update(product3x.id, { default_price: price3x.id });

  console.log("\n--- Add to .env.local and Vercel ---\n");
  console.log(`STRIPE_PLAN_B_WEEKLY_2X_PRODUCT_ID=${product2x.id}`);
  console.log(`STRIPE_PLAN_B_WEEKLY_3X_PRODUCT_ID=${product3x.id}`);
  console.log(`STRIPE_PLAN_B_WEEKLY_2X_PRICE_ID=${price2x.id}`);
  console.log(`STRIPE_PLAN_B_WEEKLY_3X_PRICE_ID=${price3x.id}`);

  for (const [id, name] of PARTNER_COUPONS) {
    const coupon = await findOrCreateCoupon(id, name);
    console.log(`# Coupon ${coupon.id} (${coupon.percent_off}% off) → ${name}`);
  }

  console.log("\nList prices: $110/wk (2×) and $165/wk (3×). Apply partner coupon at subscription create.");
  console.log("Coupon ids: partner-college2 (standard), partner-college3 (intensive).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
