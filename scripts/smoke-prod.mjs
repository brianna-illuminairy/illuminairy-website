#!/usr/bin/env node
/**
 * Production smoke test — illuminairy.com
 * Usage: node scripts/smoke-prod.mjs
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

async function fetchOk(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = (await res.text()).slice(0, 200);
    throw new Error(`${res.status} ${url} — ${body}`);
  }
  return res;
}

async function main() {
  console.log(`Smoke test: ${BASE}\n`);
  let pass = 0;
  let fail = 0;

  const urls = [
    ["/", "Landing"],
    ["/quiz?step=q-who", "Plan Builder entry (q-who)"],
    ["/quiz?step=q1", "Plan Builder legacy q1 deep link"],
    ["/quiz?step=achievability", "Goal achievability (deep link)"],
    ["/?lp=b3a", "B3a landing variant"]
  ];

  for (const [path, label] of urls) {
    const ok = await check(label, async () => {
      const res = await fetch(`${BASE}${path}`, { redirect: "follow" });
      if (!res.ok) throw new Error(`${res.status}`);
      const html = await res.text();
      if (!html.includes("Illuminairy") && !html.includes("illuminairy")) {
        throw new Error("missing brand in HTML");
      }
    });
    if (ok) pass++;
    else fail++;
  }

  let shareId;
  let shareUrl;

  const apiOk = await check("POST /api/funnel/plan-share", async () => {
    const res = await fetch(`${BASE}/api/funnel/plan-share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: MIN_PLAN, studentLabel: null })
    });
    const data = await res.json();
    if (!res.ok || !data.shareId) {
      throw new Error(data.error ?? res.status);
    }
    shareId = data.shareId;
    shareUrl = data.url;
  });
  if (apiOk) pass++;
  else fail++;

  if (shareId) {
    const getOk = await check("GET /api/funnel/plan-share?id=", async () => {
      const res = await fetch(`${BASE}/api/funnel/plan-share?id=${shareId}`);
      const data = await res.json();
      if (!res.ok || !data.payload?.plan) throw new Error(data.error ?? res.status);
    });
    if (getOk) pass++;
    else fail++;

    const pageOk = await check("GET shared plan page", async () => {
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
    else fail++;

    const ctaOk = await check("Share CTA href includes utm_source=shared_plan", async () => {
      const res = await fetch(shareUrl, { redirect: "follow" });
      const html = await res.text();
      if (!html.includes("utm_source=shared_plan")) {
        throw new Error("UTM not in page HTML");
      }
    });
    if (ctaOk) pass++;
    else fail++;
  }

  const planRouteOk = await check("/plan rewrite (expect 200 or redirect to quiz)", async () => {
    const res = await fetch(`${BASE}/plan?step=q1`, { redirect: "manual" });
    if (res.status === 404) {
      throw new Error("/plan returns 404 — use /quiz in CTAs until rewrite fixed");
    }
    if (res.status >= 400 && res.status !== 307 && res.status !== 308) {
      throw new Error(`${res.status}`);
    }
  });
  if (planRouteOk) pass++;
  else fail++;

  console.log(`\n${pass} passed, ${fail} failed`);
  if (shareUrl) console.log(`Sample share: ${shareUrl}`);
  process.exit(fail > 0 ? 1 : 0);
}

main();
