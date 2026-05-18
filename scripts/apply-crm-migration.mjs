#!/usr/bin/env node
/**
 * Apply CRM migration. Usage:
 *   DATABASE_URL="postgresql://..." npm run crm:migrate
 * Or:
 *   SUPABASE_DB_PASSWORD="your-db-password" npm run crm:migrate
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const projectRef = "agujbietvwcudihfgkef";

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
    const sql = readFileSync(
      resolve(root, "supabase/migrations/20260518120000_crm_schema.sql"),
      "utf8"
    );
    let lastErr;
    for (const cs of hosts) {
      const client = new pg.default.Client({
        connectionString: cs,
        ssl: { rejectUnauthorized: false }
      });
      try {
        await client.connect();
        await client.query(sql);
        console.log("✓ Migration applied.");
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
  const sql = readFileSync(
    resolve(root, "supabase/migrations/20260518120000_crm_schema.sql"),
    "utf8"
  );

  const client = new pg.default.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  try {
    await client.query(sql);
    console.log("✓ Migration applied.");
  } catch (err) {
    const msg = String(err?.message ?? err);
    if (msg.includes("already exists")) {
      console.log("✓ Tables already exist.");
    } else {
      throw err;
    }
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
