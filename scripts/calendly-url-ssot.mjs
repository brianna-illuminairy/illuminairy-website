#!/usr/bin/env node
/**
 * Read PUBLIC_SAT_STRATEGY_CALL_CALENDLY_URL from lib/site.ts (repo SSOT).
 * Used by smoke tests and env parity checks — do not duplicate the URL elsewhere.
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteTs = readFileSync(resolve(root, "lib/site.ts"), "utf8");

const match = siteTs.match(
  /export const PUBLIC_SAT_STRATEGY_CALL_CALENDLY_URL\s*=\s*"([^"]+)"/
);

if (!match) {
  throw new Error("PUBLIC_SAT_STRATEGY_CALL_CALENDLY_URL not found in lib/site.ts");
}

export const PUBLIC_SAT_STRATEGY_CALL_CALENDLY_URL = match[1];

/** calendly.com/{user}/{event} path for availability URL checks */
export function calendlyEventPath(url) {
  const u = new URL(url);
  const parts = u.pathname.split("/").filter(Boolean);
  if (parts.length < 2) {
    throw new Error(`Invalid Calendly URL: ${url}`);
  }
  return `${parts[0]}/${parts[1]}`;
}

export const EXPECTED_CALENDLY_EVENT_PATH = calendlyEventPath(
  PUBLIC_SAT_STRATEGY_CALL_CALENDLY_URL
);
