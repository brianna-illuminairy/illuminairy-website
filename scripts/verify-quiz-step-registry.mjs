#!/usr/bin/env node
/**
 * Ensures every step in getSteps() has a switch case in QuizRunner.tsx.
 * Prevents regressions when steps are added to BASE_STEPS or conditional inserts.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const routePath = join(root, "lib/quiz-funnel/quiz-route.ts");
const src = readFileSync(routePath, "utf8");

const baseMatch = src.match(
  /export const BASE_QUIZ_ROUTE_STEPS = \[([\s\S]*?)\]\s*(?:as const)?;/
);
if (!baseMatch) {
  console.error("Could not parse BASE_QUIZ_ROUTE_STEPS in lib/quiz-funnel/quiz-route.ts");
  process.exit(1);
}

const baseSteps = [...baseMatch[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);

const conditionalSteps = [
  "hit-q3-none",
  "doubts-insight",
  "hit-q5-tbd",
  "hit-q8-scores",
  "i-gap",
  "booked",
  "achievability", // deep-link / share alias (plan reveal content)
  "reveal", // deprecated alias route for the reveal content
  "s1", // alias route for the reveal content
];

const allSteps = [...new Set([...baseSteps, ...conditionalSteps])];

const runnerSrc = readFileSync(join(root, "app/quiz/QuizRunner.tsx"), "utf8");
const switchCases = [...runnerSrc.matchAll(/case '([^']+)':/g)].map((m) => m[1]);
const switchSet = new Set(switchCases);

const missing = allSteps.filter((s) => !switchSet.has(s));
const orphanCases = switchCases.filter(
  (s) => s !== "default" && !allSteps.includes(s) && s !== "s1"
);

let failed = false;

if (missing.length) {
  failed = true;
  console.error("Steps in routing without switch case:");
  for (const s of missing) console.error(`  - ${s}`);
}

if (orphanCases.length) {
  console.warn("Switch cases not in BASE_STEPS / known conditionals (review manually):");
  for (const s of orphanCases) console.warn(`  - ${s}`);
}

if (failed) {
  process.exit(1);
}

console.log(`OK: ${allSteps.length} routed steps have switch coverage (${switchCases.length} cases).`);
