#!/usr/bin/env node
/**
 * CRM setup: patch .env.local + apply migration when DATABASE_URL is set.
 */
import {
  readFileSync,
  writeFileSync,
  appendFileSync,
  existsSync
} from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { randomBytes } from "crypto";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");

function loadEnvFile() {
  if (!existsSync(envPath)) {
    return {};
  }
  const env = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let val = trimmed.slice(eq + 1);
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[key] = val;
    if (!process.env[key]) process.env[key] = val;
  }
  return env;
}

async function applyMigrationWithPg(connectionString) {
  const pg = await import("pg");
  const sqlPath = resolve(
    root,
    "supabase/migrations/20260518120000_crm_schema.sql"
  );
  const sql = readFileSync(sqlPath, "utf8");
  const client = new pg.default.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  try {
    await client.query(sql);
    console.log("✓ CRM migration applied.");
  } catch (err) {
    const msg = String(err?.message ?? err);
    if (msg.includes("already exists")) {
      console.log("✓ CRM tables already exist (skipped).");
    } else {
      throw err;
    }
  } finally {
    await client.end();
  }
}

async function main() {
  const env = loadEnvFile();
  const supabaseUrl = "https://agujbietvwcudihfgkef.supabase.co";

  let content = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
  const block = [];

  if (!/^SUPABASE_URL=/m.test(content)) {
    block.push(`SUPABASE_URL=${supabaseUrl}`);
  }
  if (!/^ADMIN_SECRET=/m.test(content)) {
    const secret = randomBytes(24).toString("hex");
    block.push(`ADMIN_SECRET=${secret}`);
    console.log("✓ Generated ADMIN_SECRET → .env.local");
  }
  if (!/^SUPABASE_SERVICE_ROLE_KEY=/m.test(content)) {
    block.push("SUPABASE_SERVICE_ROLE_KEY=");
  }
  if (!/^KLAVIYO_PRIVATE_API_KEY=/m.test(content)) {
    block.push("KLAVIYO_PRIVATE_API_KEY=");
  }
  if (!/^CALENDLY_WEBHOOK_SIGNING_KEY=/m.test(content)) {
    block.push("CALENDLY_WEBHOOK_SIGNING_KEY=");
  }
  if (!/^DATABASE_URL=/m.test(content)) {
    block.push("DATABASE_URL=");
  }

  if (block.length) {
    appendFileSync(
      envPath,
      `\n# --- CRM (npm run crm:setup) ---\n${block.join("\n")}\n`
    );
    console.log("✓ Appended CRM keys to .env.local — fill empty values.");
  }

  const refreshed = loadEnvFile();
  const dbUrl = refreshed.DATABASE_URL || process.env.DATABASE_URL;

  if (dbUrl && dbUrl.length > 20 && !dbUrl.includes("YOUR-PASSWORD")) {
    await applyMigrationWithPg(dbUrl);
  } else {
    console.log("\nTo apply DB tables automatically, set DATABASE_URL in .env.local:");
    console.log("  Supabase → Project Settings → Database → Connection string → URI");
    console.log("Then run: npm run crm:setup");
  }

  if (!refreshed.SUPABASE_SERVICE_ROLE_KEY) {
    console.log("\nRequired: SUPABASE_SERVICE_ROLE_KEY from Supabase → Settings → API");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
