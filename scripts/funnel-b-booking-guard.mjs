#!/usr/bin/env node
/**
 * Plan Builder B — free lesson booking must stay live (no UTM/env gating).
 * Mirrors funnel-booking-guard.mjs for /plan-b APIs and lab funnel libs.
 *
 * Run: npm run funnel:b-booking-guard
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
const EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);
const SCAN_ROOTS = [
  "app/api/funnel-b",
  "lib/quiz-funnel-b",
  "lib/calendly/book-free-lesson.ts",
];
const SKIP_DIRS = new Set(["node_modules", ".next", "archives"]);

const BANNED = [
  [/shouldGatePlanBuilderBooking/i, "shouldGatePlanBuilderBooking()"],
  [/PLAN_BUILDER_BOOKING_PAUSED/i, "PLAN_BUILDER_BOOKING_PAUSED env"],
  [/PLAN_BUILDER_BOOKING_LIVE/i, "PLAN_BUILDER_BOOKING_LIVE env"],
  [/plan_booking_qa/i, "plan_booking_qa bypass"],
  [/bookingGated/i, "bookingGated UI branch"],
  [/schedulerEnabled=\{!bookingGated\}/, "scheduler disabled by gate flag"],
  [/Save my plan/i, "lead-only booking CTA"],
];

const HISTORICAL_OK = [
  { file: "scripts/funnel-b-booking-guard.mjs", test: () => true },
  { file: ".cursor/rules/plan-builder-booking-lock.mdc", test: () => true },
];

function walk(entry, out) {
  const abs = join(ROOT, entry);
  let st;
  try {
    st = statSync(abs);
  } catch {
    return;
  }
  if (st.isFile()) {
    if (EXT.has(extname(abs))) out.push(abs);
    return;
  }
  if (!st.isDirectory()) return;
  for (const name of readdirSync(abs)) {
    if (SKIP_DIRS.has(name)) continue;
    walk(join(entry, name), out);
  }
}

function rel(abs) {
  return abs.replace(ROOT + "/", "");
}

function historicalAllowed(fileRel) {
  return HISTORICAL_OK.some((rule) => fileRel === rule.file);
}

const files = [];
for (const entry of SCAN_ROOTS) walk(entry, files);

let failures = 0;

for (const file of files) {
  const fileRel = rel(file);
  const lines = readFileSync(file, "utf8").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const [re, label] of BANNED) {
      if (!re.test(line)) continue;
      if (historicalAllowed(fileRel)) continue;
      failures++;
      console.error(`${fileRel}:${i + 1}: ${label}`);
      console.error(`  ${line.trim().slice(0, 140)}`);
    }
  }
}

if (failures) {
  console.error(
    `\n${failures} Plan Builder B booking-gate pattern(s). Free lesson booking must stay live.`
  );
  process.exit(1);
}

console.log(`funnel-b-booking-guard passed (${files.length} files)`);
