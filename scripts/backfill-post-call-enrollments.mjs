#!/usr/bin/env node
/**
 * Backfill CRM enrollments + Meta Purchase CAPI for post-call Stripe subs
 * that finalized before recordPostCallEnrollCompletion shipped.
 *
 * Usage:
 *   node --env-file=.env.local scripts/backfill-post-call-enrollments.mjs
 *   node --env-file=.env.local scripts/backfill-post-call-enrollments.mjs --dry-run
 */
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run");

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

loadEnvLocal();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
const stripeKey = process.env.STRIPE_SECRET_KEY;
const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const capiToken = process.env.META_CAPI_ACCESS_TOKEN;

if (!supabaseUrl || !supabaseKey || !stripeKey) {
  console.error("Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or STRIPE_SECRET_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});
const stripe = new Stripe(stripeKey);

/** Known post-call subs from Jun 2026 audit */
const BACKFILL_TARGETS = [
  {
    label: "Sohail / Shermeen",
    subscriptionId: "sub_1Tk3vP2MLg6PnhtQZ4HXnWOo",
    referenceId: "pi_3Tk3u72MLg6PnhtQ0UgFzMCV",
    enrollFlow: "personalized-enroll",
    leadSlug: "sohail-shermeen",
    parentEmail: "sohailft@gmail.com",
    diagnosticWaived: false
  },
  {
    label: "Skye / Sara C",
    subscriptionId: "sub_1TjTTe2MLg6PnhtQY6R0nJ6y",
    referenceId: "pi_3TjTTc2MLg6PnhtQ1u9mmHqY",
    enrollFlow: "standard-enroll",
    leadSlug: "post-call-checkout",
    parentEmail: "sara_crisafulli@hotmail.com",
    diagnosticWaived: false
  },
  {
    label: "Nada / Soha",
    subscriptionId: "sub_1Tkx7n2MLg6PnhtQ7U9kkoHh",
    referenceId: "seti_1Tkx5k2MLg6PnhtQMZzvTVvF",
    enrollFlow: "standard-enroll",
    leadSlug: "nada-soha-aug22-bootcamp",
    parentEmail: "nj00@hotmail.com",
    diagnosticWaived: true
  }
];

function sha256(value) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function purchaseValueCents(diag, weekly, waived) {
  if (waived) return weekly > 0 ? weekly : 0;
  return Math.max(diag, weekly);
}

async function sendPurchaseCapi(input) {
  if (!pixelId || !capiToken) {
    console.warn("  Meta CAPI skipped (missing pixel/token)");
    return;
  }
  const eventId = `purchase_${input.referenceId}`;
  const { data: lead } = await supabase
    .from("leads")
    .select(
      "id, parent_email, parent_first, parent_last, parent_phone, meta_fbp, meta_fbc"
    )
    .eq("parent_email", input.parentEmail)
    .maybeSingle();

  const userData = {};
  if (input.parentEmail) userData.em = [sha256(input.parentEmail)];
  if (lead?.parent_phone) userData.ph = [sha256(lead.parent_phone.replace(/\D/g, ""))];
  if (lead?.parent_first) userData.fn = [sha256(lead.parent_first)];
  if (lead?.parent_last) userData.ln = [sha256(lead.parent_last)];
  if (lead?.id) userData.external_id = [sha256(lead.id)];
  if (lead?.meta_fbp) userData.fbp = lead.meta_fbp;
  if (lead?.meta_fbc) userData.fbc = lead.meta_fbc;

  const body = {
    data: [
      {
        event_name: "Purchase",
        event_time: input.eventTimeSec ?? Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        user_data: userData,
        custom_data: {
          content_name: input.leadSlug,
          content_category: input.enrollFlow,
          value: input.valueCents / 100,
          currency: "USD"
        }
      }
    ]
  };

  if (dryRun) {
    console.log("  [dry-run] Meta Purchase CAPI", eventId, body.data[0].custom_data);
    return;
  }

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${capiToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  );
  if (!res.ok) {
    console.error("  Meta CAPI error:", await res.text());
  } else {
    console.log("  Meta Purchase CAPI sent:", eventId);
  }
}

async function backfillOne(target) {
  console.log(`\n=== ${target.label} ===`);

  const { data: existing } = await supabase
    .from("enrollments")
    .select("id, client_id, lead_id")
    .or(
      `stripe_subscription_id.eq.${target.subscriptionId},intake_details->>stripe_subscription_id.eq.${target.subscriptionId}`
    )
    .maybeSingle();

  if (existing) {
    console.log("  Enrollment already exists:", existing.id);
    if (existing.lead_id) {
      await supabase
        .from("leads")
        .update({
          stage: "won",
          converted_at: new Date().toISOString(),
          converted_client_id: existing.client_id,
          last_activity_at: new Date().toISOString()
        })
        .eq("id", existing.lead_id)
        .neq("stage", "won");
    }
  } else {
    const sub = await stripe.subscriptions.retrieve(target.subscriptionId, {
      expand: ["items.data.price"]
    });
    const customerId =
      typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    const meta = sub.metadata ?? {};
    const weeklyCents = sub.items.data[0]?.price?.unit_amount ?? 0;

    let diagnosticCents = 0;
    if (!target.diagnosticWaived && target.referenceId.startsWith("pi_")) {
      const pi = await stripe.paymentIntents.retrieve(target.referenceId);
      diagnosticCents = pi.amount ?? 0;
    }

    const parentEmail = (meta.parent_email ?? target.parentEmail).toLowerCase();
    const { data: lead } = await supabase
      .from("leads")
      .select("id, visitor_id")
      .eq("parent_email", parentEmail)
      .maybeSingle();

    if (dryRun) {
      console.log("  [dry-run] would create enrollment for", parentEmail, sub.status);
      return;
    }

    let clientId;
    const { data: existingClient } = await supabase
      .from("clients")
      .select("id")
      .eq("parent_email", parentEmail)
      .maybeSingle();

    if (existingClient) {
      clientId = existingClient.id;
    } else {
      const { data: client, error } = await supabase
        .from("clients")
        .insert({
          lead_id: lead?.id ?? null,
          parent_email: parentEmail,
          parent_first: meta.parent_first ?? null,
          parent_last: meta.parent_last ?? null,
          status: "active"
        })
        .select("id")
        .single();
      if (error) throw error;
      clientId = client.id;
    }

    if (lead?.id) {
      await supabase
        .from("leads")
        .update({
          stage: "won",
          converted_at: new Date().toISOString(),
          converted_client_id: clientId,
          last_activity_at: new Date().toISOString()
        })
        .eq("id", lead.id);
      console.log("  Lead won:", lead.id);
    }

    const { data: student, error: studentErr } = await supabase
      .from("students")
      .insert({
        client_id: clientId,
        first_name: meta.student_first ?? "Student"
      })
      .select("id")
      .single();
    if (studentErr) throw studentErr;

    const programLabel =
      target.enrollFlow === "personalized-enroll"
        ? `Personalized SAT plan · ${target.leadSlug}`
        : `SAT enroll · ${target.leadSlug}`;

    const enrollmentRow = {
      client_id: clientId,
      student_id: student.id,
      lead_id: lead?.id ?? null,
      program: target.enrollFlow,
      program_label: programLabel,
      status:
        sub.status === "active" || sub.status === "trialing"
          ? "active"
          : "pending_payment",
      amount_paid_cents: target.diagnosticWaived ? null : diagnosticCents,
      paid_at: target.diagnosticWaived ? null : new Date().toISOString(),
      intake_details: {
        stripe_subscription_id: target.subscriptionId,
        stripe_customer_id: customerId,
        stripe_payment_intent_id: target.referenceId,
        enroll_flow: target.enrollFlow,
        lead_slug: target.leadSlug,
        backfill: true
      }
    };

    let enrollment;
    let enrollErr;
    const withStripeCols = {
      ...enrollmentRow,
      stripe_subscription_id: target.subscriptionId,
      stripe_customer_id: customerId,
      stripe_payment_intent_id: target.referenceId,
      enroll_flow: target.enrollFlow
    };

    ({ data: enrollment, error: enrollErr } = await supabase
      .from("enrollments")
      .insert(withStripeCols)
      .select("id")
      .single());

    if (
      enrollErr?.message?.includes("stripe_subscription_id") ||
      enrollErr?.message?.includes("enroll_flow") ||
      enrollErr?.message?.includes("Could not find")
    ) {
      console.warn("  New stripe columns missing — storing ids in intake_details");
      ({ data: enrollment, error: enrollErr } = await supabase
        .from("enrollments")
        .insert(enrollmentRow)
        .select("id")
        .single());
    }

    if (enrollErr) throw enrollErr;
    console.log("  Created enrollment:", enrollment.id);

    if (!target.diagnosticWaived && diagnosticCents > 0) {
      await supabase.from("client_payments").upsert(
        {
          enrollment_id: enrollment.id,
          client_id: clientId,
          stripe_payment_intent_id: target.referenceId,
          amount_cents: diagnosticCents,
          paid_at: new Date().toISOString(),
          source: "stripe",
          notes: `backfill:${target.leadSlug}`
        },
        { onConflict: "stripe_payment_intent_id", ignoreDuplicates: true }
      );
    }

    await supabase.from("touch_events").insert({
      lead_id: lead?.id ?? null,
      client_id: clientId,
      enrollment_id: enrollment.id,
      event_type: "checkout_completed",
      source: "server",
      payload: {
        backfill: true,
        lead_slug: target.leadSlug,
        stripe_subscription_id: target.subscriptionId
      }
    });
  }

  const sub = await stripe.subscriptions.retrieve(target.subscriptionId, {
    expand: ["items.data.price"]
  });
  let diagnosticCents = 0;
  if (!target.diagnosticWaived && target.referenceId.startsWith("pi_")) {
    const pi = await stripe.paymentIntents.retrieve(target.referenceId);
    diagnosticCents = pi.amount ?? 0;
  }
  const weeklyCents = sub.items.data[0]?.price?.unit_amount ?? 0;

  await sendPurchaseCapi({
    parentEmail: target.parentEmail,
    referenceId: target.referenceId,
    leadSlug: target.leadSlug,
    enrollFlow: target.enrollFlow,
    valueCents: purchaseValueCents(
      diagnosticCents,
      weeklyCents,
      target.diagnosticWaived
    ),
    eventTimeSec: sub.created
  });
}

for (const target of BACKFILL_TARGETS) {
  try {
    await backfillOne(target);
  } catch (err) {
    console.error(`Failed ${target.label}:`, err.message ?? err);
  }
}

console.log("\nDone.", dryRun ? "(dry-run)" : "");
