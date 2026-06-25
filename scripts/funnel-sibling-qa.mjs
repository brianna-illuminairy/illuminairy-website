#!/usr/bin/env node
/**
 * Funnel sibling architecture QA — all three funnels + ad LP handoff.
 * Requires: npm run dev (default http://localhost:3000)
 *
 *   FUNNEL_SIBLING_QA_BASE=http://localhost:3000 node scripts/funnel-sibling-qa.mjs
 */

import { chromium, devices } from "playwright";

const BASE = process.env.FUNNEL_SIBLING_QA_BASE ?? "http://localhost:3000";
const TIMEOUT = 20_000;

const failures = [];
const passes = [];
const pageErrors = [];

function fail(id, msg) {
  failures.push({ id, msg });
  console.error(`  ✗ ${id}: ${msg}`);
}

function pass(id, detail = "ok") {
  passes.push(id);
  console.log(`  ✓ ${id}: ${detail}`);
}

async function waitFunnel(page) {
  await page.waitForSelector(".qf-page", { timeout: TIMEOUT });
  await page.locator("text=Loading…").waitFor({ state: "detached", timeout: 3000 }).catch(() => {});
  await page.waitForTimeout(250);
}

async function clearStorage(page, keys, startUrl) {
  await page.goto(startUrl, { waitUntil: "domcontentloaded" });
  await page.evaluate((storageKeys) => {
    for (const k of storageKeys.local) localStorage.removeItem(k);
    for (const k of storageKeys.session) sessionStorage.removeItem(k);
    document.cookie = `${storageKeys.cookie}=; Path=/; Max-Age=0; SameSite=Lax`;
  }, keys);
}

async function assertDesktopColumn(page, id) {
  const box = await page.locator(".qf-funnel-column").first().boundingBox();
  if (!box) {
    fail(id, "no .qf-funnel-column bounding box");
    return;
  }
  const viewport = page.viewportSize();
  if (!viewport) return;
  const maxExpected = Math.min(viewport.width * 0.92, 520);
  if (box.width > maxExpected) {
    fail(id, `column too wide (${Math.round(box.width)}px > ${Math.round(maxExpected)}px)`);
    return;
  }
  pass(id, `${Math.round(box.width)}px column on ${viewport.width}px viewport`);
}

async function assertEntryShellLifecycle(page, shellId, id) {
  const shell = page.locator(`#${shellId}`);
  if ((await shell.count()) === 0) {
    fail(`${id}-ssr-present`, `missing #${shellId} before hydration`);
    return;
  }
  pass(`${id}-ssr-present`, `#${shellId} in DOM`);

  await waitFunnel(page);
  await page.waitForSelector(`#${shellId}.funnel-entry-ssr--dismissed`, {
    state: "attached",
    timeout: TIMEOUT,
  });
  pass(`${id}-ssr-dismiss`, `hid #${shellId} after runner mount`);
}

async function tapFirstOption(page) {
  await page.locator(".qf-opt >> visible=true").first().click();
  await page.waitForTimeout(300);
}

async function testPlanA(page) {
  console.log("\n— Plan A (/plan) —");
  await page.setViewportSize({ width: 1280, height: 800 });
  await clearStorage(page, {
    local: ["qf_answers", "qf_last_step", "qf_updated_at"],
    session: ["illuminairy_quiz_session_started"],
    cookie: "qf_snapshot",
  }, `${BASE}/plan?step=q1-parent-child`);
  await page.reload({ waitUntil: "domcontentloaded" });

  await assertEntryShellLifecycle(page, "plan-a-entry-ssr", "plan-a");
  await assertDesktopColumn(page, "plan-a-desktop-column");

  const beforeUrl = page.url();
  await tapFirstOption(page);
  await page.waitForURL(/step=q-score-lower/, { timeout: TIMEOUT });
  pass("plan-a-step1-advance", page.url());

  const errorBoundary = page.locator("text=Something went wrong");
  if ((await errorBoundary.count()) > 0) {
    fail("plan-a-no-error-boundary", "error boundary visible after step 1 tap");
  } else {
    pass("plan-a-no-error-boundary", "clean transition");
  }

  if (beforeUrl === page.url()) {
    fail("plan-a-url-changed", "URL did not advance");
  }
}

async function testPlanB(page) {
  console.log("\n— Plan B (/plan-b) —");
  await page.setViewportSize({ width: 1280, height: 800 });
  await clearStorage(page, {
    local: ["qfb_answers", "qfb_last_step", "qfb_updated_at"],
    session: ["illuminairy_qfb_session_started"],
    cookie: "qfb_snapshot",
  }, `${BASE}/plan-b?step=q1-parent-child&pb=b`);
  await page.reload({ waitUntil: "domcontentloaded" });

  await assertEntryShellLifecycle(page, "plan-b-entry-ssr", "plan-b");
  await assertDesktopColumn(page, "plan-b-desktop-column");

  await tapFirstOption(page);
  await page.waitForURL(/step=q-grade/, { timeout: TIMEOUT });
  pass("plan-b-step1-advance", page.url());

  const opts = page.locator(".qf-opt");
  const count = await opts.count();
  if (count < 2) fail("plan-b-grade-options", `only ${count} options on grade step`);
  else pass("plan-b-grade-options", `${count} grade options visible`);

  const fullBleed = await page.evaluate(() => {
    const col = document.querySelector(".qf-funnel-column");
    if (!col) return false;
    return col.getBoundingClientRect().width >= window.innerWidth * 0.98;
  });
  if (fullBleed) fail("plan-b-not-full-bleed", "column spans full viewport width");
  else pass("plan-b-not-full-bleed", "desktop column constrained");
}

async function testScoreReview(page) {
  console.log("\n— Score Review (/score-review) —");
  await page.setViewportSize({ width: 390, height: 844 });
  await clearStorage(page, {
    local: ["qsr_snapshot"],
    session: [],
    cookie: "",
  }, `${BASE}/score-review`);
  await page.reload({ waitUntil: "domcontentloaded" });

  const res = await page.goto(`${BASE}/score-review`, { waitUntil: "domcontentloaded" });
  if (!res || !res.ok()) {
    fail("score-review-http", `HTTP ${res?.status() ?? "unknown"}`);
    return;
  }
  pass("score-review-http", `HTTP ${res.status()}`);

  await assertEntryShellLifecycle(page, "score-review-entry-ssr", "score-review");

  const loading = page.locator("text=Loading…");
  if ((await loading.count()) > 0) {
    fail("score-review-no-loading", "Loading gate still visible");
  } else {
    pass("score-review-no-loading", "no loading gate");
  }

  await tapFirstOption(page);
  await page.waitForURL(/step=sr-recent-score/, { timeout: TIMEOUT });
  pass("score-review-step1-advance", page.url());
}

async function testAdLpHandoff(page) {
  console.log("\n— Ad3 LP → Plan B —");
  await page.setViewportSize({ width: 390, height: 844 });
  const lp =
    "/sat-plan-builder?utm_source=meta&utm_medium=paid_social&utm_campaign=c1_sat_plan_builder_cold_creative_test&utm_content=ad3_before_tutoring_hd1080&utm_term=broad_moms_35_58&hook=tutor&version=hd1080&pb=b";
  await page.goto(`${BASE}${lp}`, { waitUntil: "domcontentloaded" });

  const link = page.getByRole("link", { name: /Build my child|Claim my child/i }).first();
  const button = page.getByRole("button", { name: /Build my child|Claim my child/i }).first();
  if ((await link.count()) > 0) {
    const href = await link.getAttribute("href");
    if (!href?.includes("/plan-b")) fail("ad3-cta-href", `unexpected href: ${href}`);
    else pass("ad3-cta-link", href);
  } else if ((await button.count()) > 0) {
    pass("ad3-cta-button", "button CTA present");
  } else {
    fail("ad3-cta", "no LP CTA found");
  }
}

async function main() {
  console.log(`Funnel sibling QA → ${BASE}\n`);

  try {
    const health = await fetch(`${BASE}/plan?step=q1-parent-child`);
    if (!health.ok) throw new Error(`HTTP ${health.status}`);
  } catch (e) {
    console.error(`Cannot reach ${BASE}: ${e.message}`);
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices["iPhone 13"], reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("pageerror", (err) => pageErrors.push(err.message));

  await testPlanA(page);
  await testPlanB(page);
  await testScoreReview(page);
  await testAdLpHandoff(page);

  await browser.close();

  console.log(`\n${passes.length} passed, ${failures.length} failed`);
  if (pageErrors.length) {
    console.log("\nPage errors:");
    for (const e of pageErrors) console.log(`  ⚠ ${e}`);
  }
  if (failures.length || pageErrors.length) process.exit(1);
  console.log("\nFunnel sibling QA greenlight.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
