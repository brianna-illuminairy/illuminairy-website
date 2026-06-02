#!/usr/bin/env node
/**
 * Fail if customer-facing funnel copy contains em dashes (—).
 * See .cursor/rules/banned-copy-phrases.mdc
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["app/quiz", "lib/quiz-funnel", "lib/sat-skills-copy.ts"];
const EXT = new Set([".ts", ".tsx", ".js", ".jsx"]);

function walk(filePath, out) {
  const st = statSync(filePath);
  if (st.isDirectory()) {
    for (const name of readdirSync(filePath)) {
      if (name === "node_modules") continue;
      walk(join(filePath, name), out);
    }
    return;
  }
  if (!EXT.has(extname(filePath))) return;
  out.push(filePath);
}

function isSkippableLine(line) {
  const t = line.trim();
  if (t.startsWith("*") || t.startsWith("//") || t.startsWith("/*") || t.startsWith("*/")) {
    return true;
  }
  if (t.includes("{/*") || (t.startsWith("*") && t.endsWith("*/"))) return true;
  if (/^\{\/\*/.test(t) || /\*\/\}$/.test(t) || /\{\/\*.*\*\/\}/.test(t)) return true;
  return false;
}

const files = [];
for (const entry of SCAN_DIRS) {
  const full = join(ROOT, entry);
  try {
    if (statSync(full).isFile()) files.push(full);
    else walk(full, files);
  } catch {
    /* skip */
  }
}

const EM = "\u2014";
let failed = 0;

for (const file of files) {
  const rel = file.replace(ROOT + "/", "");
  const lines = readFileSync(file, "utf8").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes(EM)) continue;
    if (isSkippableLine(line)) continue;
  failed++;
    console.error(`${rel}:${i + 1}: em dash in customer-facing copy`);
    console.error(`  ${line.trim().slice(0, 120)}`);
  }
}

if (failed) {
  console.error(`\n${failed} em dash line(s). Use a period, comma, or colon instead.`);
  process.exit(1);
}

console.log(`OK: no em dashes in ${files.length} funnel copy file(s).`);
