#!/usr/bin/env node
/**
 * Blocks layout drift on /satplan quiz steps.
 * Content-only step files; locked shell/CSS unless FUNNEL_LAYOUT_UNLOCK=1.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const UNLOCK = process.env.FUNNEL_LAYOUT_UNLOCK === "1";

const LOCKED = [
  "app/satplan/funnel.css",
  "components/sat-plan/funnel-shell.tsx",
  "components/sat-plan/quiz-step-template.tsx",
  "components/sat-plan/funnel-cta.tsx",
  "lib/sat-plan-funnel/quiz-step-layout.ts"
];

const STEP_EXEMPT = new Set([
  "components/sat-plan/sat-plan-funnel.tsx",
  "components/sat-plan/sat-plan-landing.tsx",
  "components/sat-plan/sat-plan-chapter-stub.tsx"
]);

const STEP_FORBIDDEN_IMPORTS = [
  "@/components/sat-plan/funnel-shell",
  "@/components/sat-plan/funnel-cta"
];

const STEP_FORBIDDEN_PROPS = ["bodyClassName=", "footer=", "className=", "style={{"];

function rel(p) {
  return relative(ROOT, p).replace(/\\/g, "/");
}

function gitChangedPaths() {
  const out = new Set();
  for (const args of [["diff", "--name-only", "HEAD"], ["diff", "--cached", "--name-only"]]) {
    const r = spawnSync("git", args, { cwd: ROOT, encoding: "utf8" });
    if (r.status !== 0) continue;
    for (const line of (r.stdout || "").split("\n")) {
      const t = line.trim();
      if (t) out.add(t);
    }
  }
  return out;
}

function listStepScreens() {
  const dir = join(ROOT, "components/sat-plan");
  return readdirSync(dir)
    .filter((f) => f.startsWith("sat-plan-") && f.endsWith(".tsx"))
    .map((f) => `components/sat-plan/${f}`)
    .filter((p) => !STEP_EXEMPT.has(p));
}

function fail(msg) {
  console.error(`funnel-layout-guard: ${msg}`);
  process.exitCode = 1;
}

const errors = [];

if (!UNLOCK) {
  const changed = gitChangedPaths();
  for (const path of LOCKED) {
    if (changed.has(path)) {
      errors.push(
        `Locked layout file modified: ${path}. Set FUNNEL_LAYOUT_UNLOCK=1 only with owner approval.`
      );
    }
  }
}

for (const path of listStepScreens()) {
  const abs = join(ROOT, path);
  let src;
  try {
    src = readFileSync(abs, "utf8");
  } catch {
    continue;
  }

  for (const imp of STEP_FORBIDDEN_IMPORTS) {
    if (src.includes(`from "${imp}"`) || src.includes(`from '${imp}'`)) {
      errors.push(`${path}: do not import ${imp} — use QuizStepTemplate (content only).`);
    }
  }

  for (const prop of STEP_FORBIDDEN_PROPS) {
    if (src.includes(prop)) {
      errors.push(`${path}: forbidden layout prop "${prop.replace("=", "")}" — use bodyVariant + copy only.`);
    }
  }

  if (!src.includes("QuizStepTemplate")) {
    errors.push(`${path}: must render through QuizStepTemplate.`);
  }
}

if (errors.length) {
  for (const e of errors) fail(e);
  console.error("\nLayout is locked. See components/sat-plan/LAYOUT.lock.md and AGENTS.md.");
} else {
  console.log("funnel-layout-guard passed");
}

process.exit(process.exitCode ?? 0);
