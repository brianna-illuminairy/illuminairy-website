#!/usr/bin/env node
/**
 * Prints Plan Builder step alias groups + HogQL helpers for funnel analysis.
 * Run: node scripts/quiz-step-alias-reference.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Minimal parse — keep in sync with lib/quiz-funnel/step-aliases.ts */
const src = readFileSync(
  join(root, "lib/quiz-funnel/step-aliases.ts"),
  "utf8"
);
const groupsMatch = src.match(
  /QUIZ_STEP_ALIAS_GROUPS[^=]*=\s*\{([\s\S]*?)\};/
);
if (!groupsMatch) {
  console.error("Could not parse QUIZ_STEP_ALIAS_GROUPS");
  process.exit(1);
}

const groups = {};
for (const line of groupsMatch[1].split("\n")) {
  const m = line.match(/^\s*"?([^":\s]+)"?:\s*\[([^\]]*)\]/);
  if (!m) continue;
  const canonical = m[1];
  const aliases = [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  groups[canonical] = aliases;
}

console.log("# Plan Builder step aliases (canonical → legacy IDs)\n");
for (const [canonical, aliases] of Object.entries(groups)) {
  const all = [canonical, ...aliases];
  console.log(`- **${canonical}** ← ${aliases.join(", ")}`);
  console.log(`  HogQL IN: (${all.map((s) => `'${s}'`).join(", ")})`);
  console.log("");
}

console.log("## Counting rules\n");
console.log(
  "- **New events (after deploy):** filter `properties.step = '<canonical>'` only."
);
console.log(
  "- **Historical / blended:** `count(DISTINCT person_id)` with `step IN (...)` — never add separate alias counts (that double-counts overlap)."
);
console.log(
  "- **Plan reveal:** step `v1` only (`is_plan_reveal = true`). NOT `achievability` / `reveal` / `s1`."
);
console.log(
  "- **Goal achievability (pre-name):** `achievability` ← reveal, s1. Component QFSGoalAchievability."
);
console.log(
  "- SSOT: lib/quiz-funnel/funnel-screen-roles.ts"
);

const utmSrc = readFileSync(
  join(root, "lib/marketing/utm-content-aliases.ts"),
  "utf8"
);
const utmMatch = utmSrc.match(
  /UTM_CONTENT_ALIAS_GROUPS[^=]*=\s*\{([\s\S]*?)\};/
);
if (utmMatch) {
  console.log("\n# Meta utm_content aliases (canonical → legacy slugs)\n");
  for (const line of utmMatch[1].split("\n")) {
    const m = line.match(/^\s*"?([^":\s]+)"?:\s*\[([^\]]*)\]/);
    if (!m) continue;
    const canonical = m[1];
    const aliases = [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
    const all = [canonical, ...aliases];
    console.log(`- **${canonical}** ← ${aliases.join(", ")}`);
    console.log(`  HogQL IN: (${all.map((s) => `'${s}'`).join(", ")})`);
    console.log("");
  }
  console.log(
    "- **New capture:** events emit canonical `utm_content` only (lib/attribution.ts)."
  );
  console.log(
    "- **Historical HogQL:** CASE map in growth/funnel-analysis-playbook.md"
  );
}
