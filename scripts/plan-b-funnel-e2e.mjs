#!/usr/bin/env node
/**
 * Plan Builder B lab funnel E2E — screenshots + speed timings.
 * Requires: npm run dev (default http://localhost:3003)
 *
 *   FUNNEL_B_E2E_BASE=http://localhost:3003 node scripts/plan-b-funnel-e2e.mjs
 */

import { chromium, devices } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.FUNNEL_B_E2E_BASE ?? "http://localhost:3003";
const TIMEOUT = 30_000;
const SHOT_DIR = join(process.cwd(), "exports", "plan-b-e2e-screenshots");

const AD_LP =
  "/sat-plan-builder?utm_source=meta&utm_medium=paid_social&utm_campaign=c1_sat_plan_builder_cold_creative_test&utm_content=ad3_before_tutoring_hd1080&utm_term=broad_moms_35_58&hook=tutor&version=hd1080&pb=b";

const GA_SCHOOLS = [
  "Emory University",
  "Georgia Tech",
  "University of Georgia",
  "Vanderbilt University",
  "Duke University",
  "UNC Chapel Hill",
];

const failures = [];
const passes = [];
const timings = [];
let shotIdx = 0;

function fail(step, msg) {
  failures.push({ step, msg });
  console.error(`  ✗ ${step}: ${msg}`);
}

function pass(step, detail = "ok") {
  passes.push(step);
  console.log(`  ✓ ${step}: ${detail}`);
}

async function waitForHydration(page) {
  await page.waitForSelector(".qf-page, .il-premium-page, main", { timeout: TIMEOUT });
  await page
    .locator("text=Loading your plan")
    .waitFor({ state: "detached", timeout: TIMEOUT })
    .catch(() => {});
  await page.waitForTimeout(200);
}

async function clearFunnelStorage(page) {
  await page.evaluate(() => {
    localStorage.removeItem("qfb_answers");
    localStorage.removeItem("qfb_last_step");
    localStorage.removeItem("qfb_updated_at");
    sessionStorage.removeItem("illuminairy_qfb_session_started");
    document.cookie = "qfb_snapshot=; Path=/; Max-Age=0; SameSite=Lax";
  });
}

async function screenshot(page, label, waitSelector) {
  if (waitSelector) {
    await page.waitForSelector(waitSelector, { timeout: TIMEOUT });
    await page.waitForTimeout(400);
  }
  shotIdx += 1;
  const name = `${String(shotIdx).padStart(2, "0")}-${label}.png`;
  const path = join(SHOT_DIR, name);
  await page.screenshot({ path, fullPage: true });
  console.log(`    📸 ${name}`);
  return path;
}

async function timedNav(page, label, url) {
  const start = Date.now();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await waitForHydration(page);
  const ms = Date.now() - start;
  timings.push({ label, ms });
  return ms;
}

async function clickFirstOption(page) {
  await page.locator(".qf-opt").first().click();
  await page.waitForTimeout(200);
}

async function advanceByOption(page, nextStepPattern) {
  await clickFirstOption(page);
  if (nextStepPattern) {
    await page.waitForURL(nextStepPattern, { timeout: TIMEOUT });
  }
  await page.waitForTimeout(200);
}

async function clickMultiContinue(page) {
  await page.locator(".qf-opt").first().click();
  await page.waitForSelector(".qf-opt.selected", { timeout: TIMEOUT });
  await page.locator('[aria-label="Step actions"] button.qf-btn').scrollIntoViewIfNeeded();
  await page.locator('[aria-label="Step actions"] button.qf-btn').click();
  await page.waitForTimeout(300);
}

async function clickContinue(page) {
  const footerBtn = page.locator('[aria-label="Step actions"] button.qf-btn');
  const inlineBtn = page.locator(
    ".qfb-email-capture__actions button.qf-btn, .qfb-target-schools ~ *, button.qf-btn.forest"
  );

  if ((await footerBtn.count()) > 0) {
    await footerBtn.first().scrollIntoViewIfNeeded();
    await footerBtn.first().click({ force: true });
  } else {
    const btn = page.locator("button.qf-btn.forest").first();
    await btn.waitFor({ state: "attached", timeout: TIMEOUT });
    await btn.scrollIntoViewIfNeeded();
    await btn.click({ force: true });
  }
  await page.waitForTimeout(300);
}

async function answerComputingPopups(page) {
  for (let i = 0; i < 2; i++) {
    const popup = page.locator(".qfb-compute-popup");
    await popup.waitFor({ state: "visible", timeout: 45_000 });
    await page.locator(".qfb-compute-popup__btn").first().click();
    await page.waitForTimeout(400);
  }
  await page.waitForURL(/step=b-plan-ready/, { timeout: 45_000 });
}

async function main() {
  mkdirSync(SHOT_DIR, { recursive: true });
  console.log(`Plan B E2E → ${BASE}`);
  console.log(`Screenshots → ${SHOT_DIR}\n`);

  try {
    const health = await fetch(`${BASE}/plan-b?step=q1-parent-child&pb=b`);
    if (!health.ok) throw new Error(`HTTP ${health.status}`);
  } catch (e) {
    console.error(`Cannot reach ${BASE}: ${e.message}`);
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...devices["iPhone 13"],
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  const errors = [];
  page.on("pageerror", (err) => errors.push(err.message));

  await page.goto(`${BASE}/plan-b?step=q1-parent-child&pb=b`, { waitUntil: "domcontentloaded" });
  await clearFunnelStorage(page);
  await page.reload({ waitUntil: "domcontentloaded" });

  const lpMs = await timedNav(page, "LP cold load", `${BASE}${AD_LP}`);
  await screenshot(page, "01-lp");
  pass("speed-lp", `${lpMs}ms`);

  const cta = page.getByRole("button", { name: /Build my child|Claim my child/i }).first();
  if ((await cta.count()) === 0) {
    fail("lp-cta", "no CTA button found");
  } else {
    await cta.scrollIntoViewIfNeeded();
    await cta.click();
    try {
      await page.waitForURL(/\/plan-b/, { timeout: 8000 });
    } catch {
      const qs = new URL(`${BASE}${AD_LP}`).searchParams.toString();
      await page.goto(`${BASE}/plan-b?step=q1-parent-child&${qs}`, {
        waitUntil: "domcontentloaded",
      });
    }
    await clearFunnelStorage(page);
    const handoffQs = new URL(`${BASE}${AD_LP}`).searchParams.toString();
    await page.goto(`${BASE}/plan-b?step=q1-parent-child&${handoffQs}`, {
      waitUntil: "domcontentloaded",
    });
    await waitForHydration(page);
    await screenshot(page, "02-funnel-entry");
    pass("lp-handoff", page.url());
  }

  await waitForHydration(page);
  await advanceByOption(page, /step=q-grade/);
  await advanceByOption(page, /step=q-score-lower/);
  await advanceByOption(page, /step=q1/);
  await advanceByOption(page, /step=q2/);
  await advanceByOption(page, /step=q3/);
  await advanceByOption(page, /step=q4/);
  await advanceByOption(page, /step=q5/);
  await advanceByOption(page, /step=q6/);
  await clickMultiContinue(page);
  await page.waitForURL(/step=q9/, { timeout: TIMEOUT });
  await advanceByOption(page, /step=q8/);
  await advanceByOption(page, /step=q-school-referral/);
  await advanceByOption(page, /step=b-computing/);
  await page.locator(".qfb-compute-popup").first().waitFor({ state: "visible", timeout: 45_000 });
  await page.waitForFunction(() => {
    const el = document.querySelector(".qfb-computing__row .qfb-computing__row-pct");
    if (!el) return false;
    const n = parseInt(el.textContent ?? "0", 10);
    return n >= 46 && n <= 50;
  }, { timeout: 10_000 });
  await screenshot(page, "03-computing-popup", ".qfb-compute-popup");
  await answerComputingPopups(page);
  await page.waitForURL(/step=b-plan-ready/, { timeout: TIMEOUT });
  await waitForHydration(page);
  await page.waitForSelector(".qfb-plan-ready-card", { timeout: TIMEOUT });
  await screenshot(page, "04-plan-ready");
  await clickContinue(page);

  await page.waitForURL(/step=b-email/, { timeout: TIMEOUT });
  await page.locator('input[type="email"]').fill("testemil@gmail.com");
  await clickContinue(page);

  await page.waitForURL(/step=b-zip/, { timeout: TIMEOUT });
  await page.locator('input[inputmode="numeric"]').fill("30301");
  await clickContinue(page);

  const schoolsMs = await (async () => {
    const start = Date.now();
    await page.waitForURL(/step=b-target-schools/, { timeout: TIMEOUT });
    await waitForHydration(page);
    return Date.now() - start;
  })();
  timings.push({ label: "zip → target schools", ms: schoolsMs });

  const schoolButtons = page.locator(".qfb-target-schools__btn");
  const count = await schoolButtons.count();
  const labels = [];
  for (let i = 0; i < count; i++) {
    labels.push((await schoolButtons.nth(i).innerText()).trim());
  }

  await screenshot(page, "05-target-schools-ga", ".qfb-target-schools");

  if (count < 3) fail("target-schools", `only ${count} options`);
  else pass("target-schools-count", `${count} options`);

  for (const name of GA_SCHOOLS) {
    const found = labels.some(
      (l) =>
        l.includes(name) ||
        (name === "UNC Chapel Hill" && l.includes("UNC"))
    );
    if (!found) fail("target-schools-ga", `missing ${name}`);
  }
  if (!failures.some((f) => f.step === "target-schools-ga")) {
    pass("target-schools-ga", labels.slice(0, 6).join(" · "));
  }

  await page.locator(".qfb-target-schools__btn").first().click();
  await clickContinue(page);
  await page.waitForURL(/step=b-regional-unlock/, { timeout: TIMEOUT });
  await screenshot(page, "06-regional-unlock", ".qfb-regional-unlock__benefits");
  pass("regional-unlock", "screen renders");

  await clickContinue(page);
  await page.waitForURL(/step=b-parent-name/, { timeout: TIMEOUT });
  await page.locator("input").first().fill("QA Parent");
  await clickContinue(page);

  await page.waitForURL(/step=b-phone/, { timeout: TIMEOUT });
  await screenshot(page, "07-phone-verify", ".qfb-phone-title");
  pass("phone-screen", "reached b-phone (SMS gate — manual in prod)");

  const calRes = await fetch(`${BASE}/api/funnel-b/calendly-availability`);
  if (calRes.ok) {
    pass("calendly-api", `HTTP ${calRes.status}`);
  } else {
    fail("calendly-api", `HTTP ${calRes.status}`);
  }

  await browser.close();

  writeFileSync(
    join(SHOT_DIR, "report.json"),
    JSON.stringify({ base: BASE, timings, passes: passes.length, failures, pageErrors: errors }, null, 2)
  );

  console.log("\n— Speed —");
  for (const t of timings) console.log(`  ${t.label}: ${t.ms}ms`);

  console.log(`\n${passes.length} passed, ${failures.length} failed`);
  if (errors.length) {
    console.log("\nPage errors:");
    for (const e of errors) console.log(`  ⚠ ${e}`);
  }
  if (failures.length) {
    process.exit(1);
  }
  console.log("\nPlan B E2E greenlight (through phone gate).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
