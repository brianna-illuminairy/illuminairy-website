#!/usr/bin/env node
/**
 * Backfill Stripe payments for an enrollment (Danielle default).
 *
 * Usage:
 *   node scripts/backfill-stripe-payments.mjs
 *   node scripts/backfill-stripe-payments.mjs --dry-run
 *   node scripts/backfill-stripe-payments.mjs --email bonsuc@gmail.com --enrollment f34c3ee3-...
 */
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_EMAIL = "bonsuc@gmail.com";
const DEFAULT_ENROLLMENT = "f34c3ee3-5f56-4a16-8479-96f9240b1959";

function loadEnvLocal() {
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    if (process.env[key]) continue;
    let val = trimmed.slice(eq + 1);
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

function arg(name, fallback) {
  const idx = process.argv.indexOf(name);
  if (idx === -1 || !process.argv[idx + 1]) return fallback;
  return process.argv[idx + 1];
}

loadEnvLocal();

const dryRun = process.argv.includes("--dry-run");
const email = arg("--email", DEFAULT_EMAIL).toLowerCase();
const enrollmentId = arg("--enrollment", DEFAULT_ENROLLMENT);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}
if (!stripeKey) {
  console.error("Missing STRIPE_SECRET_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});
const stripe = new Stripe(stripeKey);

const { data: enrollment, error: enrollErr } = await supabase
  .from("enrollments")
  .select("id, client_id, stripe_checkout_session_id")
  .eq("id", enrollmentId)
  .maybeSingle();

if (enrollErr || !enrollment) {
  console.error("Enrollment not found:", enrollmentId, enrollErr?.message);
  process.exit(1);
}

const { data: client } = await supabase
  .from("clients")
  .select("id, parent_email")
  .eq("id", enrollment.client_id)
  .maybeSingle();

if (!client || client.parent_email.toLowerCase() !== email) {
  console.warn(`Warning: client email is ${client?.parent_email}, expected ${email}`);
}

let totalCents = 0;
const rows = [];

if (enrollment.stripe_checkout_session_id) {
  const session = await stripe.checkout.sessions.retrieve(
    enrollment.stripe_checkout_session_id
  );
  if (session.amount_total) {
    rows.push({
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: null,
      amount_cents: session.amount_total,
      paid_at: session.created
        ? new Date(session.created * 1000).toISOString()
        : new Date().toISOString(),
      source: "stripe_checkout"
    });
    totalCents += session.amount_total;
  }
}

const customers = await stripe.customers.list({ email, limit: 10 });
for (const customer of customers.data) {
  const intents = await stripe.paymentIntents.list({ customer: customer.id, limit: 100 });
  for (const pi of intents.data) {
    if (pi.status !== "succeeded") continue;
    const already = rows.some((r) => r.stripe_payment_intent_id === pi.id);
    if (already) continue;
    rows.push({
      stripe_checkout_session_id: null,
      stripe_payment_intent_id: pi.id,
      amount_cents: pi.amount,
      paid_at: new Date(pi.created * 1000).toISOString(),
      source: "stripe_pi"
    });
    totalCents += pi.amount;
  }
}

console.log(`Enrollment ${enrollmentId} (${email})`);
console.log(`Found ${rows.length} payment(s), total $${(totalCents / 100).toFixed(2)}`);

for (const row of rows) {
  const lookup = row.stripe_checkout_session_id
    ? { col: "stripe_checkout_session_id", val: row.stripe_checkout_session_id }
    : { col: "stripe_payment_intent_id", val: row.stripe_payment_intent_id };

  const { data: existing } = await supabase
    .from("client_payments")
    .select("id")
    .eq(lookup.col, lookup.val)
    .maybeSingle();

  if (existing) {
    console.log(`  skip duplicate ${lookup.val}`);
    continue;
  }

  const insertRow = {
    enrollment_id: enrollmentId,
    client_id: enrollment.client_id,
    stripe_checkout_session_id: row.stripe_checkout_session_id,
    stripe_payment_intent_id: row.stripe_payment_intent_id,
    amount_cents: row.amount_cents,
    paid_at: row.paid_at,
    source: row.source
  };

  if (dryRun) {
    console.log("  [dry-run] would insert", insertRow);
    continue;
  }

  const { error } = await supabase.from("client_payments").insert(insertRow);
  if (error) {
    console.error("  insert failed:", error.message);
  } else {
    console.log(`  inserted $${(row.amount_cents / 100).toFixed(2)} (${row.source})`);
  }
}

if (!dryRun) {
  const { data: license } = await supabase
    .from("client_costs")
    .select("id")
    .eq("enrollment_id", enrollmentId)
    .eq("cost_type", "software_license")
    .maybeSingle();

  if (!license) {
    await supabase.from("client_costs").insert({
      enrollment_id: enrollmentId,
      cost_type: "software_license",
      amount_cents: 10_000,
      notes: "Client software license"
    });
    console.log("  inserted software license $100");
  }
}

console.log("Done.");
