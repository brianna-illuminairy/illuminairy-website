/**
 * Stripe setup for Plan B post-lesson membership (2× and 3× weekly + regional coupon).
 *
 * Run:
 *   node --env-file=.env.local scripts/setup-plan-b-stripe.mjs
 *
 * Adds product/price/coupon ids to print for .env.local / Vercel.
 */

import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;
if (!secret) {
  console.error("Missing STRIPE_SECRET_KEY in .env.local");
  process.exit(1);
}

const stripe = new Stripe(secret);

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
    });
  }
}

const US_STATE_CODES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
  "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM",
  "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA",
  "WV", "WI", "WY",
];

const STATE_LABELS = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado",
  CT: "Connecticut", DE: "Delaware", DC: "District of Columbia", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky",
  LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire",
  NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota",
  OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia",
  WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

function stateSlugFromCode(code) {
  if (code === "DC") return "dc";
  return STATE_LABELS[code].toLowerCase().replace(/\s+/g, "-");
}

function regionalStripeCouponId(regionSlug) {
  const slug = regionSlug.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toUpperCase();
  return slug ? `SAT-${slug}-10` : "PLANB-REGIONAL-10";
}

function buildRegionalCoupons() {
  const rows = US_STATE_CODES.map((code) => {
    const slug = stateSlugFromCode(code);
    return [regionalStripeCouponId(slug), `Plan B ${STATE_LABELS[code]} 10%`];
  });
  rows.push(["PLANB-REGIONAL-10", "Plan B Regional 10% fallback"]);
  rows.push(["SAT-DC-METRO-10", "Plan B DC Metro 10% (legacy CRM)"]);
  rows.push(["SAT-NATIONAL-10", "Plan B National 10% (legacy CRM)"]);
  return rows;
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

  const coupons = buildRegionalCoupons();

  console.log("\n--- Add to .env.local and Vercel ---\n");
  console.log(`STRIPE_PLAN_B_WEEKLY_2X_PRODUCT_ID=${product2x.id}`);
  console.log(`STRIPE_PLAN_B_WEEKLY_3X_PRODUCT_ID=${product3x.id}`);
  console.log(`STRIPE_PLAN_B_WEEKLY_2X_PRICE_ID=${price2x.id}`);
  console.log(`STRIPE_PLAN_B_WEEKLY_3X_PRICE_ID=${price3x.id}`);

  for (const [id, name] of coupons) {
    const coupon = await findOrCreateCoupon(id, name);
    console.log(`# Coupon ${coupon.id} (${coupon.percent_off}% off)`);
  }

  console.log("\nList prices: $110/wk (2×) and $165/wk (3×). Apply 10% coupon at subscription create.");
  console.log(`\nCreated/verified ${coupons.length} regional coupons (51 states + DC + fallbacks).`);
  console.log("No new env vars — coupons are referenced by id at checkout. See docs/plan-b-regional-schools.md.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
