#!/usr/bin/env node
/**
 * Plan Builder (/plan): screens with an explicit footer CTA must pass footer=.
 * Single-select question screens use option tap only (no footer).
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

const MUST_HAVE_FOOTER = [
  "app/quiz/screens/Interstitials.jsx",
  "app/quiz/screens/Results.jsx",
  "app/quiz/screens/Finale.tsx",
  "app/quiz/components/QFInsightHit.jsx",
];

/** Multi-select / form steps in Questions.jsx — must keep a footer CTA. */
const QUESTIONS_FOOTER_EXPORTS = [
  "QFQDoubts",
  "QFQ6Blocker",
  "QFQ7Tried",
  "QFQName",
];

function fail(msg) {
  console.error(`quiz-cta-guard: ${msg}`);
  process.exitCode = 1;
}

function qfScreenBlocks(src) {
  const blocks = [];
  let i = 0;
  while (i < src.length) {
    const start = src.indexOf("<QFScreen", i);
    if (start < 0) break;
    let depth = 0;
    let j = start;
    let end = -1;
    while (j < src.length) {
      if (src.startsWith("<QFScreen", j)) {
        depth += 1;
        j += 9;
        continue;
      }
      if (src.startsWith("</QFScreen>", j)) {
        depth -= 1;
        j += 11;
        if (depth === 0) {
          end = j;
          break;
        }
        continue;
      }
      j += 1;
    }
    if (end < 0) break;
    blocks.push(src.slice(start, end));
    i = end;
  }
  return blocks;
}

function exportBlocks(src, exportName) {
  const re = new RegExp(`export function ${exportName}\\([\\s\\S]*?(?=\\nexport function |$)`);
  const m = src.match(re);
  return m ? m[0] : "";
}

const errors = [];

for (const rel of MUST_HAVE_FOOTER) {
  const abs = join(ROOT, rel);
  let src;
  try {
    src = readFileSync(abs, "utf8");
  } catch {
    errors.push(`Missing file: ${rel}`);
    continue;
  }

  const blocks = qfScreenBlocks(src);
  if (!blocks.length) {
    errors.push(`${rel}: no QFScreen usage found`);
    continue;
  }

  blocks.forEach((block, idx) => {
    if (!block.includes("footer=")) {
      errors.push(`${rel}: QFScreen #${idx + 1} missing footer= (CTA required)`);
    } else if (!block.includes("QFButton") && !block.includes("QFContinueFooter")) {
      errors.push(`${rel}: QFScreen #${idx + 1} footer must include QFButton`);
    }
  });
}

const questionsPath = join(ROOT, "app/quiz/screens/Questions.jsx");
let questionsSrc;
try {
  questionsSrc = readFileSync(questionsPath, "utf8");
} catch {
  errors.push("Missing file: app/quiz/screens/Questions.jsx");
}

if (questionsSrc) {
  for (const name of QUESTIONS_FOOTER_EXPORTS) {
    const block = exportBlocks(questionsSrc, name);
    if (!block) {
      errors.push(`Questions.jsx: missing export ${name}`);
      continue;
    }
    if (!block.includes("footer=")) {
      errors.push(`Questions.jsx: ${name} missing footer= (multi-select / form CTA required)`);
    }
  }
}

if (errors.length) {
  for (const e of errors) fail(e);
  console.error("\nSee app/quiz/LAYOUT.lock.md");
} else {
  console.log("quiz-cta-guard passed");
}

process.exit(process.exitCode ?? 0);
