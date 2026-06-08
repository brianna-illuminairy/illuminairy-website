#!/usr/bin/env node
/**
 * Plan Builder E2E — footer CTA on interstitials/forms; single-select uses option tap.
 * Requires a running server: npm run dev (or start after build).
 *
 * Usage:
 *   FUNNEL_E2E_BASE=http://localhost:3000 node scripts/quiz-funnel-e2e.mjs
 *   npm run funnel:e2e
 */

import { chromium, devices } from "playwright";
import { STEP_INTERACTION } from "../lib/quiz-funnel/step-interaction.mjs";

const BASE = process.env.FUNNEL_E2E_BASE ?? "http://localhost:3000";
const TIMEOUT = 15_000;

/** Parent path with SAT history — hits all base steps through plan reveal. */
const PARENT_SAT_ANSWERS = {
  qDoubts: ["burned-out"],
  q6: ["math"],
  q7: ["khan"],
  parentName: "",
  parentEmail: "",
  parentPhone: "",
  kidName: "Alex",
  confirmTcpa: false,
  planChoice: "full",
  qWho: "child",
  qScoreLower: "yes",
  q1: "score-low",
  q2: "merit",
  q3: "sat-1",
  q4: "1200-1300",
  q5: "oct3",
  q8: "1400",
  q9: "3.5-3.7",
};

const STEP_LABELS = {
  "q-who": "Who needs SAT help",
  "q-score-lower": "SAT score come back lower",
  q1: "feels most urgent",
  q2: "stakes",
  q3: "SAT once",
  "i-steps": "Sophia",
  q4: "most recent SAT score",
  "q-doubts": "heard from your child",
  q5: "next SAT",
  "hit-outcome-month-one": "first month",
  q6: "problem",
  q7: "tried so far",
  "hit-q7": "prep failure",
  "i-diag": "diagnosis",
  "i-compare": "compare",
  q9: "GPA",
  q8: "goal score",
  achievability: "Improvement Plan",
  name: "first name",
  i2: "Building",
  v1: "projection",
  s4: "handoff",
};

const failures = [];
const passes = [];

function fail(step, msg) {
  failures.push({ step, msg });
  console.error(`  ✗ ${step}: ${msg}`);
}

function pass(step, detail = "step chrome ok") {
  passes.push(step);
  console.log(`  ✓ ${step}: ${detail}`);
}

function stepMode(stepId) {
  return STEP_INTERACTION[stepId] ?? "explicit-cta";
}

async function waitForHydration(page) {
  await page.waitForSelector(".qf-page", { timeout: TIMEOUT });
  await page
    .locator("text=Loading your plan")
    .waitFor({ state: "detached", timeout: TIMEOUT })
    .catch(() => {});
  await page.waitForTimeout(150);
}

async function assertChromePinned(page, stepId, chrome) {
  const box = await chrome.boundingBox();
  if (!box) {
    fail(stepId, "step chrome has no layout box");
    return false;
  }
  const viewport = page.viewportSize();
  if (viewport) {
    const bottom = box.y + box.height;
    if (bottom > viewport.height + 2) {
      fail(stepId, `step chrome below viewport (bottom=${Math.round(bottom)}, vh=${viewport.height})`);
      return false;
    }
  }
  return true;
}

/** Explicit button CTA — only for modes that need a Continue (not auto-advance / option-tap). */
async function assertExplicitCta(page, stepId, { allowDisabled = true } = {}) {
  const chrome = page.locator('[role="region"][aria-label="Step actions"]');
  await chrome.waitFor({ state: "visible", timeout: TIMEOUT });

  if ((await page.locator(".qf-page--has-actions").count()) === 0) {
    fail(stepId, "missing .qf-page--has-actions on shell");
    return false;
  }

  const btn = chrome.locator("button.qf-btn").first();
  if ((await btn.count()) === 0) {
    fail(stepId, "expected step CTA button for this interaction mode");
    return false;
  }

  if (!(await btn.isVisible())) {
    fail(stepId, "CTA button not visible");
    return false;
  }

  const disabled = await btn.isDisabled();
  if (disabled && !allowDisabled) {
    fail(stepId, "CTA still disabled when it should be enabled");
    return false;
  }

  if (!(await assertChromePinned(page, stepId, chrome))) return false;

  pass(stepId, disabled ? "CTA visible (disabled until ready)" : "CTA visible and enabled");
  return true;
}

async function assertStepInteraction(page, stepId, opts = {}) {
  const mode = stepMode(stepId);

  if (mode === "option-tap") {
    await page.waitForSelector(".qf-opt", { timeout: TIMEOUT });
    const chrome = page.locator('[role="region"][aria-label="Step actions"]');
    if ((await chrome.count()) > 0) {
      await chrome.waitFor({ state: "visible", timeout: TIMEOUT });
      await assertChromePinned(page, stepId, chrome);
    }
    pass(stepId, "options visible (tap to advance)");
    return true;
  }

  if (mode === "auto-advance") {
    const chrome = page.locator('[role="region"][aria-label="Step actions"]');
    await chrome.waitFor({ state: "visible", timeout: TIMEOUT });
    const autoBar = chrome.locator(".qf-insight-hit__auto-footer");
    if ((await autoBar.count()) === 0) {
      fail(stepId, "auto-advance must use progress chrome, not invented CTA button");
      return false;
    }
    if (!(await assertChromePinned(page, stepId, chrome))) return false;
    pass(stepId, "auto-advance progress chrome visible");
    return true;
  }

  return assertExplicitCta(page, stepId, opts);
}

async function seedAnswers(page, answers) {
  await page.goto(`${BASE}/plan?step=q-who`, { waitUntil: "networkidle" });
  await page.evaluate((payload) => {
    localStorage.setItem("qf_answers", JSON.stringify(payload));
  }, answers);
}

async function openStep(page, stepId) {
  await page.goto(`${BASE}/plan?step=${encodeURIComponent(stepId)}`, {
    waitUntil: "networkidle",
  });
  await waitForHydration(page);
  const actual = new URL(page.url()).searchParams.get("step");
  if (actual !== stepId) {
    fail(stepId, `guard redirected to ${actual} (check seeded answers)`);
    return false;
  }
  return true;
}

async function checkStep(page, stepId, opts) {
  const ok = await openStep(page, stepId);
  if (!ok) return;
  await assertStepInteraction(page, stepId, opts);
}

async function checkAutoAdvanceNavigates(page) {
  console.log("\n— auto-advance insight (no invented CTA) —");
  await seedAnswers(page, {
    ...PARENT_SAT_ANSWERS,
    q3: "none",
    q4: "na",
    qDoubts: [],
  });
  const ok = await openStep(page, "hit-q3-none");
  if (!ok) return;

  const chrome = page.locator('[role="region"][aria-label="Step actions"]');
  const autoBar = chrome.locator(".qf-insight-hit__auto-footer");
  if ((await autoBar.count()) === 0) {
    fail("hit-q3-none-auto", "missing auto-advance progress chrome");
    return;
  }

  try {
    await page.waitForURL(/step=i-steps/, { timeout: 20_000 });
    pass("hit-q3-none-auto", "auto-advanced to i-steps without CTA tap");
  } catch {
    fail("hit-q3-none-auto", "did not auto-advance within timeout");
  }
}

async function checkIStepsFooterAfterScroll(page) {
  console.log("\n— i-steps tall content (CTA stays docked) —");
  await seedAnswers(page, PARENT_SAT_ANSWERS);
  const ok = await openStep(page, "i-steps");
  if (!ok) return;

  const footer = page.locator('[role="region"][aria-label="Step actions"]');
  await footer.waitFor({ state: "visible", timeout: TIMEOUT });

  const viewport = page.viewportSize();
  let box = await footer.boundingBox();
  if (!box || !viewport) {
    fail("i-steps-scroll", "footer not measurable");
    return;
  }
  if (box.y + box.height > viewport.height + 2) {
    fail("i-steps-scroll", `footer below viewport before scroll (bottom=${Math.round(box.y + box.height)}, vh=${viewport.height})`);
    return;
  }

  await page.evaluate(() => {
    const body = document.querySelector(".qf-body");
    if (body) body.scrollTop = body.scrollHeight;
  });
  await page.waitForTimeout(200);

  box = await footer.boundingBox();
  if (!box) {
    fail("i-steps-scroll", "footer lost after body scroll");
    return;
  }
  if (box.y + box.height > viewport.height + 2) {
    fail("i-steps-scroll", `footer clipped after scroll (bottom=${Math.round(box.y + box.height)})`);
    return;
  }

  const btn = footer.locator("button.qf-btn").first();
  if (!(await btn.isVisible())) {
    fail("i-steps-scroll", "Build their plan button not visible after scroll");
    return;
  }

  pass("i-steps-scroll", "CTA visible before and after max body scroll");
}

async function checkAchievabilityFooterAfterScroll(page) {
  console.log("\n— achievability tall content (body scrolls, CTA stays docked) —");
  await seedAnswers(page, PARENT_SAT_ANSWERS);
  const ok = await openStep(page, "achievability");
  if (!ok) return;

  const body = page.locator(".qf-body");
  const scrollHeight = await body.evaluate((el) => el.scrollHeight);
  const clientHeight = await body.evaluate((el) => el.clientHeight);
  if (scrollHeight <= clientHeight + 8) {
    fail("achievability-scroll", "body should scroll on achievability (content taller than viewport)");
    return;
  }

  const footer = page.locator('[role="region"][aria-label="Step actions"]');
  await footer.waitFor({ state: "visible", timeout: TIMEOUT });

  const viewport = page.viewportSize();
  let box = await footer.boundingBox();
  if (!box || !viewport) {
    fail("achievability-scroll", "footer not measurable");
    return;
  }
  if (box.y + box.height > viewport.height + 2) {
    fail("achievability-scroll", `footer below viewport before scroll (bottom=${Math.round(box.y + box.height)})`);
    return;
  }

  await body.evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });
  await page.waitForTimeout(200);

  box = await footer.boundingBox();
  if (!box) {
    fail("achievability-scroll", "footer lost after body scroll");
    return;
  }
  if (box.y + box.height > viewport.height + 2) {
    fail("achievability-scroll", `footer clipped after scroll (bottom=${Math.round(box.y + box.height)})`);
    return;
  }

  const insight = page.locator(".qf-goal-assess .qf-lead").last();
  if ((await insight.count()) > 0) {
    const inView = await insight.evaluate((el) => {
      const bodyEl = el.closest(".qf-body");
      if (!bodyEl) return false;
      const rect = el.getBoundingClientRect();
      const bodyRect = bodyEl.getBoundingClientRect();
      return rect.top >= bodyRect.top && rect.bottom <= bodyRect.bottom + 1;
    });
    if (!inView) {
      fail("achievability-scroll", "insight paragraph not reachable via body scroll");
      return;
    }
  }

  pass("achievability-scroll", "body scrolls; CTA docked; below-fold copy reachable");
}

async function checkCriticalScreens(page) {
  console.log("\n— Critical screens (paid-traffic paths) —");

  await seedAnswers(page, PARENT_SAT_ANSWERS);
  await checkStep(page, "i-steps");
  await checkStep(page, "q-doubts");
  await checkStep(page, "achievability");
  await checkStep(page, "v1");
  await checkStep(page, "i2");
}

async function checkAllRoutedSteps(page) {
  console.log("\n— All routed steps —");
  await seedAnswers(page, PARENT_SAT_ANSWERS);

  const steps = [
    "q-who",
    "q-score-lower",
    "q1",
    "q2",
    "q3",
    "i-steps",
    "q4",
    "q-doubts",
    "doubts-insight",
    "q5",
    "hit-outcome-month-one",
    "q6",
    "q7",
    "hit-q7",
    "i-diag",
    "i-compare",
    "q9",
    "q8",
    "achievability",
    "name",
    "i2",
    "v1",
    "s4",
  ];

  for (const stepId of steps) {
    const mode = stepMode(stepId);
    const needsEnabledCta = ["explicit-cta", "multi-continue", "form-continue"].includes(mode);
    await checkStep(page, stepId, {
      allowDisabled: !needsEnabledCta || ["q4", "q8", "name"].includes(stepId),
    });
  }

  // i2 compute: wait for animation CTA to enable
  await openStep(page, "i2");
  const footer = page.locator('[role="region"][aria-label="Step actions"] button.qf-btn');
  try {
    await footer.waitFor({ state: "visible", timeout: TIMEOUT });
    await page.waitForFunction(
      () => {
        const btn = document.querySelector('[aria-label="Step actions"] button.qf-btn');
        return btn && !btn.disabled;
      },
      { timeout: 20_000 }
    );
    pass("i2", "compute animation completes → CTA enables");
  } catch {
    fail("i2", "compute CTA never enabled after animation");
  }
}

async function checkNavigation(page) {
  console.log("\n— Forward navigation (option tap + CTA) —");
  await page.evaluate(() => localStorage.removeItem("qf_answers"));
  await page.goto(`${BASE}/plan?step=q-who`, { waitUntil: "networkidle" });
  await waitForHydration(page);

  await page.locator(".qf-opt").first().click();
  await page.waitForURL(/step=q-score-lower/, { timeout: TIMEOUT });
  pass("nav", "q-who option tap advances");

  await page.locator(".qf-opt").first().click();
  await page.waitForURL(/step=q1/, { timeout: TIMEOUT });
  pass("nav", "q-score-lower option tap advances");

  await seedAnswers(page, {
    ...PARENT_SAT_ANSWERS,
    q4: undefined,
  });
  await openStep(page, "q4");
  await page.locator(".qf-opt").nth(2).click();
  await page.waitForURL(/step=q-doubts/, { timeout: TIMEOUT });
  pass("nav", "q4 option tap advances");
}

async function checkUtmPreserved(page) {
  console.log("\n— UTM preservation —");
  await page.goto(
    `${BASE}/plan?step=q-who&utm_source=meta&utm_campaign=ad3&utm_content=concerned_mom`,
    { waitUntil: "networkidle" }
  );
  await page.locator(".qf-opt").first().click();
  await page.waitForURL(/utm_source=meta/, { timeout: TIMEOUT });
  const url = page.url();
  if (url.includes("utm_campaign=ad3") && url.includes("utm_content=concerned_mom")) {
    pass("utm", "UTMs preserved on step advance");
  } else {
    fail("utm", `UTMs dropped: ${url}`);
  }
}

async function main() {
  console.log(`Plan Builder E2E → ${BASE}`);
  console.log(`Viewport: iPhone 13 (mobile)\n`);

  let browser;
  try {
    const health = await fetch(`${BASE}/plan?step=q-who`);
    if (!health.ok) {
      console.error(`Server not reachable at ${BASE} (${health.status})`);
      console.error("Start with: npm run dev  OR  npm run build && npm run start");
      process.exit(1);
    }
  } catch (e) {
    console.error(`Cannot reach ${BASE}: ${e.message}`);
    console.error("Start with: npm run dev  OR  npm run build && npm run start");
    process.exit(1);
  }

  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...devices["iPhone 13"],
  });
  const page = await context.newPage();

  page.on("pageerror", (err) => {
    console.warn(`  ⚠ page error: ${err.message}`);
  });

  await checkCriticalScreens(page);
  await checkIStepsFooterAfterScroll(page);
  await checkAchievabilityFooterAfterScroll(page);
  await checkAutoAdvanceNavigates(page);
  await checkAllRoutedSteps(page);
  await checkNavigation(page);
  await checkUtmPreserved(page);

  await browser.close();

  console.log(`\n${passes.length} checks passed, ${failures.length} failed`);
  if (failures.length) {
    console.error("\nFailed:");
    for (const f of failures) console.error(`  ${f.step}: ${f.msg}`);
    process.exit(1);
  }
  console.log("\nPlan Builder E2E passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
