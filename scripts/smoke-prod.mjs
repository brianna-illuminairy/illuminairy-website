#!/usr/bin/env node
/**
 * Production smoke — multi-surface (one Vercel deploy).
 * See docs/production-surfaces.md
 *
 * Usage: npm run smoke:prod
 *        SMOKE_BASE_URL=https://preview… npm run smoke:prod
 */
const BASE = process.env.SMOKE_BASE_URL ?? "https://illuminairy.com";

const MIN_PLAN = {
  q2: "merit",
  achievability: {
    tier: "ambitious",
    tierIndex: 2,
    pointsLine: "+200 pts by Oct 3.",
    verdictLead: "Ambitious, but",
    verdictEm: "achievable",
    stakesLead: "A higher score could unlock thousands of dollars in merit scholarships.",
    outcomesMeta: "Based on outcomes from 1,500+ similar students.",
    prepFailureClause: null,
    skillSubject: null,
    skillDetail: "The Skill Diagnostic finds the handful of skills worth the most points — usually 5–6, not the whole test.",
    hitRatePct: 78,
    hitRateBefore: "of students who follow their Illuminairy plan ",
    hitRateEmphasis: "reach their score goal",
    hitRateAfter: "",
    varyDisclaimer: "Results vary.",
  },
  subhead: "Smoke test plan",
  projectionVerdict: "Illustrative projection.",
  topLevers: [{ rank: 1, name: "Linear equations" }],
  heardSummary: "Smoke",
  projectionHeadline: "Score projection",
  metrics: {
    start: { value: "1200", qualifier: "" },
    target: { value: "1400", qualifier: "" },
    gainRange: "+80–120",
    weeks: "12 weeks",
    effort: "~5–7 hrs/week"
  },
  inputGroups: [],
  leversNote: "Examples only.",
  whyLastTimeFailed: "Breadth.",
  howThisTimeDifferent: "Focus.",
  honestyLines: [],
  parentVisibility: [],
  nextSteps: [{ title: "SAT Strategy Call", detail: "15 min" }]
};

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
    path: "/quiz?step=q-who",
    label: "Plan Builder entry (q-who)",
    assert: (html) => {
      if (!html.includes("qf-page") && !html.includes("Who needs SAT help")) {
        throw new Error("missing Plan Builder shell");
      }
    },
  },
  {
    surface: "plan-builder",
    path: "/quiz?step=q1",
    label: "Plan Builder legacy q1 deep link",
    assert: (html) => {
      if (!html.includes("qf-page")) throw new Error("missing Plan Builder shell");
    },
  },
  {
    surface: "plan-builder",
    path: "/quiz?step=achievability",
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
  console.log("(one deploy — marketing, Plan Builder, satplan, share API)\n");

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
    const res = await fetch(`${BASE}/plan?step=q-who`, { redirect: "manual" });
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

  let shareId;
  let shareUrl;

  const apiOk = await check("POST /api/funnel/plan-share [share]", async () => {
    const res = await fetch(`${BASE}/api/funnel/plan-share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: MIN_PLAN, studentLabel: null }),
    });
    const data = await res.json();
    if (!res.ok || !data.shareId) {
      throw new Error(data.error ?? res.status);
    }
    shareId = data.shareId;
    shareUrl = data.url;
  });
  if (apiOk) pass++;
  else failedSurfaces.add("share");

  if (shareId) {
    const getOk = await check("GET /api/funnel/plan-share?id= [share]", async () => {
      const res = await fetch(`${BASE}/api/funnel/plan-share?id=${shareId}`);
      const data = await res.json();
      if (!res.ok || !data.payload?.plan) throw new Error(data.error ?? res.status);
    });
    if (getOk) pass++;
    else {
      fail++;
      failedSurfaces.add("share");
    }

    const pageOk = await check("GET shared plan page [share]", async () => {
      const res = await fetch(shareUrl, { redirect: "follow" });
      if (!res.ok) throw new Error(`${res.status}`);
      const html = await res.text();
      if (!html.includes("Improvement Plan")) {
        throw new Error("missing Improvement Plan copy");
      }
      if (!html.includes("Build your child")) {
        throw new Error("missing share CTA");
      }
    });
    if (pageOk) pass++;
    else {
      fail++;
      failedSurfaces.add("share");
    }

    const ctaOk = await check("Share CTA utm_source=shared_plan [share]", async () => {
      const res = await fetch(shareUrl, { redirect: "follow" });
      const html = await res.text();
      if (!html.includes("utm_source=shared_plan")) {
        throw new Error("UTM not in page HTML");
      }
    });
    if (ctaOk) pass++;
    else {
      fail++;
      failedSurfaces.add("share");
    }
  }

  console.log(`\n${pass} passed, ${fail} failed`);
  if (failedSurfaces.size) {
    console.log(`Failed surfaces: ${[...failedSurfaces].join(", ")}`);
    console.log("See docs/production-surfaces.md");
  }
  if (shareUrl) console.log(`Sample share: ${shareUrl}`);
  process.exit(fail > 0 ? 1 : 0);
}

main();
