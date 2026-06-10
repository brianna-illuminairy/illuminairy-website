#!/usr/bin/env node
/**
 * Block reintroduction of Plan Builder booking gate patterns (Jun 2026 incident).
 * s5 must always show Calendly; no lead-only hold, env toggles, or UTM-based gating.
 *
 * Run: npm run funnel:booking-guard
 * Wired into: npm run agent:verify
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
const EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".mdc", ".md"]);
const SCAN_ROOTS = [
  "app/quiz",
  "app/api/funnel",
  "lib/quiz-funnel",
  "lib/calendly",
  "middleware.ts",
  ".env.example",
  ".cursor/rules",
  "components",
];
const SKIP_DIRS = new Set(["node_modules", ".next", "archives"]);

/** [pattern, human label] */
const BANNED = [
  [/Save my plan/i, "unapproved s5 CTA 'Save my plan'"],
  [/plan-booking-gate/i, "plan-booking-gate module name"],
  [/plan_builder_booking_gate/i, "plan_builder_booking_gate module name"],
  [/shouldGatePlanBuilderBooking/i, "shouldGatePlanBuilderBooking()"],
  [/PLAN_BOOKING_GATE/i, "PLAN_BOOKING_GATE copy constant"],
  [/PLAN_BUILDER_BOOKING_PAUSED/i, "PLAN_BUILDER_BOOKING_PAUSED env"],
  [/PLAN_BUILDER_BOOKING_LIVE/i, "PLAN_BUILDER_BOOKING_LIVE env"],
  [/plan_booking_qa/i, "plan_booking_qa bypass URL/cookie"],
  [/bookingGated/i, "bookingGated UI branch"],
  [/booking_deferred/i, "booking_deferred analytics flag"],
  [/booking_paused/i, "booking_paused error code"],
  [/schedulerEnabled=\{!bookingGated\}/, "scheduler disabled by gate flag"],
];

const HISTORICAL_OK = [
  {
    file: "growth/posthog-funnel-dashboard.md",
    test: (line) =>
      /Historical|deprecated|removed from code|Jun 10, 2026 gate/i.test(line),
  },
  {
    file: ".cursor/rules/plan-builder-booking-lock.mdc",
    test: () => true,
  },
  {
    file: "scripts/funnel-booking-guard.mjs",
    test: () => true,
  },
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

function historicalAllowed(fileRel, line) {
  return HISTORICAL_OK.some(
    (rule) => fileRel === rule.file && rule.test(line)
  );
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
      if (historicalAllowed(fileRel, line)) continue;
      failures++;
      console.error(`${fileRel}:${i + 1}: ${label}`);
      console.error(`  ${line.trim().slice(0, 140)}`);
    }
  }
}

if (failures) {
  console.error(
    `\n${failures} booking-gate pattern(s). s5 must stay live Calendly — see .cursor/rules/plan-builder-booking-lock.mdc`
  );
  process.exit(1);
}

console.log(`funnel-booking-guard passed (${files.length} files)`);
