#!/usr/bin/env node
/**
 * Plan Builder (/plan): every QFScreen must pass footer=.
 * Shell CSS must grid-dock the footer (no position:fixed on .qf-footer).
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

const MUST_HAVE_FOOTER = [
  "app/quiz/screens/Interstitials.jsx",
  "app/quiz/screens/Results.jsx",
  "app/quiz/screens/Finale.tsx",
  "app/quiz/components/QFInsightHit.jsx",
  "app/quiz/screens/Questions.jsx",
];

const FOOTER_BUTTON_MARKERS = ["QFButton", "QFContinueFooter", "QFSingleSelectFooter"];

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
    } else if (!FOOTER_BUTTON_MARKERS.some((m) => block.includes(m))) {
      errors.push(`${rel}: QFScreen #${idx + 1} footer must include a QF* footer button`);
    }
  });
}

const responsiveCss = join(ROOT, "app/funnel-responsive.css");
try {
  const css = readFileSync(responsiveCss, "utf8");
  if (/\.qf-footer[\s\S]{0,120}position:\s*fixed/.test(css)) {
    errors.push(
      "app/funnel-responsive.css: .qf-footer must not use position:fixed — grid row 3 docks the CTA"
    );
  }
} catch {
  errors.push("Missing file: app/funnel-responsive.css");
}

if (errors.length) {
  for (const e of errors) fail(e);
  console.error("\nSee app/quiz/LAYOUT.lock.md");
} else {
  console.log("quiz-cta-guard passed");
}

process.exit(process.exitCode ?? 0);
