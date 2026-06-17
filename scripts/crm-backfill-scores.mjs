#!/usr/bin/env node
/**
 * Backfill lead heat scores + call scores for existing CRM data.
 *
 *   1. Sync lead ↔ call attendance (header "Mark attended" drift fix)
 *   2. Create missing lead_calls rows from leads.booked_call_at when possible
 *   3. Optional: POST /api/cron/gemini-extract (Drive transcript → call_score)
 *   4. Recompute lead_score_current for every lead (RPC recompute_lead_score)
 *
 * Usage:
 *   node --env-file=.env.local scripts/crm-backfill-scores.mjs
 *   node --env-file=.env.local scripts/crm-backfill-scores.mjs --dry-run
 *   node --env-file=.env.local scripts/crm-backfill-scores.mjs --extract
 *   node --env-file=.env.local scripts/crm-backfill-scores.mjs --email hayaterum@hotmail.com
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile() {
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

loadEnvFile();

const dryRun = process.argv.includes("--dry-run");
const doExtract = process.argv.includes("--extract");
const emailFilter = (() => {
  const idx = process.argv.indexOf("--email");
  return idx >= 0 ? process.argv[idx + 1]?.toLowerCase() : null;
})();

const INTERNAL = new Set([
  "noelbrianna@gmail.com",
  "testemil@gmail.com",
  "testemial@gmail.com",
  "brianna@illuminairy.com",
  "support@illuminairy.com",
  "zajicek.brianna@gmail.com",
  "zajicek@gmail.com",
  "jane.test+quiz@example.com",
  "adas@gmail.com"
]);

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false }
});

function log(msg) {
  console.log(dryRun ? `[dry-run] ${msg}` : msg);
}

async function syncAttendance() {
  log("\n=== Step 1: sync lead ↔ call attendance ===");
  let { data: leads, error } = await supabase
    .from("leads")
    .select(
      "id, parent_email, parent_first, stage, attended_at, booked_call_at, calendly_event_uri"
    )
    .not("attended_at", "is", null);

  if (error) throw new Error(error.message);
  leads = (leads ?? []).filter((l) => !INTERNAL.has(l.parent_email?.toLowerCase()));
  if (emailFilter) leads = leads.filter((l) => l.parent_email?.toLowerCase() === emailFilter);

  for (const lead of leads) {
    const { data: calls } = await supabase
      .from("lead_calls")
      .select("id, call_status, call_at, scheduled_start, call_score")
      .eq("lead_id", lead.id)
      .order("call_at", { ascending: false });

    let callList = calls ?? [];

    if (callList.length === 0 && lead.booked_call_at) {
      log(`  + create missing lead_calls row for ${lead.parent_email}`);
      if (!dryRun) {
        const row = {
          lead_id: lead.id,
          call_at: lead.booked_call_at,
          scheduled_start: lead.booked_call_at,
          scheduled_end: new Date(
            new Date(lead.booked_call_at).getTime() + 45 * 60_000
          ).toISOString(),
          call_status: "attended",
          attendance_source: "manual",
          attendance_decided_at: lead.attended_at ?? new Date().toISOString(),
          attendance_decided_by: "manual"
        };
        const { data: inserted, error: insErr } = await supabase
          .from("lead_calls")
          .insert(row)
          .select("id, call_status")
          .single();
        if (insErr) {
          console.warn("    insert failed:", insErr.message);
        } else {
          callList = [inserted];
        }
      }
    }

    const primary =
      callList.find((c) => c.call_status === "attended") ??
      callList.find((c) => ["booked", "confirmed", "no_show"].includes(c.call_status)) ??
      callList[0];

    if (!primary) continue;

    const shouldAttend =
      lead.stage === "call_attended" ||
      lead.stage === "won" ||
      lead.stage === "qualified" ||
      lead.stage === "diagnostic_scheduled" ||
      !!lead.attended_at;

    if (shouldAttend && primary.call_status !== "attended") {
      log(
        `  sync ${lead.parent_email}: call ${primary.id.slice(0, 8)} ${primary.call_status} → attended`
      );
      if (!dryRun) {
        await supabase
          .from("lead_calls")
          .update({
            call_status: "attended",
            attendance_source: "manual",
            attendance_decided_at: lead.attended_at ?? new Date().toISOString(),
            attendance_decided_by: "manual"
          })
          .eq("id", primary.id);
      }
    }
  }
}

async function runGeminiExtract() {
  log("\n=== Step 2: Gemini extract (Drive → call_score) ===");
  const secret = process.env.CRON_SHARED_SECRET;
  const base = (process.env.ILLUMINAIRY_BASE_URL ?? "https://illuminairy.com").replace(
    /\/$/,
    ""
  );
  if (!secret) {
    console.warn("  skip: CRON_SHARED_SECRET not set");
    return;
  }
  const endpoint = `${base}/api/cron/gemini-extract`;
  let rounds = 0;
  let totalProcessed = 0;
  while (rounds < 6) {
    rounds += 1;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}` }
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.warn("  gemini-extract failed:", res.status, JSON.stringify(json).slice(0, 400));
      break;
    }
    const n = json.processed ?? 0;
    totalProcessed += n;
    log(`  round ${rounds}: processed ${n} — ${JSON.stringify(json.results ?? []).slice(0, 500)}`);
    const anyApplied = (json.results ?? []).some((r) => r.call_score_overall || r.summary);
    if (n === 0 || !anyApplied) break;
  }
  log(`  gemini rounds done (${totalProcessed} calls touched)`);
}

async function recomputeAll() {
  log("\n=== Step 3: recompute lead_score_current ===");
  let { data: leads, error } = await supabase.from("leads").select("id, parent_email, lead_score_current");
  if (error) throw new Error(error.message);
  leads = (leads ?? []).filter((l) => !INTERNAL.has(l.parent_email?.toLowerCase()));
  if (emailFilter) leads = leads.filter((l) => l.parent_email?.toLowerCase() === emailFilter);

  for (const lead of leads) {
    if (dryRun) {
      log(`  would recompute ${lead.parent_email} (current ${lead.lead_score_current ?? "—"})`);
      continue;
    }
    const { data: score, error: rpcErr } = await supabase.rpc("recompute_lead_score", {
      p_lead_id: lead.id
    });
    if (rpcErr) {
      console.warn(`  ${lead.parent_email}: ${rpcErr.message}`);
    } else {
      log(`  ${lead.parent_email}: ${lead.lead_score_current ?? "—"} → ${score}`);
    }
  }
}

async function printSummary() {
  log("\n=== Summary ===");
  const { data: calls } = await supabase
    .from("lead_calls")
    .select(
      "id, call_status, call_at, call_score, transcript_extracted_at, leads:lead_id(parent_email, lead_score_current, stage)"
    )
    .order("call_at", { ascending: false });

  for (const c of calls ?? []) {
    const lead = c.leads;
    if (!lead || INTERNAL.has(lead.parent_email?.toLowerCase())) continue;
    if (emailFilter && lead.parent_email?.toLowerCase() !== emailFilter) continue;
    console.log(
      JSON.stringify({
        email: lead.parent_email,
        stage: lead.stage,
        lead_score: lead.lead_score_current,
        call_status: c.call_status,
        call_at: c.call_at?.slice(0, 10),
        call_score_overall: c.call_score?.overall ?? null,
        extracted: !!c.transcript_extracted_at
      })
    );
  }
}

await syncAttendance();
if (doExtract && !dryRun) await runGeminiExtract();
await recomputeAll();
await printSummary();
