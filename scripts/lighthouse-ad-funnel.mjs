#!/usr/bin/env node
/**
 * Mobile Lighthouse smoke — cold traffic landing pages + Plan B funnel entry.
 *
 *   npm run perf:cold-funnel
 *   LIGHTHOUSE_BASE=https://illuminairy.com npm run perf:cold-funnel
 *
 * Optional scope (comma-separated ids or surface):
 *   LIGHTHOUSE_SCOPE=landing-ad3,funnel-plan-b-entry npm run perf:cold-funnel
 *   LIGHTHOUSE_SCOPE=landing npm run perf:cold-funnel   # all landing-* targets
 *   LIGHTHOUSE_SCOPE=funnel npm run perf:cold-funnel    # all funnel-* targets
 *
 * See growth/cold-funnel-perf.md
 */

import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.LIGHTHOUSE_BASE ?? "https://illuminairy.com";
const OUT_DIR = join(process.cwd(), "exports", "lighthouse-ad-funnel");

/** @type {const} */
const SURFACES = {
  LANDING: "landing",
  FUNNEL: "funnel",
};

const TARGETS = [
  {
    id: "landing-ad3",
    surface: SURFACES.LANDING,
    label: "Ad LP (sat-plan-builder, ad3 tutor hook)",
    path: "/sat-plan-builder?utm_source=meta&utm_medium=paid_social&utm_campaign=c1_sat_plan_builder_cold_creative_test&utm_content=ad3_before_tutoring_hd1080&utm_term=broad_moms_35_58&hook=tutor&version=hd1080&pb=b",
    perfMin: 85,
    lcpMaxMs: 2500,
    lcpHint: "Hero or trust (first HTML)",
  },
  {
    id: "funnel-plan-b-entry",
    surface: SURFACES.FUNNEL,
    label: "Plan B step 1 (q1-parent-child)",
    path: "/plan-b?step=q1-parent-child&pb=b",
    perfMin: 85,
    lcpMaxMs: 2500,
    lcpHint: "Who needs SAT help? (.qf-h1)",
  },
];

function resolveTargets() {
  const scope = process.env.LIGHTHOUSE_SCOPE?.trim();
  if (!scope) return TARGETS;

  const tokens = scope.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
  return TARGETS.filter((target) => {
    if (tokens.includes(target.id)) return true;
    if (tokens.includes(target.surface)) return true;
    if (tokens.includes("landing") && target.surface === SURFACES.LANDING) return true;
    if (tokens.includes("funnel") && target.surface === SURFACES.FUNNEL) return true;
    return false;
  });
}

function runLighthouse(url, outPath) {
  const result = spawnSync(
    "npx",
    [
      "lighthouse",
      url,
      "--only-categories=performance,best-practices",
      "--form-factor=mobile",
      "--screenEmulation.mobile=true",
      "--throttling-method=simulate",
      "--quiet",
      "--output=json",
      `--output-path=${outPath}`,
      "--chrome-flags=--headless --no-sandbox",
    ],
    { encoding: "utf8", stdio: "pipe" }
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || "lighthouse failed");
  }
}

function lcpElementLabel(report) {
  const insight = report.audits["lcp-breakdown-insight"];
  const nodeItem = insight?.details?.items?.find((item) => item.type === "node");
  if (nodeItem?.nodeLabel) return nodeItem.nodeLabel;
  if (nodeItem?.snippet) return nodeItem.snippet.replace(/<[^>]+>/g, "").trim();
  return "unknown";
}

/** Landing LCP must not be late-loaded footer/legal chrome. Hero or on-page trust copy is OK. */
function landingLcpElementOk(lcpElement) {
  const lower = lcpElement.toLowerCase();
  if (lower === "unknown") return true;
  if (lower.includes("privacy") || lower.includes("terms of service")) return false;
  return true;
}

function funnelLcpElementOk(lcpElement) {
  return lcpElement.toLowerCase().includes("who needs sat help");
}

function lcpElementOk(target, lcpElement) {
  if (target.surface === SURFACES.LANDING) return landingLcpElementOk(lcpElement);
  if (target.surface === SURFACES.FUNNEL) return funnelLcpElementOk(lcpElement);
  return true;
}

function parseReport(jsonPath) {
  const report = JSON.parse(readFileSync(jsonPath, "utf8"));
  const perf = Math.round((report.categories.performance?.score ?? 0) * 100);
  const bp = Math.round((report.categories["best-practices"]?.score ?? 0) * 100);
  const lcpAudit = report.audits["largest-contentful-paint"];
  const lcpMs = lcpAudit?.numericValue ?? 0;
  const fcpMs = report.audits["first-contentful-paint"]?.numericValue ?? 0;
  const tbtMs = report.audits["total-blocking-time"]?.numericValue ?? 0;
  const cls = report.audits["cumulative-layout-shift"]?.numericValue ?? 0;
  const lcpElement = lcpElementLabel(report);
  return { perf, bp, lcpMs, fcpMs, tbtMs, cls, lcpElement };
}

function runTarget(target) {
  const url = `${BASE}${target.path}`;
  const jsonPath = join(OUT_DIR, `${target.id}.json`);
  console.log(`Running ${target.id} — ${target.label}`);
  runLighthouse(url, jsonPath);
  const metrics = parseReport(jsonPath);
  const perfOk = metrics.perf >= target.perfMin;
  const lcpOk = metrics.lcpMs <= target.lcpMaxMs;
  const lcpElementOkPass = lcpElementOk(target, metrics.lcpElement);
  const ok = perfOk && lcpOk && lcpElementOkPass;

  const lcpSec = (metrics.lcpMs / 1000).toFixed(2);
  const fcpSec = (metrics.fcpMs / 1000).toFixed(2);
  console.log(
    `  Performance ${metrics.perf} (min ${target.perfMin}) · LCP ${lcpSec}s (max ${(target.lcpMaxMs / 1000).toFixed(1)}s) · FCP ${fcpSec}s · TBT ${Math.round(metrics.tbtMs)}ms · BP ${metrics.bp}`
  );
  console.log(`  LCP element: ${metrics.lcpElement.slice(0, 72)}${metrics.lcpElement.length > 72 ? "…" : ""}`);
  const elementStatus = lcpElementOkPass ? "PASS" : "FAIL (wrong element)";
  console.log(`  Expected: ${target.lcpHint} · element ${elementStatus} · overall ${ok ? "PASS" : "FAIL"}\n`);

  return {
    id: target.id,
    surface: target.surface,
    label: target.label,
    url,
    ...metrics,
    lcpExpected: target.lcpHint,
    lcpElementOk: lcpElementOkPass,
    targets: { perfMin: target.perfMin, lcpMaxMs: target.lcpMaxMs },
    pass: ok,
  };
}

function main() {
  const targets = resolveTargets();
  if (targets.length === 0) {
    console.error("No Lighthouse targets matched LIGHTHOUSE_SCOPE.");
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Cold traffic Lighthouse → ${BASE}`);
  console.log(`Targets: ${targets.map((t) => t.id).join(", ")}\n`);

  const rows = [];
  let failed = 0;

  for (const surface of [SURFACES.LANDING, SURFACES.FUNNEL]) {
    const group = targets.filter((t) => t.surface === surface);
    if (group.length === 0) continue;

    const heading = surface === SURFACES.LANDING ? "Landing pages" : "Quiz funnel";
    console.log(`=== ${heading} ===\n`);

    for (const target of group) {
      const row = runTarget(target);
      rows.push(row);
      if (!row.pass) failed += 1;
    }
  }

  const landingRows = rows.filter((r) => r.surface === SURFACES.LANDING);
  const funnelRows = rows.filter((r) => r.surface === SURFACES.FUNNEL);

  writeFileSync(
    join(OUT_DIR, "report.json"),
    JSON.stringify(
      {
        base: BASE,
        measuredAt: new Date().toISOString(),
        summary: {
          landing: {
            pass: landingRows.length > 0 && landingRows.every((r) => r.pass),
            count: landingRows.length,
          },
          funnel: {
            pass: funnelRows.length > 0 && funnelRows.every((r) => r.pass),
            count: funnelRows.length,
          },
          allPass: failed === 0,
        },
        rows,
      },
      null,
      2
    )
  );

  console.log(`Report → ${join(OUT_DIR, "report.json")}`);
  console.log(`Checklist → growth/cold-funnel-perf.md`);

  if (landingRows.length > 0) {
    console.log(
      `\nLanding: ${landingRows.filter((r) => r.pass).length}/${landingRows.length} passed`
    );
  }
  if (funnelRows.length > 0) {
    console.log(`Funnel: ${funnelRows.filter((r) => r.pass).length}/${funnelRows.length} passed`);
  }

  if (failed > 0) {
    console.error(`\n${failed} URL(s) below targets.`);
    process.exit(1);
  }
  console.log("\nAll scoped Lighthouse targets met (landing + funnel).");
}

main();
