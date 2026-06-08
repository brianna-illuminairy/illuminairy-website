#!/usr/bin/env node
/**
 * Plan Builder + LP analytics smoke — catches double-fires and missing labels.
 *
 * Requires: npm run dev (or SMOKE_BASE=http://localhost:3000)
 *
 * Usage:
 *   npm run funnel:analytics-smoke
 *   FUNNEL_E2E_BASE=https://illuminairy.com npm run funnel:analytics-smoke
 *
 * Manual follow-up (cannot automate): Meta Events Manager Test Events, GA4 DebugView.
 */

import { chromium, devices } from "playwright";

const BASE = process.env.FUNNEL_E2E_BASE ?? process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const TIMEOUT = 20_000;

const LP_URL =
  `${BASE}/sat-plan-builder?utm_source=meta&utm_medium=paid_social` +
  `&utm_campaign=analytics_smoke&utm_content=ad5_high_gpa_student_story&hook=student_story`;

/** @typedef {{ ga: Map<string, number>, posthog: Map<string, number>, meta: Map<string, number> }} EventCounts */

/** @returns {EventCounts} */
function freshCounts() {
  return { ga: new Map(), posthog: new Map(), meta: new Map() };
}

/** @param {import('playwright').Request} req */
function ingestRequest(req, counts) {
  const url = req.url();

  if (url.includes("google-analytics.com/g/collect")) {
    try {
      const u = new URL(url);
      let name = u.searchParams.get("en");
      if (!name && req.method() === "POST") {
        const body = req.postData() ?? "";
        const match = body.match(/(?:^|&)en=([^&]+)/);
        if (match) name = decodeURIComponent(match[1].replace(/\+/g, " "));
      }
      if (name) counts.ga.set(name, (counts.ga.get(name) ?? 0) + 1);
    } catch {
      /* ignore malformed */
    }
    return;
  }

  if (url.includes("/ia/e") || url.includes("posthog.com/e") || url.includes("/ia/batch")) {
    try {
      const raw = req.postData() ?? "";
      if (!raw) return;
      /** @type {unknown} */
      let payload;
      try {
        payload = JSON.parse(raw);
      } catch {
        const dataParam = new URL(url).searchParams.get("data");
        if (dataParam) payload = JSON.parse(decodeURIComponent(dataParam));
      }
      if (!payload) return;
      const batch = /** @type {{ batch?: { event?: string }[]; event?: string }} */ (payload).batch ?? [payload];
      for (const item of batch) {
        const name = /** @type {{ event?: string }} */ (item)?.event;
        if (name) counts.posthog.set(name, (counts.posthog.get(name) ?? 0) + 1);
      }
    } catch {
      /* beacon may be compressed */
    }
    return;
  }

  if (url.includes("facebook.com/tr") || url.includes("facebook.net/tr")) {
    try {
      const u = new URL(url);
      const ev = u.searchParams.get("ev") ?? "PageView";
      counts.meta.set(ev, (counts.meta.get(ev) ?? 0) + 1);
    } catch {
      /* ignore */
    }
  }
}

function countOf(map, name) {
  return map.get(name) ?? 0;
}

/** @param {import('playwright').Page} page */
async function gaEventCount(page, name) {
  return page.evaluate((ev) => (window.__gaEvents ?? []).filter((x) => x === ev).length, name);
}

function fail(msg) {
  console.error(`✗ ${msg}`);
  return false;
}

function pass(msg) {
  console.log(`✓ ${msg}`);
  return true;
}

/** @param {EventCounts} counts */
function assertOnce(counts, channel, event, label) {
  const map = counts[channel];
  const n = countOf(map, event);
  if (n === 1) return pass(`${label}: exactly 1× ${event}`);
  if (n === 0) return fail(`${label}: missing ${event} (0 fires)`);
  return fail(`${label}: double-count ${event} (${n} fires)`);
}

/** @param {EventCounts} counts */
function assertAtLeast(counts, channel, event, min, label) {
  const n = countOf(counts[channel], event);
  if (n >= min) return pass(`${label}: ${event} ≥ ${min} (${n})`);
  return fail(`${label}: expected ${event} ≥ ${min}, got ${n}`);
}

/** @param {EventCounts} counts */
function assertMax(counts, channel, event, max, label) {
  const n = countOf(counts[channel], event);
  if (n <= max) return pass(`${label}: ${event} ≤ ${max} (${n})`);
  return fail(`${label}: ${event} over-count (${n} > ${max})`);
}

async function waitForNetworkIdle(page, ms = 1500) {
  await page.waitForTimeout(ms);
}

async function main() {
  console.log(`Analytics smoke → ${BASE}\n`);

  try {
    const health = await fetch(`${BASE}/plan?step=q1-parent-child`, { signal: AbortSignal.timeout(8000) });
    if (!health.ok) throw new Error(`HTTP ${health.status}`);
  } catch (e) {
    console.error(`Cannot reach ${BASE}: ${e.message}`);
    console.error("Start with: npm run dev");
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices["iPhone 13"] });

  await context.addInitScript(() => {
    window.__gaEvents = [];
    window.__phEvents = [];
    const poll = window.setInterval(() => {
      if (typeof window.gtag === "function" && !window.gtag.__hooked) {
        const orig = window.gtag;
        const wrapped = function (...args) {
          if (args[0] === "event" && typeof args[1] === "string") {
            window.__gaEvents.push(args[1]);
          }
          return orig.apply(this, args);
        };
        wrapped.__hooked = true;
        window.gtag = wrapped;
        window.clearInterval(poll);
      }
    }, 50);
    window.setTimeout(() => window.clearInterval(poll), 10_000);
  });

  const page = await context.newPage();

  let ok = true;
  let posthogActive = false;
  const check = (cond, msg) => {
    if (!cond) ok = false;
    return cond;
  };

  console.log("— LP load (ad5 message-match) —");
  const lpCounts = freshCounts();
  page.on("request", (req) => ingestRequest(req, lpCounts));

  await page.goto(LP_URL, { waitUntil: "networkidle", timeout: TIMEOUT });
  await waitForNetworkIdle(page, 2500);

  const lpPh = countOf(lpCounts.posthog, "funnel_landing_view");
  const lpGaNet = countOf(lpCounts.ga, "funnel_landing_view");
  const lpGaHook = await gaEventCount(page, "funnel_landing_view");
  const lpGa = Math.max(lpGaNet, lpGaHook);

  if (lpPh >= 1) posthogActive = true;
  if (lpPh === 1) pass("PostHog LP: exactly 1× funnel_landing_view");
  else if (lpPh === 0) {
    console.warn("⚠ PostHog LP: no funnel_landing_view (run against prod or set NEXT_PUBLIC_POSTHOG_KEY)");
  } else {
    ok = false;
    fail(`PostHog LP: double-count funnel_landing_view (${lpPh})`);
  }

  if (lpGa === 1) pass("GA4 LP: exactly 1× funnel_landing_view");
  else if (lpGa === 0) {
    ok = false;
    fail("GA4 LP: missing funnel_landing_view");
  } else {
    ok = false;
    fail(`GA4 LP: double-count funnel_landing_view (${lpGa})`);
  }
  check(assertAtLeast(lpCounts, "meta", "PageView", 1, "Meta LP"), "");
  check(assertAtLeast(lpCounts, "meta", "ViewContent", 1, "Meta LP ViewContent"), "");
  check(
    assertMax(lpCounts, "meta", "PageView", 2, "Meta PageView (init + route)"),
    ""
  );

  const lpVariant = await page.evaluate(() => localStorage.getItem("lp_variant"));
  if (lpVariant === "variant-highgpa-ap-lowsat") {
    pass(`localStorage lp_variant = ${lpVariant}`);
  } else {
    ok = false;
    fail(`lp_variant expected variant-highgpa-ap-lowsat, got ${lpVariant}`);
  }

  console.log("\n— LP CTA → plan —");
  const ctaCounts = freshCounts();
  page.removeAllListeners("request");
  page.on("request", (req) => ingestRequest(req, ctaCounts));

  const cta = page.locator("a, button").filter({ hasText: /free|plan|start|see/i }).first();
  await cta.click({ timeout: TIMEOUT });
  await page.waitForURL(/\/plan\?/, { timeout: TIMEOUT });
  await waitForNetworkIdle(page);

  check(assertAtLeast(ctaCounts, "meta", "FunnelCTA", 1, "Meta FunnelCTA"), "");

  const ctaGaHook = await gaEventCount(page, "funnel_cta_click");
  const ctaPh = countOf(ctaCounts.posthog, "funnel_cta_click");
  const ctaGa = Math.max(countOf(ctaCounts.ga, "funnel_cta_click"), ctaGaHook);
  if (ctaPh >= 1) posthogActive = true;
  if (ctaPh === 1) pass("PostHog CTA: exactly 1× funnel_cta_click");
  else if (ctaPh === 0 && !posthogActive) console.warn("⚠ PostHog CTA: skipped (PostHog inactive)");
  else if (ctaPh === 0) { ok = false; fail("PostHog CTA: missing funnel_cta_click"); }
  else { ok = false; fail(`PostHog CTA double-count (${ctaPh})`); }
  if (ctaGa >= 1) pass(`GA4 CTA: funnel_cta_click (${ctaGa})`);
  else { ok = false; fail("GA4 CTA: missing funnel_cta_click"); }

  const planUrl = page.url();
  if (planUrl.includes("utm_source=meta") && planUrl.includes("utm_content=ad5")) {
    pass("UTMs preserved on /plan");
  } else {
    ok = false;
    fail(`UTMs missing on plan URL: ${planUrl}`);
  }

  console.log("\n— q1-parent-child (session + step events) —");
  await waitForNetworkIdle(page, 2000);

  const stepCounts = freshCounts();
  page.removeAllListeners("request");
  page.on("request", (req) => ingestRequest(req, stepCounts));

  // Reload entry step to measure step fires without CTA noise
  await page.goto(`${planUrl.split("?")[0]}?${new URL(planUrl).searchParams.toString()}`, {
    waitUntil: "networkidle",
    timeout: TIMEOUT,
  });
  await waitForNetworkIdle(page, 2000);

  check(assertMax(stepCounts, "posthog", "$pageview", 0, "PostHog /plan $pageview suppressed"), "");

  const stepGaHook = await gaEventCount(page, "quiz_step_view");
  const stepPh = countOf(stepCounts.posthog, "quiz_step_viewed");
  const stepGa = Math.max(countOf(stepCounts.ga, "quiz_step_view"), stepGaHook);
  if (stepPh >= 1) posthogActive = true;
  if (stepPh >= 1) pass(`PostHog step: quiz_step_viewed (${stepPh})`);
  else if (!posthogActive) console.warn("⚠ PostHog step: skipped (PostHog inactive)");
  else { ok = false; fail("PostHog step: missing quiz_step_viewed"); }
  if (stepGa >= 1) pass(`GA4 step: quiz_step_view (${stepGa})`);
  else { ok = false; fail("GA4 step: missing quiz_step_view"); }

  console.log("\n— parent_confirmed (once per session) —");
  const childBtn = page.getByRole("button", { name: /my child|child/i }).first();
  if ((await childBtn.count()) === 0) {
    ok = false;
    fail("q1-parent-child: My child option not found");
  } else {
    const pcCounts = freshCounts();
    page.removeAllListeners("request");
    page.on("request", (req) => ingestRequest(req, pcCounts));

    await childBtn.click();
    await waitForNetworkIdle(page, 2000);

    const pcGaHook = await gaEventCount(page, "parent_confirmed");
    const pcPh = countOf(pcCounts.posthog, "parent_confirmed");
    const pcGa = Math.max(countOf(pcCounts.ga, "parent_confirmed"), pcGaHook);
    if (pcPh >= 1) posthogActive = true;
    if (pcPh === 1) pass("PostHog parent_confirmed: exactly 1×");
    else if (pcPh === 0 && !posthogActive) console.warn("⚠ PostHog parent_confirmed: skipped (PostHog inactive)");
    else if (pcPh === 0) { ok = false; fail("PostHog parent_confirmed: missing"); }
    else { ok = false; fail(`PostHog parent_confirmed double (${pcPh})`); }
    if (pcGa === 1) pass("GA4 parent_confirmed: exactly 1×");
    else if (pcGa === 0) { ok = false; fail("GA4 parent_confirmed: missing"); }
    else { ok = false; fail(`GA4 parent_confirmed double (${pcGa})`); }
    check(assertAtLeast(pcCounts, "meta", "ParentConfirmed", 1, "Meta ParentConfirmed"), "");

    // Second click must not re-fire (session dedupe)
    page.removeAllListeners("request");
    page.on("request", (req) => ingestRequest(req, pcCounts));
    const back = page.locator('[aria-label="Back"]').first();
    if ((await back.count()) > 0) {
      await back.click();
      await waitForNetworkIdle(page, 800);
      await childBtn.click();
      await waitForNetworkIdle(page, 1500);
      check(
        posthogActive
          ? assertMax(pcCounts, "posthog", "parent_confirmed", 1, "PostHog parent_confirmed dedupe")
          : true,
        ""
      );
      check(assertMax(pcCounts, "meta", "ParentConfirmed", 1, "Meta ParentConfirmed dedupe"), "");
    }
  }

  console.log("\n— Summary —");
  console.log("Run against prod with PostHog key for full PostHog assertions.");

  console.log("\nManual sign-off still required:");
  console.log("  • GA4 DebugView — param labels (sat_lp_variant, lp_variant, utm_*)");
  console.log("  • Meta Test Events — Lead/Schedule event_id dedupe with CAPI (s5 book path)");
  console.log("  • PostHog Live Events — property breakdown on funnel_landing_view");

  await browser.close();
  process.exit(ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
