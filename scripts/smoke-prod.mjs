#!/usr/bin/env node
/**
 * Production smoke — multi-surface (one Vercel deploy).
 * See docs/production-surfaces.md
 *
 * Usage: npm run smoke:prod
 *        SMOKE_BASE_URL=https://preview… npm run smoke:prod
 */
const BASE = process.env.SMOKE_BASE_URL ?? "https://illuminairy.com";

/** @type {{ surface: string, path: string, label: string, assert?: (html: string) => void }[]} */
const PAGE_CHECKS = [
  {
    surface: "marketing",
    path: "/",
    label: "Home",
    assert: (html) => {
      if (!html.includes("Illuminairy") && !html.includes("illuminairy")) {
        throw new Error("missing brand in HTML");
      }
    },
  },
  {
    surface: "marketing",
    path: "/?lp=b3a",
    label: "B3a landing variant",
    assert: (html) => {
      if (!html.includes("Illuminairy") && !html.includes("illuminairy")) {
        throw new Error("missing brand in HTML");
      }
    },
  },
  {
    surface: "plan-ads",
    path: "/sat-plan-builder",
    label: "SAT plan builder ad LP",
    assert: (html) => {
      if (!html.includes("Illuminairy") && !html.includes("illuminairy")) {
        throw new Error("missing brand");
      }
    },
  },
  {
    surface: "plan-builder",
    path: "/plan?step=q1-parent-child",
    label: "Plan Builder entry (q1-parent-child)",
    assert: (html) => {
      if (!html.includes("qf-page") && !html.includes("Who needs SAT help")) {
        throw new Error("missing Plan Builder shell");
      }
    },
  },
  {
    surface: "plan-builder",
    path: "/plan?step=q1",
    label: "Plan Builder legacy q1 deep link",
    assert: (html) => {
      if (!html.includes("qf-page")) throw new Error("missing Plan Builder shell");
    },
  },
  {
    surface: "plan-builder",
    path: "/plan?step=achievability",
    label: "Goal achievability (deep link)",
    assert: (html) => {
      if (!html.includes("qf-page")) throw new Error("missing Plan Builder shell");
    },
  },
  {
    surface: "satplan",
    path: "/satplan",
    label: "SAT plan funnel (/satplan)",
    assert: (html) => {
      if (!html.includes("satplan-funnel-root") && !html.includes("illuminairy")) {
        throw new Error("missing satplan funnel root");
      }
    },
  },
];

async function check(name, fn) {
  try {
    await fn();
    console.log(`✓ ${name}`);
    return true;
  } catch (e) {
    console.error(`✗ ${name}`);
    console.error(`  ${e.message}`);
    return false;
  }
}

async function main() {
  console.log(`Smoke test: ${BASE}`);
  console.log("(one deploy — marketing, Plan Builder, satplan)\n");

  let pass = 0;
  let fail = 0;
  const failedSurfaces = new Set();

  for (const { surface, path, label, assert } of PAGE_CHECKS) {
    const ok = await check(`${label} [${surface}]`, async () => {
      const res = await fetch(`${BASE}${path}`, { redirect: "follow" });
      if (!res.ok) throw new Error(`${res.status}`);
      const html = await res.text();
      assert?.(html);
    });
    if (ok) pass++;
    else {
      fail++;
      failedSurfaces.add(surface);
    }
  }

  const planRewriteOk = await check("/plan rewrite [plan-builder]", async () => {
    const res = await fetch(`${BASE}/plan?step=q1-parent-child`, { redirect: "manual" });
    if (res.status === 404) {
      throw new Error("/plan returns 404 — rewrite broken");
    }
    if (res.status >= 400 && res.status !== 307 && res.status !== 308) {
      throw new Error(`${res.status}`);
    }
  });
  if (planRewriteOk) pass++;
  else {
    fail++;
    failedSurfaces.add("plan-builder");
  }

  const shareRetiredOk = await check("Plan share retired (404) [plan-builder]", async () => {
    const res = await fetch(`${BASE}/plan/share/retired-smoke-check`, { redirect: "follow" });
    if (res.status !== 404) {
      throw new Error(`expected 404, got ${res.status}`);
    }
  });
  if (shareRetiredOk) pass++;
  else {
    fail++;
    failedSurfaces.add("plan-builder");
  }

  const shareApiRetiredOk = await check("Plan share API retired (404) [plan-builder]", async () => {
    const res = await fetch(`${BASE}/api/funnel/plan-share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (res.status !== 404) {
      throw new Error(`expected 404, got ${res.status}`);
    }
  });
  if (shareApiRetiredOk) pass++;
  else {
    fail++;
    failedSurfaces.add("plan-builder");
  }

  console.log(`\n${pass} passed, ${fail} failed`);
  if (failedSurfaces.size) {
    console.log(`Failed surfaces: ${[...failedSurfaces].join(", ")}`);
    console.log("See docs/production-surfaces.md");
  }
  process.exit(fail > 0 ? 1 : 0);
}

main();
