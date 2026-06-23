#!/usr/bin/env node
/**
 * Plan Builder B — step interaction + pinned CTA guard.
 * SSOT: lib/quiz-funnel-b/step-interaction.mjs
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  LAB_OPTION_TAP_STEPS,
  LAB_PINNED_CTA_STEPS,
  LAB_AUTO_ADVANCE_STEPS,
  LAB_INLINE_CTA_STEPS,
  LAB_STEP_INTERACTION,
  LAB_STEP_SCREEN_FILE,
} from "../lib/quiz-funnel-b/step-interaction.mjs";

const ROOT = process.cwd();
const LAB_DIR = join(ROOT, "app/quiz-b/screens/lab");
const RUNNER = join(ROOT, "app/quiz-b/QuizRunner.tsx");
const QUESTIONS = join(ROOT, "app/quiz/screens/Questions.jsx");

function fail(msg) {
  console.error(`funnel-b-cta-guard: ${msg}`);
  process.exitCode = 1;
}

const errors = [];

function read(rel) {
  try {
    return readFileSync(join(ROOT, rel), "utf8");
  } catch {
    return null;
  }
}

function listLabScreens() {
  return readdirSync(LAB_DIR).filter((f) => f.endsWith(".tsx"));
}

const runnerSrc = read("app/quiz-b/QuizRunner.tsx") ?? "";
const questionsSrc = read("app/quiz/screens/Questions.jsx") ?? "";

for (const m of runnerSrc.matchAll(/case '([^']+)':/g)) {
  const step = m[1];
  if (!LAB_STEP_INTERACTION[step]) {
    errors.push(`step-interaction.mjs: missing mode for routed step "${step}"`);
  }
}

for (const step of LAB_OPTION_TAP_STEPS) {
  const file = LAB_STEP_SCREEN_FILE[step];
  if (file) {
    const src = readFileSync(join(LAB_DIR, file), "utf8");
    if (/\bactions=\{/.test(src) || /\bactions=</.test(src)) {
      errors.push(`${file} (${step}): option-tap steps must not use QFScreen actions=`);
    }
    continue;
  }
  if (["q1-parent-child", "q-score-lower", "q1", "q2", "q3", "q4", "q5", "q8", "q9"].includes(step)) {
    if (!questionsSrc) {
      errors.push("Missing app/quiz/screens/Questions.jsx");
    }
  }
}

for (const step of LAB_PINNED_CTA_STEPS) {
  const file = LAB_STEP_SCREEN_FILE[step];
  if (!file) continue;
  const src = readFileSync(join(LAB_DIR, file), "utf8");
  if (step === "b-phone") {
    if (!src.includes("qfb-phone-continue") && !/\bactions=\{/.test(src)) {
      errors.push(`${file} (${step}): form-continue needs inline or pinned Continue`);
    }
    continue;
  }
  if (!/\bactions=\{/.test(src) && !/\bactions=</.test(src)) {
    errors.push(`${file} (${step}): must use QFScreen actions= for pinned Continue`);
  }
}

for (const step of LAB_AUTO_ADVANCE_STEPS) {
  if (step.startsWith("hit-")) {
    const block =
      runnerSrc.match(
        new RegExp(`case '${step.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}':[\\s\\S]*?break;`, "m")
      )?.[0] ?? "";
    if (!block.includes("QFInsightHit")) {
      errors.push(`QuizRunner ${step}: auto-advance insight must use QFInsightHit`);
    }
    continue;
  }
  if (step === "b-computing") {
    const src = readFileSync(join(LAB_DIR, "BComputing.tsx"), "utf8");
    if (/\bactions=\{/.test(src)) {
      errors.push("BComputing.tsx: auto-advance must not use pinned QFScreen actions=");
    }
  }
}

for (const step of LAB_INLINE_CTA_STEPS) {
  const file = LAB_STEP_SCREEN_FILE[step];
  if (!file) continue;
  const src = readFileSync(join(LAB_DIR, file), "utf8");
  if (src.includes("<QFScreen") && /\bactions=\{/.test(src)) {
    errors.push(`${file} (${step}): inline-cta steps must not use QFScreen actions=`);
  }
}

for (const file of listLabScreens()) {
  const src = readFileSync(join(LAB_DIR, file), "utf8");
  if (src.includes("footer=") && src.includes("<QFScreen")) {
    errors.push(`${file}: use actions= on QFScreen, not footer=`);
  }
}

if (errors.length) {
  for (const e of errors) fail(e);
  console.error("\nSee docs/funnel-mobile-shell.md and lib/quiz-funnel-b/step-interaction.mjs");
} else {
  console.log("funnel-b-cta-guard passed (Plan B step interaction modes)");
}

process.exit(process.exitCode ?? 0);
