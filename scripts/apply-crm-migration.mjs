#!/usr/bin/env node
/**
 * Apply CRM migration. Usage:
 *   DATABASE_URL="postgresql://..." npm run crm:migrate
 * Or:
 *   SUPABASE_DB_PASSWORD="your-db-password" npm run crm:migrate
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const projectRef = "agujbietvwcudihfgkef";

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

async function main() {
  let connectionString = process.env.DATABASE_URL;

  if (!connectionString && process.env.SUPABASE_DB_PASSWORD) {
    const password = encodeURIComponent(process.env.SUPABASE_DB_PASSWORD);
    const hosts = [
      `postgresql://postgres.${projectRef}:${password}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
      `postgresql://postgres.${projectRef}:${password}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`,
      `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`
    ];
    const pg = await import("pg");
    let lastErr;
    for (const cs of hosts) {
      const client = new pg.default.Client({
        connectionString: cs,
        ssl: { rejectUnauthorized: false }
      });
      try {
        await client.connect();
        await applyAllMigrations(client);
        await client.end();
        return;
      } catch (err) {
        lastErr = err;
        try {
          await client.end();
        } catch {
          /* ignore */
        }
      }
    }
    throw lastErr;
  }

  if (!connectionString) {
    console.error("Set DATABASE_URL or SUPABASE_DB_PASSWORD");
    process.exit(1);
  }

  const pg = await import("pg");
  const client = new pg.default.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  try {
    await applyAllMigrations(client);
  } finally {
    await client.end();
  }
}

const migrationFiles = [
  "20260518120000_crm_schema.sql",
  "20260528190000_quiz_funnel_lead_columns.sql",
  "20260601120000_plan_shares.sql",
  "20260605120000_visitors_analytics.sql",
  "20260607183000_sat_plan_builder_lp_analytics.sql",
  "20260607200000_quiz_opening_columns.sql",
  "20260608120000_visitor_quiz_answers.sql",
  "20260608125500_visitors_fast_attribution_columns.sql",
  "20260609023000_leads_meta_match_keys.sql",
  "20260609190000_danielle_portal_notify.sql",
  "20260610230000_enrollment_typeform.sql",
  "20260611120000_business_platform.sql",
  "20260612000000_clients_weekly_report.sql",
  "20260612120000_crm_v1_followups.sql",
  "20260612121000_crm_v1_lead_calls.sql"
];

async function applyAllMigrations(client) {
  for (const file of migrationFiles) {
    const sql = readFileSync(
      resolve(root, "supabase/migrations", file),
      "utf8"
    );
    try {
      await client.query(sql);
      console.log(`✓ Applied ${file}`);
    } catch (err) {
      const msg = String(err?.message ?? err);
      if (msg.includes("already exists")) {
        console.log(`✓ ${file} (already applied)`);
      } else {
        throw err;
      }
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
