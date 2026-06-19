#!/usr/bin/env node
/**
 * Blocks cream / deprecated font regression on Aurora product surfaces.
 * See .cursor/rules/aurora-brand.mdc
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();

const SCAN_DIRS = [
  "app/soha",
  "components/soha",
  "components/standard-enroll",
  "app/landing",
  "components/landing"
];

const SCAN_FILES = ["app/quiz-funnel.css"];

const BANNED_PATTERNS = [
  { re: /#f5ecd9/i, label: "cream hex #F5ECD9" },
  { re: /--danielle-cream/i, label: "--danielle-cream token" },
  { re: /--sr-cream/i, label: "--sr-cream token" },
  {
    re: /fonts\.googleapis\.com[^"'\s]*Fraunces|font-family:\s*['"]?Fraunces/i,
    label: "Fraunces font"
  },
  {
    re: /fonts\.googleapis\.com[^"'\s]*Cormorant|font-family:\s*['"]?Cormorant/i,
    label: "Cormorant font"
  },
  {
    re: /fonts\.googleapis\.com[^"'\s]*Space\+Grotesk|font-family:\s*['"]?Space Grotesk/i,
    label: "Space Grotesk font"
  }
];

/** Paths skipped entirely (legacy stacks). */
const ALLOWLIST_PREFIXES = [
  "app/danielle/",
  "content/danielle/",
  "app/admin/",
  "components/personalized-enroll/",
  "lib/personalized-enroll"
];

function rel(p) {
  return relative(ROOT, p).replace(/\\/g, "/");
}

function isAllowlisted(path) {
  return ALLOWLIST_PREFIXES.some((prefix) => path.startsWith(prefix));
}

function walkFiles(dir) {
  const abs = join(ROOT, dir);
  let st;
  try {
    st = statSync(abs);
  } catch {
    return [];
  }
  if (!st.isDirectory()) return [abs];
  const out = [];
  for (const name of readdirSync(abs)) {
    const child = join(abs, name);
    const childRel = rel(child);
    if (isAllowlisted(childRel)) continue;
    const childSt = statSync(child);
    if (childSt.isDirectory()) {
      out.push(...walkFiles(childRel));
    } else if (/\.(css|tsx|ts|html|jsx|js|mjs)$/i.test(name)) {
      out.push(child);
    }
  }
  return out;
}

function collectTargets() {
  const files = new Set();
  for (const dir of SCAN_DIRS) {
    for (const f of walkFiles(dir)) files.add(f);
  }
  for (const file of SCAN_FILES) {
    const abs = join(ROOT, file);
    if (!isAllowlisted(file)) files.add(abs);
  }
  return [...files];
}

const errors = [];

for (const abs of collectTargets()) {
  const path = rel(abs);
  let src;
  try {
    src = readFileSync(abs, "utf8");
  } catch {
    continue;
  }
  for (const { re, label } of BANNED_PATTERNS) {
    if (re.test(src)) {
      errors.push(`${path}: banned ${label}`);
    }
  }
}

if (errors.length) {
  console.error("aurora-brand-guard: failed\n");
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error("\nFix or allowlist in scripts/aurora-brand-guard.mjs (owner approval only).");
  process.exit(1);
}

console.log("aurora-brand-guard: ok");
