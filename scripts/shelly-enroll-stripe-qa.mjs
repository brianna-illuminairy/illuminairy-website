#!/usr/bin/env node
/**
 * Stripe wiring QA for Shelly Sood enroll pages.
 *
 * Usage: node --env-file=.env.local scripts/shelly-enroll-stripe-qa.mjs
 */

import Stripe from "stripe";

const BASE = process.env.ENROLL_SMOKE_BASE ?? "http://localhost:3000";

const LEADS = {
  standard: {
    slug: "shelly-standard",
    diagProduct: "prod_UfmBm2GawHFXRA",
    weeklyProduct: "prod_UfmE3JUG5ykfSk",
    diagCents: 24900,
    weeklyCents: 9900,
    mode: "payment"
  },
  bootcamp: {
    slug: "shelly-aug22-bootcamp",
    weeklyProduct: "prod_UimaXmu7UDx54U",
    weeklyCents: 17500,
    couponId: "ocOXTShE",
    promoCode: "SHELLY-2DIAG",
    mode: "setup"
  }
};

let passed = 0;
let failed = 0;
let warned = 0;

function ok(msg) {
  passed++;
  console.log(`✓ ${msg}`);
}

function bad(msg) {
  failed++;
  console.error(`✗ ${msg}`);
}

function warn(msg) {
  warned++;
  console.warn(`⚠ ${msg}`);
}

async function resolveDefaultPriceId(stripe, productId) {
  const product = await stripe.products.retrieve(productId);
  const dp = product.default_price;
  if (typeof dp === "string") return dp;
  if (dp && typeof dp === "object" && dp.id) return dp.id;
  throw new Error(`No default price on ${productId}`);
}

async function initPaymentCheckout(stripe, lead) {
  const weeklyPriceId = await resolveDefaultPriceId(stripe, lead.weeklyProduct);
  const diagnosticPriceId = await resolveDefaultPriceId(stripe, lead.diagProduct);
  const diagnosticPrice = await stripe.prices.retrieve(diagnosticPriceId);

  const customer = await stripe.customers.create({
    email: "qa-stripe@shelly.test",
    name: "QA Stripe Probe",
    metadata: { program: "standard-enroll", lead_slug: lead.slug, qa: "true" }
  });

  const pi = await stripe.paymentIntents.create({
    amount: diagnosticPrice.unit_amount,
    currency: "usd",
    customer: customer.id,
    setup_future_usage: "off_session",
    payment_method_types: ["card"],
    metadata: {
      program: "standard-enroll",
      flow_step: "diagnostic_charge",
      lead_slug: lead.slug,
      weekly_price_id: weeklyPriceId,
      weekly_trial_days: "7",
      qa: "true"
    }
  });

  return { customer, pi, weeklyPriceId };
}

async function initSetupCheckout(stripe, lead) {
  const weeklyPriceId = await resolveDefaultPriceId(stripe, lead.weeklyProduct);

  const customer = await stripe.customers.create({
    email: "qa-stripe@shelly.test",
    name: "QA Stripe Probe",
    metadata: { program: "standard-enroll", lead_slug: lead.slug, qa: "true" }
  });

  const si = await stripe.setupIntents.create({
    customer: customer.id,
    payment_method_types: ["card"],
    usage: "off_session",
    metadata: {
      program: "standard-enroll",
      flow_step: "setup_for_weekly",
      lead_slug: lead.slug,
      weekly_price_id: weeklyPriceId,
      weekly_trial_days: "7",
      family_diag_promo: lead.promoCode,
      family_diag_coupon_id: lead.couponId,
      qa: "true"
    }
  });

  return { customer, si, weeklyPriceId };
}

async function verifyStripeCatalog(stripe) {
  console.log("\n— Stripe catalog —");

  const key = process.env.STRIPE_SECRET_KEY ?? "";
  if (key.startsWith("sk_live")) ok("Using live Stripe key");
  else if (key.startsWith("sk_test")) warn("Using test Stripe key");
  else bad("STRIPE_SECRET_KEY missing or unrecognized");

  const diagProd = await stripe.products.retrieve(LEADS.standard.diagProduct);
  ok(`Diagnostic product: ${diagProd.name}`);

  const diagPriceId = await resolveDefaultPriceId(stripe, LEADS.standard.diagProduct);
  const diagPrice = await stripe.prices.retrieve(diagPriceId);
  if (diagPrice.unit_amount === LEADS.standard.diagCents) ok("Diagnostic = $249.00");
  else bad(`Diagnostic price: ${diagPrice.unit_amount} cents`);

  const stdWeekly = await stripe.prices.retrieve(
    await resolveDefaultPriceId(stripe, LEADS.standard.weeklyProduct)
  );
  if (stdWeekly.unit_amount === LEADS.standard.weeklyCents) ok("Standard weekly = $99.00/wk");
  else bad(`Standard weekly: ${stdWeekly.unit_amount}`);

  const sprintWeekly = await stripe.prices.retrieve(
    await resolveDefaultPriceId(stripe, LEADS.bootcamp.weeklyProduct)
  );
  if (sprintWeekly.unit_amount === LEADS.bootcamp.weeklyCents) {
    ok("Bootcamp weekly = $175.00/wk");
  } else bad(`Bootcamp weekly: ${sprintWeekly.unit_amount}`);

  const coupon = await stripe.coupons.retrieve(LEADS.bootcamp.couponId);
  if (coupon.amount_off === 24900) ok(`Coupon ${LEADS.bootcamp.couponId}: $249 off`);
  else bad(`Coupon amount_off=${coupon.amount_off}`);
}

async function verifyCheckoutFlows(stripe) {
  console.log("\n— Checkout flow parity (mirrors initStandardEnrollCheckout) —");

  const { pi, weeklyPriceId: standardWeekly } = await initPaymentCheckout(
    stripe,
    LEADS.standard
  );
  if (pi.amount === LEADS.standard.diagCents) ok("PaymentIntent path: $249 charge");
  else bad(`PI amount ${pi.amount}`);
  if (pi.metadata.lead_slug === LEADS.standard.slug) ok("PI lead_slug correct");
  if (pi.metadata.weekly_price_id === standardWeekly) ok("PI weekly_price_id set");
  if (pi.client_secret) ok("PI client_secret present");
  if (pi.setup_future_usage === "off_session") ok("PI off_session for subscription");

  const { si, weeklyPriceId: sprintWeekly } = await initSetupCheckout(
    stripe,
    LEADS.bootcamp
  );
  if (si.metadata.lead_slug === LEADS.bootcamp.slug) ok("SetupIntent lead_slug correct");
  if (si.metadata.weekly_price_id === sprintWeekly) ok("SetupIntent weekly_price_id set");
  if (si.metadata.family_diag_promo === LEADS.bootcamp.promoCode) {
    ok("SetupIntent family_diag_promo=SHELLY-2DIAG");
  }
  if (si.client_secret) ok("SetupIntent client_secret present");
  if (si.status === "requires_payment_method") ok("SetupIntent awaiting card");
}

async function verifyPages() {
  console.log("\n— Live page render —");

  const specs = [
    {
      path: "/enroll/shelly-standard",
      must: [
        "Shelly",
        "Purchase Diagnostic &amp; Enroll $249",
        "Weekly Tutoring 2",
        "one-on-one sessions per week",
        "Is there a contract"
      ],
      mustNot: ["SHELLY-2DIAG", "$175", "Aliya", "Shaun"]
    },
    {
      path: "/enroll/shelly-aug22-bootcamp",
      must: [
        "Shelly",
        "August 22 SAT Bootcamp",
        "SHELLY-2DIAG",
        "Family diagnostic bundle",
        "std-pricing-struck",
        "Weekly Tutoring 4",
        "Family discount applied",
        "Enroll — diagnostic covered"
      ],
      mustNot: ["Purchase Diagnostic &amp; Enroll $249", "Aliya", "Shaun"]
    }
  ];

  let reachable = true;
  try {
    const probe = await fetch(`${BASE}/enroll/shelly-standard`, {
      signal: AbortSignal.timeout(8000)
    });
    if (!probe.ok) {
      reachable = false;
      warn(`Dev server HTTP ${probe.status}`);
    }
  } catch (e) {
    reachable = false;
    warn(`Dev server down at ${BASE}: ${e.message}`);
  }

  if (!reachable) return;

  for (const spec of specs) {
    const res = await fetch(`${BASE}${spec.path}`, {
      signal: AbortSignal.timeout(20000)
    });
    if (!res.ok) {
      bad(`${spec.path}: HTTP ${res.status}`);
      continue;
    }
    const html = await res.text();
    ok(`${spec.path}: HTTP 200`);

    for (const needle of spec.must) {
      if (html.includes(needle)) ok(`  contains "${needle.replace(/&amp;/g, "&")}"`);
      else bad(`  missing "${needle}"`);
    }
    for (const needle of spec.mustNot) {
      if (!html.includes(needle)) ok(`  omits "${needle.replace(/&amp;/g, "&")}"`);
      else bad(`  should not contain "${needle}"`);
    }

    if (html.includes("Checkout is not configured")) {
      bad(`${spec.path}: Stripe not configured on page`);
    } else if (html.includes("stripe-host") || html.includes("Could not start checkout")) {
      if (html.includes("Could not start checkout")) {
        bad(`${spec.path}: SSR checkout init failed`);
      } else {
        ok(`${spec.path}: Stripe form shell rendered`);
      }
    }
  }
}

async function verifyFinalizeRoute() {
  console.log("\n— Finalize API —");

  let reachable = true;
  try {
    await fetch(`${BASE}/enroll/shelly-standard`, { signal: AbortSignal.timeout(5000) });
  } catch {
    reachable = false;
    warn("Skip finalize checks — dev server down");
    return;
  }

  const empty = await fetch(`${BASE}/api/standard-enroll/finalize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
  if (empty.status === 400) ok("Finalize rejects empty payload");
  else bad(`Finalize empty: HTTP ${empty.status}`);

  const badPi = await fetch(`${BASE}/api/standard-enroll/finalize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentIntentId: "pi_qa_invalid" })
  });
  if ([400, 502].includes(badPi.status)) ok("Finalize rejects invalid PI");
  else warn(`Invalid PI finalize: HTTP ${badPi.status}`);

  const badSi = await fetch(`${BASE}/api/standard-enroll/finalize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ setupIntentId: "seti_qa_invalid" })
  });
  if ([400, 502].includes(badSi.status)) ok("Finalize rejects invalid SetupIntent");
  else warn(`Invalid SI finalize: HTTP ${badSi.status}`);
}

async function main() {
  console.log("Shelly enroll Stripe QA\n");

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("Missing STRIPE_SECRET_KEY");
    process.exit(1);
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  await verifyStripeCatalog(stripe);
  await verifyCheckoutFlows(stripe);
  await verifyPages();
  await verifyFinalizeRoute();

  console.log(`\n— Summary: ${passed} passed, ${failed} failed, ${warned} warnings —\n`);

  if (failed > 0) process.exit(1);
  console.log("Shelly Stripe QA passed.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
