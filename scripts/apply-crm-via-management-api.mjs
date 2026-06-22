#!/usr/bin/env node
/**
 * Apply CRM migrations via Supabase Management API (one statement at a time).
 * Requires SUPABASE_ACCESS_TOKEN (dashboard session or personal access token).
 *
 *   SUPABASE_ACCESS_TOKEN=... node scripts/apply-crm-via-management-api.mjs
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const projectRef = "agujbietvwcudihfgkef";
const token = process.env.SUPABASE_ACCESS_TOKEN?.trim();

if (!token) {
  console.error("Set SUPABASE_ACCESS_TOKEN (Supabase → Account → Access Tokens)");
  process.exit(1);
}

const migrationFiles = [
  "supabase/migrations/20260518120000_crm_schema.sql",
  "supabase/migrations/20260528190000_quiz_funnel_lead_columns.sql",
  "supabase/migrations/20260601120000_plan_shares.sql",
  "supabase/migrations/20260605120000_visitors_analytics.sql",
  "supabase/migrations/20260607183000_sat_plan_builder_lp_analytics.sql",
  "supabase/migrations/20260607200000_quiz_opening_columns.sql",
  "supabase/migrations/20260608120000_visitor_quiz_answers.sql",
  "supabase/migrations/20260608125500_visitors_fast_attribution_columns.sql",
  "supabase/migrations/20260609023000_leads_meta_match_keys.sql",
  "supabase/migrations/20260609190000_danielle_portal_notify.sql",
  "supabase/migrations/20260610230000_enrollment_typeform.sql",
  "supabase/migrations/20260611120000_business_platform.sql",
  "supabase/migrations/20260612000000_clients_weekly_report.sql",
  "supabase/migrations/20260612120000_crm_v1_followups.sql",
  "supabase/migrations/20260612121000_crm_v1_lead_calls.sql",
  "supabase/migrations/20260621120000_enrollment_stripe_subscription.sql"
];

function splitStatements(sql) {
  const lines = sql.split("\n");
  const chunks = [];
  let buf = [];
  let inDollar = false;

  for (const line of lines) {
    if (line.trim().startsWith("--")) continue;
    buf.push(line);
    if (line.includes("$$")) inDollar = !inDollar;
    if (!inDollar && line.trim().endsWith(";")) {
      const stmt = buf.join("\n").trim();
      if (stmt) chunks.push(stmt);
      buf = [];
    }
  }
  const tail = buf.join("\n").trim();
  if (tail) chunks.push(tail);
  return chunks;
}

async function runQuery(query) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    }
  );
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`${res.status}: ${text.slice(0, 400)}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }
  return text;
}

async function main() {
  for (const rel of migrationFiles) {
    const file = resolve(root, rel);
    const sql = readFileSync(file, "utf8");
    const statements = splitStatements(sql);
    console.log(`\n${rel} (${statements.length} statements)`);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      const preview = stmt.split("\n")[0].slice(0, 72);
      try {
        await runQuery(stmt);
        console.log(`  ✓ [${i + 1}/${statements.length}] ${preview}`);
      } catch (e) {
        const msg = String(e?.message ?? e);
        if (
          msg.includes("already exists") ||
          msg.includes("duplicate key") ||
          (msg.includes("42710") && msg.includes("type"))
        ) {
          console.log(`  · [${i + 1}/${statements.length}] skip (exists): ${preview}`);
          continue;
        }
        console.error(`  ✗ [${i + 1}/${statements.length}] ${preview}`);
        throw e;
      }
    }
  }
  console.log("\n✓ CRM migrations finished.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
