#!/usr/bin/env node
/**
 * Plan B (/plan-b) end-to-end walker.
 * - Walks every step in the funnel route
 * - Screenshots iPhone SE (375x667) + Desktop 1280
 * - Asserts: no page-level scroll, b-computing popup renders, UTM superprops capture
 *
 * Usage: BASE=http://localhost:3000 node scripts/plan-b-funnel-e2e.mjs
 * Default BASE = http://localhost:3000
 */

import { chromium, devices } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:3000";
const OUT = "exports/plan-b-funnel-e2e";

mkdirSync(OUT, { recursive: true });

const SEED = {
  qWho: "parent",
  qGrade: "11",
  qScoreLower: "yes",
  q1: "aug2026",
  q2: "1400",
  q3: "khan",
  q4: "yes",
  q5: "aug2026",
  q6: ["time"],
  q8: "1400",
  q9: "3.8",
  qSchoolReferral: "no",
  parentEmail: "testemil@gmail.com",
  parentZip: "30301",
  parentName: "QA Mom",
  targetSchoolIds: ["ga-emory-university"],
  targetRegionId: "ga",
  regionalDiscountCode: "GA10",
  regionalDiscountPct: 10,
  q7: [],
  parentPhone: "",
  childEmail: "",
  kidName: "",
  claimCommitment: false,
  lessonLinkShared: false,
  confirmTcpa: false,
};

const STEPS = [
  "q1-parent-child",
  "q-grade",
  "q-score-lower",
  "q4",
  "q-school-referral",
  "b-computing",
  "b-plan-ready",
  "b-email",
  "b-target-schools",
  "b-regional-unlock",
];

const VIEWPORTS = [
  ["iPhone-SE", { ...devices["iPhone SE"] }],
  [
    "Desktop-1280",
    {
      viewport: { width: 1280, height: 800 },
      userAgent: devices["Desktop Chrome"].userAgent,
    },
  ],
];

const findings = [];
const issues = [];

function ok(msg) {
  console.log(`  ✓ ${msg}`);
}

function bad(msg) {
  console.log(`  ✗ ${msg}`);
  issues.push(msg);
}

const browser = await chromium.launch({ headless: true });

for (const [name, deviceCfg] of VIEWPORTS) {
  const ctx = await browser.newContext(deviceCfg);
  const page = await ctx.newPage();
  console.log(`\n— ${name} —`);

  for (const step of STEPS) {
    const url = `${BASE}/plan-b?step=${step}&pb=b&utm_source=meta&utm_campaign=plan_b_e2e&utm_content=ad3`;
    await page.goto(url);
    await page.evaluate(
      ({ a, s }) => {
        try {
          localStorage.setItem("qfb_answers", JSON.stringify(a));
          localStorage.setItem("qfb_last_step", s);
        } catch {}
      },
      { a: SEED, s: step }
    );
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(step === "b-computing" ? 1500 : 700);

    const m = await page.evaluate(() => {
      const body = document.querySelector(".qf-body");
      const popup = document.querySelector(
        ".qfb-compute-popup, .qfb-computing__popup, [class*='compute-popup']"
      );
      const pageOverflowY = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      let utms = null;
      try {
        utms = JSON.parse(localStorage.getItem("illuminairy_utm_b_v1") || "null");
      } catch {}
      return {
        bodyScrollH: body ? body.scrollHeight : 0,
        bodyClientH: body ? body.clientHeight : 0,
        pageOverflowY,
        popupVisible: popup ? popup.offsetHeight > 0 : false,
        utms,
      };
    });

    findings.push({ device: name, step, metrics: m });
    await page.screenshot({
      path: `${OUT}/${name}-${step}.png`,
      fullPage: false,
    });

    if (m.pageOverflowY > 2) bad(`${step}: PAGE scroll ${m.pageOverflowY}px`);
    else ok(`${step}: no page scroll`);

    if (step === "b-computing") {
      if (m.popupVisible) ok("b-computing popup renders");
      else bad("b-computing popup MISSING");
    }
  }

  const utms = findings.find((f) => f.device === name)?.metrics?.utms;
  if (
    utms &&
    utms.utm_source === "meta" &&
    utms.utm_campaign === "plan_b_e2e" &&
    utms.utm_content === "ad3"
  ) {
    ok("UTM superprops persisted to localStorage");
  } else {
    bad(`UTM superprops NOT persisted: ${JSON.stringify(utms)}`);
  }

  await ctx.close();
}

await browser.close();

writeFileSync(`${OUT}/findings.json`, JSON.stringify(findings, null, 2));

console.log(`\n${issues.length === 0 ? "All checks passed" : `${issues.length} ISSUES`}`);
if (issues.length > 0) {
  issues.forEach((i) => console.log(`  - ${i}`));
  process.exit(1);
}

console.log(`Screenshots + JSON in ${OUT}/`);
