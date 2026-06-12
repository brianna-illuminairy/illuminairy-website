#!/usr/bin/env node
/**
 * CRM v4 smoke probe — confirms every integration + cron route used by the
 * full call-history pipeline is wired and reachable. Does NOT exercise a
 * real Strategy Call. Pair with docs/crm-v4-smoke-test.md for the live
 * end-to-end checklist.
 *
 * Usage:
 *   npm run crm:smoke
 *   npm run crm:smoke -- --base https://www.illuminairy.com
 *
 * The default base is http://localhost:3000.
 */

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

const args = process.argv.slice(2);
const baseIdx = args.indexOf("--base");
const BASE =
  baseIdx >= 0 && args[baseIdx + 1]
    ? args[baseIdx + 1].replace(/\/$/, "")
    : "http://localhost:3000";

async function loadEnv() {
  const env = { ...process.env };
  if (existsSync(".env.local")) {
    const text = await readFile(".env.local", "utf8");
    for (const raw of text.split("\n")) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const k = line.slice(0, eq).trim();
      let v = line.slice(eq + 1).trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (!(k in env)) env[k] = v;
    }
  }
  return env;
}

const REQUIRED_ENVS = [
  "GOOGLE_OAUTH_CLIENT_ID",
  "GOOGLE_OAUTH_CLIENT_SECRET",
  "GOOGLE_OAUTH_REDIRECT_URI",
  "INTEGRATION_TOKEN_ENC_KEY",
  "GEMINI_API_KEY",
  "CALENDLY_API_TOKEN",
  "CALENDLY_WEBHOOK_SIGNING_KEY",
  "CRON_SHARED_SECRET",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SUPABASE_URL"
];

const OPTIONAL_ENVS = ["GA4_MEASUREMENT_ID", "GA4_API_SECRET"];

const CRON_ROUTES = [
  "/api/cron/meet-attendance",
  "/api/cron/gmail-sync",
  "/api/cron/gemini-extract",
  "/api/cron/task-reconciler",
  "/api/cron/calendly-history",
  "/api/cron/heartbeat-check",
  "/api/cron/pre-call-brief",
  "/api/cron/lead-score-decay",
  "/api/cron/identity-reconcile"
];

const PASS = "\u001b[32m✓\u001b[0m";
const FAIL = "\u001b[31m✗\u001b[0m";
const WARN = "\u001b[33m!\u001b[0m";

let failures = 0;
let warnings = 0;

function ok(line) {
  console.log(`${PASS} ${line}`);
}
function fail(line) {
  console.log(`${FAIL} ${line}`);
  failures++;
}
function warn(line) {
  console.log(`${WARN} ${line}`);
  warnings++;
}

async function main() {
  console.log(`CRM v4 smoke probe → ${BASE}\n`);
  const env = await loadEnv();

  console.log("ENV ────────────────────────────────");
  for (const key of REQUIRED_ENVS) {
    if (env[key] && env[key].length > 4) ok(`${key} set`);
    else fail(`${key} missing or empty`);
  }
  for (const key of OPTIONAL_ENVS) {
    if (env[key] && env[key].length > 4) ok(`${key} set (optional)`);
    else warn(`${key} not set — GA4 server-side milestones will no-op`);
  }
  if (env.INTEGRATION_TOKEN_ENC_KEY) {
    if (env.INTEGRATION_TOKEN_ENC_KEY.length < 32) {
      warn("INTEGRATION_TOKEN_ENC_KEY < 32 chars; AES-256 prefers 32+");
    }
  }

  console.log("\nCRON ROUTES ───────────────────────");
  const auth = env.CRON_SHARED_SECRET
    ? { Authorization: `Bearer ${env.CRON_SHARED_SECRET}` }
    : {};
  for (const route of CRON_ROUTES) {
    const url = `${BASE}${route}`;
    try {
      const res = await fetch(url, { method: "POST", headers: auth });
      if (res.status === 401) {
        fail(`${route} → 401 (CRON_SHARED_SECRET mismatch)`);
        continue;
      }
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        fail(`${route} → ${res.status} (non-JSON response)`);
        continue;
      }
      if (res.ok && json?.ok) ok(`${route} → ${res.status} ok`);
      else if (res.ok) warn(`${route} → ${res.status} (responded but ok=false)`);
      else fail(`${route} → ${res.status} ${json?.error ?? ""}`);
    } catch (e) {
      fail(`${route} → fetch failed: ${e instanceof Error ? e.message : e}`);
    }
  }

  console.log("\nADMIN INTEGRATIONS ────────────────");
  try {
    const res = await fetch(`${BASE}/api/admin/integrations/heartbeats`);
    if (res.status === 401) {
      warn("/api/admin/integrations/heartbeats requires admin auth (run from logged-in browser to verify)");
    } else if (res.ok) {
      const data = await res.json();
      const list = data.heartbeats ?? [];
      if (list.length === 0) {
        warn("No heartbeat rows yet — run /api/cron/heartbeat-check once");
      } else {
        for (const hb of list) {
          const status = hb.status ?? "unknown";
          if (status === "ok") ok(`${hb.provider}: ${status}`);
          else fail(`${hb.provider}: ${status} ${hb.error ? `(${hb.error})` : ""}`);
        }
      }
    } else {
      warn(`/api/admin/integrations/heartbeats → ${res.status}`);
    }
  } catch (e) {
    warn(`heartbeat endpoint not reachable: ${e instanceof Error ? e.message : e}`);
  }

  console.log("\nSUMMARY ───────────────────────────");
  if (failures === 0 && warnings === 0) {
    console.log(`${PASS} All systems green. Proceed with the live Strategy Call check.`);
    process.exit(0);
  }
  console.log(
    `${failures} failure${failures === 1 ? "" : "s"}, ${warnings} warning${warnings === 1 ? "" : "s"}.`
  );
  console.log(
    "Refer to docs/crm-v4-smoke-test.md for the live verification checklist."
  );
  process.exit(failures > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
