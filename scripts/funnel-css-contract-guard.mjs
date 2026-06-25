#!/usr/bin/env node
/**
 * Enforces the three-tier funnel CSS contract so layout splits cannot regress.
 * SSOT: docs/funnel-sibling-architecture.md · lib/funnel-sibling/css-contract.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  FUNNEL_LAYOUT_FILES,
  FUNNEL_DEFERRED_CSS_GLOBS,
  LAYOUT_CSS_IMPORT,
  FORBIDDEN_IN_DEFERRED,
  FUNNEL_RESPONSIVE_IMPORTS,
  FORBIDDEN_IN_CRITICAL,
} from "../lib/funnel-sibling/css-contract.mjs";

const ROOT = process.cwd();
const errors = [];

function read(relPath) {
  const abs = join(ROOT, relPath);
  if (!existsSync(abs)) {
    errors.push(`Missing file: ${relPath}`);
    return "";
  }
  return readFileSync(abs, "utf8");
}

for (const layoutPath of FUNNEL_LAYOUT_FILES) {
  const src = read(layoutPath);
  if (!src.includes(LAYOUT_CSS_IMPORT)) {
    errors.push(
      `${layoutPath}: must sync-import ${LAYOUT_CSS_IMPORT} (desktop column + shell on first paint)`
    );
  }
}

const responsivePath = "app/funnel-responsive.css";
const responsiveSrc = read(responsivePath);
for (const imp of FUNNEL_RESPONSIVE_IMPORTS) {
  if (!responsiveSrc.includes(imp)) {
    errors.push(`${responsivePath}: must @import ${imp}`);
  }
}
if (!responsiveSrc.includes("./funnel-entry-ssr.css")) {
  errors.push(`${responsivePath}: must @import ./funnel-entry-ssr.css`);
}

for (const deferredPath of FUNNEL_DEFERRED_CSS_GLOBS) {
  const src = read(deferredPath);
  const importLines = src.split("\n").filter((line) => line.trim().startsWith("@import"));
  for (const line of importLines) {
    for (const forbidden of FORBIDDEN_IN_DEFERRED.filter((f) => f.endsWith(".css"))) {
      if (line.includes(forbidden)) {
        errors.push(`${deferredPath}: must not @import ${forbidden}`);
      }
    }
  }
  if (src.includes("FUNNEL-MOBILE-SHELL-START")) {
    errors.push(`${deferredPath}: must not duplicate FUNNEL-MOBILE-SHELL block`);
  }
}

const criticalListSrc = read("lib/funnel-sibling/critical-css-files.ts");
const criticalBlock =
  criticalListSrc.match(/PLAN_B_CRITICAL_CSS_FILES\s*=\s*\[([\s\S]*?)\]\s*as const/)?.[1] ?? "";
const criticalFiles = [...criticalBlock.matchAll(/"([^"]+\.css)"/g)].map((match) => match[1]);
for (const forbidden of FORBIDDEN_IN_CRITICAL) {
  if (criticalFiles.includes(forbidden)) {
    errors.push(
      `lib/funnel-sibling/critical-css-files.ts: ${forbidden} must not be in PLAN_B_CRITICAL_CSS_FILES`
    );
  }
}

if (errors.length) {
  console.error("funnel-css-contract-guard failed:\n");
  for (const err of errors) console.error(`  • ${err}`);
  process.exit(1);
}

console.log("funnel-css-contract-guard OK");
