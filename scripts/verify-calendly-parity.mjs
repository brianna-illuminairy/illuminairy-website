#!/usr/bin/env node
/**
 * Ensure git SSOT, .env.example, and optional .env.local agree on the public Calendly URL.
 * Run: npm run verify:calendly-parity
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PUBLIC_SAT_STRATEGY_CALL_CALENDLY_URL } from "./calendly-url-ssot.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function envValue(path, key) {
  if (!existsSync(path)) return null;
  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    if (!trimmed.startsWith(`${key}=`)) continue;
    let value = trimmed.slice(key.length + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    return value;
  }
  return null;
}

let failed = false;

const exampleUrl = envValue(resolve(root, ".env.example"), "NEXT_PUBLIC_CALENDLY_URL");
if (exampleUrl !== PUBLIC_SAT_STRATEGY_CALL_CALENDLY_URL) {
  console.error(
    `✗ .env.example NEXT_PUBLIC_CALENDLY_URL mismatch\n  expected: ${PUBLIC_SAT_STRATEGY_CALL_CALENDLY_URL}\n  got:      ${exampleUrl ?? "(missing)"}`
  );
  failed = true;
} else {
  console.log("✓ .env.example matches lib/site.ts SSOT");
}

const localPath = resolve(root, ".env.local");
const localUrl = envValue(localPath, "NEXT_PUBLIC_CALENDLY_URL");
if (localUrl && localUrl !== PUBLIC_SAT_STRATEGY_CALL_CALENDLY_URL) {
  console.error(
    `✗ .env.local NEXT_PUBLIC_CALENDLY_URL mismatch\n  expected: ${PUBLIC_SAT_STRATEGY_CALL_CALENDLY_URL}\n  got:      ${localUrl}`
  );
  failed = true;
} else if (localUrl) {
  console.log("✓ .env.local matches lib/site.ts SSOT");
} else {
  console.log("· .env.local missing or unset (uses code default at build)");
}

if (failed) {
  process.exit(1);
}

console.log(`\nSSOT: ${PUBLIC_SAT_STRATEGY_CALL_CALENDLY_URL}`);
console.log("Sync Vercel: npm run env:sync  then push main to rebuild.");
