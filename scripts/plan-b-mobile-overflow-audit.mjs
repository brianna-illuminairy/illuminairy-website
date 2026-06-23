#!/usr/bin/env node
/**
 * Plan B mobile overflow audit — no document scroll; step body fits on short phones.
 * Requires: npm run dev
 *
 *   FUNNEL_B_E2E_BASE=http://localhost:3003 node scripts/plan-b-mobile-overflow-audit.mjs
 */

import { chromium, devices } from "playwright";

const BASE = process.env.FUNNEL_B_E2E_BASE ?? "http://localhost:3000";
const TIMEOUT = 30_000;
const TOLERANCE = 2;

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
  parentName: "QA Parent",
  targetSchoolIds: ["ga-emory-university"],
  targetRegionId: "ga",
  regionalDiscountCode: "partner-college2",
  q7: [],
  parentPhone: "",
  childEmail: "",
  kidName: "",
  regionalDiscountPct: 10,
  claimCommitment: false,
  lessonLinkShared: false,
  confirmTcpa: false,
};

const STEPS = [
  "q1-parent-child",
  "q-grade",
  "q-score-lower",
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q9",
  "q8",
  "q-school-referral",
  "b-computing",
  "b-plan-ready",
  "b-email",
  "b-zip",
  "b-target-schools",
  "b-regional-unlock",
  "b-parent-name",
  "b-phone",
  "b-claim",
  "b-book",
];

async function measure(page) {
  return page.evaluate((tol) => {
    const root = document.documentElement;
    const qfBody = document.querySelector(".qf-body");
    const docY =
      Math.max(root.scrollHeight, document.body.scrollHeight) - window.innerHeight;
    const docX =
      Math.max(root.scrollWidth, document.body.scrollWidth) - window.innerWidth;
    let bodyY = 0;
    if (qfBody) bodyY = qfBody.scrollHeight - qfBody.clientHeight;

    const stepActions = document.querySelector('[aria-label="Step actions"]');
    let ctaVisible = true;
    if (stepActions) {
      const rect = stepActions.getBoundingClientRect();
      ctaVisible =
        rect.top >= 0 &&
        rect.bottom <= window.innerHeight + tol &&
        rect.left >= 0 &&
        rect.right <= window.innerWidth + tol;
    }

    const url = new URL(window.location.href);
    return {
      step: url.searchParams.get("step") ?? url.pathname,
      docY: Math.round(docY),
      docX: Math.round(docX),
      bodyY: Math.round(bodyY),
      ctaVisible,
    };
  }, TOLERANCE);
}

async function auditStep(page, stepId, deviceName, waitNetwork = false) {
  await page.goto(`${BASE}/plan-b?step=${stepId}&pb=b`, { waitUntil: "domcontentloaded" });
  await page.evaluate(({ answers, step }) => {
    localStorage.setItem("qfb_answers", JSON.stringify(answers));
    localStorage.setItem("qfb_last_step", step);
    localStorage.setItem("qfb_updated_at", String(Date.now()));
  }, { answers: SEED, step: stepId });
  await page.reload({
    waitUntil: waitNetwork ? "networkidle" : "domcontentloaded",
  });
  await page.waitForSelector(".qf-page", { timeout: TIMEOUT }).catch(() => {});
  if (waitNetwork) await page.waitForTimeout(2500);
  else await page.waitForTimeout(400);

  const m = await measure(page);
  const issues = [];
  if (m.docY > TOLERANCE) issues.push(`document scrollY +${m.docY}px`);
  if (m.docX > TOLERANCE) issues.push(`document scrollX +${m.docX}px`);
  if (m.bodyY > TOLERANCE) issues.push(`body scroll +${m.bodyY}px`);
  if (!m.ctaVisible) issues.push("pinned CTA not fully in viewport");

  return { device: deviceName, label: stepId, ...m, issues };
}

async function main() {
  try {
    const health = await fetch(`${BASE}/plan-b?step=q1-parent-child&pb=b`);
    if (!health.ok) throw new Error(`HTTP ${health.status}`);
  } catch (e) {
    console.error(`Cannot reach ${BASE}. Start dev server first. (${e.message})`);
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const all = [];

  for (const [name, device] of [
    ["iPhone SE", devices["iPhone SE"]],
    ["iPhone 13", devices["iPhone 13"]],
  ]) {
    const context = await browser.newContext({ ...device, reducedMotion: "reduce" });
    const page = await context.newPage();
    console.log(`\n${name} (${device.viewport.width}×${device.viewport.height})`);

    for (const step of STEPS) {
      const waitNetwork = step === "b-email";
      const r = await auditStep(page, step, name, waitNetwork);
      all.push(r);
      const mark = r.issues.length ? `⚠ ${r.issues.join("; ")}` : "✓";
      console.log(
        `  ${step.padEnd(20)} docY=${String(r.docY).padStart(3)} bodyY=${String(r.bodyY).padStart(3)} cta=${r.ctaVisible} ${mark}`
      );
    }

    await context.close();
  }

  await browser.close();

  const failures = all.filter((r) => r.issues.length > 0);
  console.log(`\n— Summary —`);
  console.log(`  Steps checked: ${all.length}`);
  console.log(`  Failures: ${failures.length}`);

  if (failures.length) {
    for (const r of failures) {
      console.log(`    ${r.device} · ${r.label}: ${r.issues.join("; ")}`);
    }
    process.exit(1);
  }

  console.log("\nPlan B mobile overflow audit passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
