#!/usr/bin/env node
/**
 * Readonly analytics env matrix from .env.local only.
 * Prints name + empty/set + 6-char prefix — never full secrets.
 * Does not touch Vercel. Usage: node scripts/analytics-env-audit.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");

const KEYS = [
  "NEXT_PUBLIC_POSTHOG_KEY",
  "NEXT_PUBLIC_POSTHOG_HOST",
  "POSTHOG_API_KEY",
  "POSTHOG_PERSONAL_API_KEY",
  "POSTHOG_PROJECT_ID",
  "POSTHOG_API_HOST",
  "NEXT_PUBLIC_META_PIXEL_ID",
  "META_CAPI_ACCESS_TOKEN",
  "GA4_MEASUREMENT_ID",
  "GA4_API_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
];

function loadEnv(path) {
  const map = new Map();
  if (!existsSync(path)) return map;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const eq = trimmed.indexOf("=");
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    map.set(key, value);
  }
  return map;
}

const env = loadEnv(envPath);
console.log("Analytics env audit (.env.local only)\n");
console.log(
  "Key".padEnd(40),
  "Status".padEnd(8),
  "Len".padEnd(6),
  "Prefix / note"
);
console.log("-".repeat(80));

for (const key of KEYS) {
  const value = env.get(key) ?? "";
  const set = value.length > 0;
  const prefix = set ? `${value.slice(0, 6)}…` : "(empty)";
  let note = "";
  if (key === "NEXT_PUBLIC_POSTHOG_KEY" && set && !value.startsWith("phc_")) {
    note = "WARN: expected phc_";
  }
  if (key === "GA4_MEASUREMENT_ID" && set && value !== "G-B1XC1ND9GT") {
    note = "WARN: site gtag is G-B1XC1ND9GT";
  }
  if (key === "POSTHOG_PROJECT_ID" && set && value !== "428901") {
    note = "WARN: expected 428901";
  }
  console.log(
    key.padEnd(40),
    (set ? "set" : "EMPTY").padEnd(8),
    String(value.length).padEnd(6),
    `${prefix}${note ? `  ${note}` : ""}`
  );
}

console.log(`
Notes:
- Compare Vercel Production in dashboard (prefix only). Do not vercel env pull into .env.local.
- Warehouse OAuth (Meta/Google/Stripe) lives in PostHog UI only.
- Browser GA4 id is hardcoded G-B1XC1ND9GT in components/google-analytics.tsx.
`);
