#!/usr/bin/env node
/**
 * Apply only the plan_shares migration.
 *   npm run crm:migrate:plan-shares
 * Uses DATABASE_URL or SUPABASE_DB_PASSWORD from .env.local (same as crm:migrate).
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const projectRef = "agujbietvwcudihfgkef";
const migrationFile = "20260601120000_plan_shares.sql";

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

async function connectAndRun(client) {
  const sql = readFileSync(
    resolve(root, "supabase/migrations", migrationFile),
    "utf8"
  );
  await client.query(sql);
  console.log(`✓ Applied ${migrationFile}`);
}

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
        await connectAndRun(client);
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
    console.error("Set DATABASE_URL or SUPABASE_DB_PASSWORD in .env.local");
    process.exit(1);
  }

  const pg = await import("pg");
  const client = new pg.default.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  try {
    await connectAndRun(client);
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  const msg = String(e?.message ?? e);
  if (msg.includes("already exists")) {
    console.log(`✓ ${migrationFile} (already applied)`);
    process.exit(0);
  }
  console.error(e);
  process.exit(1);
});
