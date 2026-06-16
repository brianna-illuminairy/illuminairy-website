#!/usr/bin/env node
/**
 * Smoke test for personalized /enroll/{slug} checkout analytics.
 *
 * Requires: npm run dev (or ENROLL_SMOKE_BASE=https://illuminairy.com)
 *
 * Usage:
 *   npm run enroll:analytics-smoke
 *   ENROLL_SMOKE_BASE=http://localhost:3000 npm run enroll:analytics-smoke
 */

import { chromium } from "playwright";

const BASE =
  process.env.ENROLL_SMOKE_BASE ??
  process.env.SMOKE_BASE_URL ??
  "http://localhost:3000";
const TIMEOUT = 45_000;

const PAGES = [
  {
    path: "/enroll/michelle-michaela",
    program: "standard_enroll",
    posthogView: "standard_enroll_page_viewed",
    slug: "michelle-michaela"
  },
  {
    path: "/enroll/monique-kylan",
    program: "standard_enroll",
    posthogView: "standard_enroll_page_viewed",
    slug: "monique-kylan"
  },
  {
    path: "/enroll/sohail-shermeen",
    program: "personalized_enroll",
    posthogView: "personalized_enroll_page_viewed",
    slug: "sohail-shermeen"
  }
];

function freshCounts() {
  return { ga: new Map(), posthog: new Map(), meta: new Map() };
}

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
      /* ignore */
    }
    return;
  }

  if (
    url.includes("/ia/e") ||
    url.includes("posthog.com/e") ||
    url.includes("/ia/batch")
  ) {
    try {
      const raw = req.postData() ?? "";
      if (!raw) return;
      let payload;
      try {
        payload = JSON.parse(raw);
      } catch {
        const dataParam = new URL(url).searchParams.get("data");
        if (dataParam) payload = JSON.parse(decodeURIComponent(dataParam));
      }
      if (!payload) return;
      const batch = payload.batch ?? [payload];
      for (const item of batch) {
        const name = item?.event;
        if (name) counts.posthog.set(name, (counts.posthog.get(name) ?? 0) + 1);
      }
    } catch {
      /* ignore */
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

function pass(msg) {
  console.log(`✓ ${msg}`);
  return true;
}

function fail(msg) {
  console.error(`✗ ${msg}`);
  return false;
}

async function gaEventCount(page, name) {
  return page.evaluate(
    (ev) => (window.__gaEvents ?? []).filter((x) => x === ev).length,
    name
  );
}

async function main() {
  console.log(`Enroll checkout analytics smoke → ${BASE}\n`);

  try {
    const health = await fetch(`${BASE}/enroll/michelle-michaela`, {
      signal: AbortSignal.timeout(15_000)
    });
    if (!health.ok && health.status !== 500) {
      throw new Error(`HTTP ${health.status}`);
    }
  } catch (e) {
    console.error(`Cannot reach ${BASE}: ${e.message}`);
    console.error("Start with: npm run dev");
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  await context.addInitScript(() => {
    window.__gaEvents = [];
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

  let ok = true;

  for (const spec of PAGES) {
    console.log(`— ${spec.path} —`);
    const counts = freshCounts();
    const page = await context.newPage();
    page.on("request", (req) => ingestRequest(req, counts));

    const res = await page.goto(`${BASE}${spec.path}`, {
      waitUntil: "domcontentloaded",
      timeout: TIMEOUT
    });
    if (!res || (res.status() >= 500)) {
      ok = false;
      fail(`${spec.path}: page returned ${res?.status() ?? "error"}`);
      await page.close();
      continue;
    }

    await page.waitForTimeout(2500);

    const phView = countOf(counts.posthog, spec.posthogView);
    const gaViewNet = countOf(counts.ga, "enroll_checkout_viewed");
    const gaViewHook = await gaEventCount(page, "enroll_checkout_viewed");
    const gaView = Math.max(gaViewNet, gaViewHook);
    const metaView = countOf(counts.meta, "ViewContent");

    if (phView >= 1) pass(`PostHog: ${spec.posthogView} (${phView})`);
    else {
      console.warn(
        `⚠ PostHog: missing ${spec.posthogView} (set NEXT_PUBLIC_POSTHOG_KEY locally?)`
      );
    }

    if (gaView >= 1) pass(`GA4: enroll_checkout_viewed (${gaView})`);
    else {
      ok = false;
      fail(`GA4: missing enroll_checkout_viewed on ${spec.path}`);
    }

    if (metaView >= 1) pass(`Meta: ViewContent (${metaView})`);
    else {
      console.warn(`⚠ Meta: no ViewContent on ${spec.path}`);
    }

    const payBtn = page.locator(".std-paybtn, .co-paybtn").first();
    if (await payBtn.count()) {
      await payBtn.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(800);
      const phClick =
        countOf(counts.posthog, "standard_enroll_payment_clicked") +
        countOf(counts.posthog, "personalized_enroll_payment_clicked");
      const gaClickNet = countOf(counts.ga, "begin_checkout");
      const gaClickHook = await gaEventCount(page, "begin_checkout");
      const gaClick = Math.max(gaClickNet, gaClickHook);
      if (phClick >= 1) pass(`PostHog: payment_clicked after CTA (${phClick})`);
      else console.warn("⚠ PostHog: no payment_clicked (form validation may block)");
      if (gaClick >= 1) pass(`GA4: begin_checkout after CTA (${gaClick})`);
      else console.warn("⚠ GA4: no begin_checkout (form validation may block)");
    }

    await page.close();
  }

  await browser.close();

  console.log("");
  if (ok) {
    console.log("Enroll checkout analytics smoke passed.\n");
    process.exit(0);
  }
  console.error("Enroll checkout analytics smoke failed.\n");
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
