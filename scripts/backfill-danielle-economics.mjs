#!/usr/bin/env node
/**
 * Seed Danielle enrollment economics: CAC, time logs.
 *
 * Usage:
 *   node scripts/backfill-danielle-economics.mjs
 *   node scripts/backfill-danielle-economics.mjs --dry-run
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ENROLLMENT_ID = "f34c3ee3-5f56-4a16-8479-96f9240b1959";
const CAC_CENTS = 49_300;

const TIME_LOGS = [
  { category: "sales_call", duration_minutes: 30, notes: "Sales call 1" },
  { category: "sales_call", duration_minutes: 30, notes: "Sales call 2" },
  { category: "diagnostic", duration_minutes: 135, notes: "Skill Diagnostic" },
  { category: "tutoring", duration_minutes: 60, notes: "First tutoring session" }
];

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

const dryRun = process.argv.includes("--dry-run");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const { data: enrollment } = await supabase
  .from("enrollments")
  .select("id")
  .eq("id", ENROLLMENT_ID)
  .maybeSingle();

if (!enrollment) {
  console.error("Danielle enrollment not found:", ENROLLMENT_ID);
  process.exit(1);
}

const { data: existingCac } = await supabase
  .from("client_costs")
  .select("id")
  .eq("enrollment_id", ENROLLMENT_ID)
  .eq("cost_type", "cac")
  .maybeSingle();

if (!existingCac) {
  const row = {
    enrollment_id: ENROLLMENT_ID,
    cost_type: "cac",
    amount_cents: CAC_CENTS,
    notes: "Allocated CAC (Meta ads)"
  };
  if (dryRun) {
    console.log("[dry-run] would insert CAC", row);
  } else {
    await supabase.from("client_costs").insert(row);
    console.log("Inserted CAC $493");
  }
} else {
  console.log("CAC already exists");
}

const { data: existingLicense } = await supabase
  .from("client_costs")
  .select("id")
  .eq("enrollment_id", ENROLLMENT_ID)
  .eq("cost_type", "software_license")
  .maybeSingle();

if (!existingLicense) {
  const row = {
    enrollment_id: ENROLLMENT_ID,
    cost_type: "software_license",
    amount_cents: 10_000,
    notes: "Client software license"
  };
  if (dryRun) {
    console.log("[dry-run] would insert license", row);
  } else {
    await supabase.from("client_costs").insert(row);
    console.log("Inserted software license $100");
  }
} else {
  console.log("Software license already exists");
}

const { count: timeCount } = await supabase
  .from("client_time_logs")
  .select("id", { count: "exact", head: true })
  .eq("enrollment_id", ENROLLMENT_ID);

if ((timeCount ?? 0) === 0) {
  for (const log of TIME_LOGS) {
    const row = { enrollment_id: ENROLLMENT_ID, ...log };
    if (dryRun) {
      console.log("[dry-run] would insert time log", row);
    } else {
      await supabase.from("client_time_logs").insert(row);
      console.log(`Inserted ${log.duration_minutes}m ${log.category}`);
    }
  }
} else {
  console.log(`Time logs already exist (${timeCount})`);
}

console.log("Done. Run backfill-stripe-payments.mjs for revenue.");
