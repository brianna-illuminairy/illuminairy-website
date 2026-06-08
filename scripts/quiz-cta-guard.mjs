#!/usr/bin/env node
/**
 * Plan Builder (/plan): mobile shell + step interaction modes (no invented CTAs).
 * Spec: docs/funnel-mobile-shell.md · Registry: lib/quiz-funnel/step-interaction.mjs
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import {
  STEP_INTERACTION,
  AUTO_ADVANCE_STEPS,
} from "../lib/quiz-funnel/step-interaction.mjs";

const ROOT = process.cwd();
const UNLOCK = process.env.FUNNEL_LAYOUT_UNLOCK === "1";

const LOCKED_SHELL = [
  "app/funnel-responsive.css",
  "app/quiz-globals.css",
  "app/quiz/components/QFShell.tsx",
  "app/quiz/layout.tsx",
  "app/quiz/page.tsx",
  "app/quiz/components/QFProgressContext.tsx",
  "app/quiz/state.tsx",
];

const STEP_SCAN_DIRS = ["app/quiz/screens", "app/quiz/components"];

/** Catch unclosed `{` before CSS ships — PostHog saw this break the funnel on Jun 7. */
function cssBraceDepth(css) {
  let depth = 0;
  for (const line of css.split("\n")) {
    depth += line.split("{").length - 1;
    depth -= line.split("}").length - 1;
    if (depth < 0) return -1;
  }
  return depth;
}

const STEP_EXEMPT = new Set([
  "app/quiz/components/QFShell.tsx",
  "app/quiz/components/QFFunnelLegal.tsx",
  "app/quiz/components/QFProgressContext.tsx",
]);

const STEP_FORBIDDEN = [
  { re: /minHeight:\s*['"]100(d)?vh/i, msg: "inline minHeight 100vh/dvh — fix shell chain, not step file" },
  { re: /height:\s*['"]100(d)?vh/i, msg: "inline height 100vh/dvh — fix shell chain, not step file" },
  { re: /style=\{\{[^}]*100(d)?vh/i, msg: "inline style viewport height in step file" },
  { re: /<QFScreen[^>]*\sfooter=/, msg: "use actions= on QFScreen, not footer=" },
];

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

function listFilesUnder(dirRel) {
  const abs = join(ROOT, dirRel);
  const out = [];
  for (const ent of readdirSync(abs, { withFileTypes: true })) {
    const p = join(dirRel, ent.name);
    if (ent.isDirectory()) out.push(...listFilesUnder(p));
    else if (/\.(tsx|ts|jsx|js)$/.test(ent.name)) out.push(p);
  }
  return out;
}

function fail(msg) {
  console.error(`quiz-cta-guard: ${msg}`);
  process.exitCode = 1;
}

const errors = [];

if (!UNLOCK) {
  for (const path of LOCKED_SHELL) {
    if (gitChangedPaths().has(path)) {
      errors.push(
        `Locked shell file modified: ${path}. Set FUNNEL_LAYOUT_UNLOCK=1 only with owner approval.`
      );
    }
  }
}

for (const relPath of STEP_SCAN_DIRS.flatMap(listFilesUnder)) {
  if (STEP_EXEMPT.has(relPath)) continue;
  let src;
  try {
    src = readFileSync(join(ROOT, relPath), "utf8");
  } catch {
    continue;
  }
  for (const { re, msg } of STEP_FORBIDDEN) {
    if (re.test(src)) errors.push(`${relPath}: ${msg}`);
  }
  if (src.includes("footer=") && src.includes("<QFScreen")) {
    errors.push(`${relPath}: use actions= on QFScreen — footer is legal-only (QFFunnelLegal)`);
  }
}

const runnerPath = join(ROOT, "app/quiz/QuizRunner.tsx");
let runnerSrc = "";
try {
  runnerSrc = readFileSync(runnerPath, "utf8");
} catch {
  errors.push("Missing file: app/quiz/QuizRunner.tsx");
}

for (const stepId of AUTO_ADVANCE_STEPS) {
  const caseRe = new RegExp(`case '${stepId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}':[\\s\\S]*?break;`, "m");
  const block = runnerSrc.match(caseRe)?.[0] ?? "";
  if (!block.includes("QFInsightHit")) {
    errors.push(`QuizRunner ${stepId}: auto-advance steps must use QFInsightHit`);
  } else if (/\bmanual\b/.test(block)) {
    errors.push(`QuizRunner ${stepId}: auto-advance must not pass manual to QFInsightHit`);
  }
}

const manualHit = runnerSrc.match(/case 'hit-q7':[\s\S]*?break;/)?.[0] ?? "";
if (manualHit && !/\bmanual\b/.test(manualHit)) {
  errors.push("QuizRunner hit-q7: manual insight must pass manual to QFInsightHit");
}

const insightHitPath = join(ROOT, "app/quiz/components/QFInsightHit.jsx");
try {
  const src = readFileSync(insightHitPath, "utf8");
  if (!src.includes("qf-insight-hit__auto-footer")) {
    errors.push("QFInsightHit.jsx: auto-advance must use progress footer, not invented CTA");
  }
  if (!src.includes("prefers-reduced-motion")) {
    errors.push("QFInsightHit.jsx: reduced motion must fall back to explicit Continue");
  }
} catch {
  errors.push("Missing file: app/quiz/components/QFInsightHit.jsx");
}

const responsiveCss = join(ROOT, "app/funnel-responsive.css");
try {
  const css = readFileSync(responsiveCss, "utf8");
  if (!css.includes("FUNNEL-MOBILE-SHELL-START") || !css.includes("FUNNEL-MOBILE-SHELL-END")) {
    errors.push("app/funnel-responsive.css: missing FUNNEL-MOBILE-SHELL markers");
  }
  if (!/\.qf-funnel-root\s*\{[\s\S]*?--qf-viewport-h:\s*100dvh/.test(css)) {
    errors.push("app/funnel-responsive.css: .qf-funnel-root must anchor viewport with --qf-viewport-h");
  }
} catch {
  errors.push("Missing file: app/funnel-responsive.css");
}

const funnelCss = join(ROOT, "app/quiz-funnel.css");
try {
  const css = readFileSync(funnelCss, "utf8");
  const pageShell = css.match(/\.qf-page\s*\{[\s\S]*?\n\}/)?.[0] ?? "";
  if (!pageShell.includes("display: flex") || !pageShell.includes("flex-direction: column")) {
    errors.push("app/quiz-funnel.css: .qf-page shell must be flex column (pinned CTAs)");
  }
  if (pageShell.includes("display: grid")) {
    errors.push("app/quiz-funnel.css: .qf-page shell must not use display:grid");
  }
  if (/100dvh|100svh|100vh/.test(pageShell)) {
    errors.push("app/quiz-funnel.css: .qf-page must not set viewport units — use funnel-responsive.css");
  }
  const actionsRule =
    css.match(/\.qf-page \.qf-step-actions\s*\{[\s\S]*?\n\}/)?.[0] ?? "";
  if (actionsRule.includes("position: fixed") || actionsRule.includes("position:fixed")) {
    errors.push("app/quiz-funnel.css: .qf-step-actions must not use position:fixed");
  }
  if (!/\.qf-page \.qf-body\s*\{[\s\S]*?min-height:\s*0/.test(css)) {
    errors.push("app/quiz-funnel.css: .qf-body needs min-height:0 for scroll + pinned actions");
  }
  const braceDepth = cssBraceDepth(css);
  if (braceDepth !== 0) {
    errors.push(
      `app/quiz-funnel.css: unbalanced braces (depth ${braceDepth}) — fix before deploy`
    );
  }
  if (/\.qf-page\s+\.qf-footer\b/.test(css)) {
    errors.push(
      "app/quiz-funnel.css: stale .qf-footer selector — use .qf-step-actions + .qf-funnel-legal"
    );
  }
} catch {
  errors.push("Missing file: app/quiz-funnel.css");
}

const globalsCss = join(ROOT, "app/quiz-globals.css");
try {
  const css = readFileSync(globalsCss, "utf8");
  if (!/main\.funnel-main:has\(\.qf-funnel-root\)/.test(css)) {
    errors.push("app/quiz-globals.css: missing funnel-main flex bridge");
  }
  if (/100dvh|100svh/.test(css)) {
    errors.push("app/quiz-globals.css: viewport units belong only in funnel-responsive.css");
  }
} catch {
  errors.push("Missing file: app/quiz-globals.css");
}

const shellPath = join(ROOT, "app/quiz/components/QFShell.tsx");
try {
  const shell = readFileSync(shellPath, "utf8");
  if (shell.includes("footer?:") || shell.includes("footer,")) {
    errors.push("QFShell.tsx: remove footer prop — use actions for step chrome");
  }
  if (!shell.includes('aria-label="Step actions"')) {
    errors.push("QFShell.tsx: step chrome region keeps aria-label=\"Step actions\" for e2e");
  }
} catch {
  errors.push("Missing file: app/quiz/components/QFShell.tsx");
}

const pagePath = join(ROOT, "app/quiz/page.tsx");
try {
  const page = readFileSync(pagePath, "utf8");
  if (/100(d)?vh/.test(page)) {
    errors.push("app/quiz/page.tsx: no viewport height inline — use qf-page--skeleton");
  }
} catch {
  errors.push("Missing file: app/quiz/page.tsx");
}

const registrySteps = new Set(Object.keys(STEP_INTERACTION));
if (runnerSrc) {
  const baseMatch = runnerSrc.match(/const BASE_STEPS = \[([\s\S]*?)\];/);
  if (baseMatch) {
    for (const m of baseMatch[1].matchAll(/'([^']+)'/g)) {
      if (!registrySteps.has(m[1])) {
        errors.push(`step-interaction.mjs: missing mode for routed step "${m[1]}"`);
      }
    }
  }
  for (const id of ["hit-q3-none", "doubts-insight", "hit-q5-tbd", "hit-q8-scores", "i-gap", "booked", "reveal", "s1"]) {
    if (runnerSrc.includes(`case '${id}':`) && !registrySteps.has(id)) {
      errors.push(`step-interaction.mjs: missing mode for conditional step "${id}"`);
    }
  }
}

if (errors.length) {
  for (const e of errors) fail(e);
  console.error("\nSee docs/funnel-mobile-shell.md and lib/quiz-funnel/step-interaction.mjs");
} else {
  console.log("quiz-cta-guard passed (mobile shell + step interaction modes)");
}

process.exit(process.exitCode ?? 0);
