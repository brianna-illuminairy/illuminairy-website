#!/usr/bin/env node
/**
 * Mobile Lighthouse smoke for ad LP + Plan B entry.
 * Manual pre-scale gate — not wired into agent:verify (needs Chrome + network).
 *
 *   npm run lighthouse:ad-funnel
 *   LIGHTHOUSE_BASE=https://illuminairy.com npm run lighthouse:ad-funnel
 */

import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.LIGHTHOUSE_BASE ?? "https://illuminairy.com";
const OUT_DIR = join(process.cwd(), "exports", "lighthouse-ad-funnel");

const TARGETS = [
  {
    id: "sat-plan-builder",
    path: "/sat-plan-builder?utm_source=meta&utm_medium=paid_social&utm_campaign=c1_sat_plan_builder_cold_creative_test&utm_content=ad3_before_tutoring_hd1080&utm_term=broad_moms_35_58&hook=tutor&version=hd1080&pb=b",
    perfMin: 85,
    lcpMaxMs: 2500,
  },
  {
    id: "plan-b-entry",
    path: "/plan-b?step=q1-parent-child&pb=b",
    perfMin: 85,
    lcpMaxMs: 2500,
  },
];

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

function parseReport(jsonPath) {
  const report = JSON.parse(readFileSync(jsonPath, "utf8"));
  const perf = Math.round((report.categories.performance?.score ?? 0) * 100);
  const bp = Math.round((report.categories["best-practices"]?.score ?? 0) * 100);
  const lcpAudit = report.audits["largest-contentful-paint"];
  const lcpMs = lcpAudit?.numericValue ?? 0;
  const tbtMs = report.audits["total-blocking-time"]?.numericValue ?? 0;
  const cls = report.audits["cumulative-layout-shift"]?.numericValue ?? 0;
  return { perf, bp, lcpMs, tbtMs, cls };
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Lighthouse ad funnel → ${BASE}\n`);

  const rows = [];
  let failed = 0;

  for (const target of TARGETS) {
    const url = `${BASE}${target.path}`;
    const jsonPath = join(OUT_DIR, `${target.id}.json`);
    console.log(`Running ${target.id}…`);
    runLighthouse(url, jsonPath);
    const metrics = parseReport(jsonPath);
    const perfOk = metrics.perf >= target.perfMin;
    const lcpOk = metrics.lcpMs <= target.lcpMaxMs;
    const ok = perfOk && lcpOk;
    if (!ok) failed += 1;

    rows.push({
      id: target.id,
      url,
      ...metrics,
      targets: { perfMin: target.perfMin, lcpMaxMs: target.lcpMaxMs },
      pass: ok,
    });

    const lcpSec = (metrics.lcpMs / 1000).toFixed(1);
    console.log(
      `  Performance ${metrics.perf} (min ${target.perfMin}) · LCP ${lcpSec}s (max ${target.lcpMaxMs / 1000}s) · BP ${metrics.bp} · ${ok ? "PASS" : "FAIL"}`
    );
  }

  writeFileSync(join(OUT_DIR, "report.json"), JSON.stringify({ base: BASE, rows }, null, 2));

  console.log(`\nReport → ${join(OUT_DIR, "report.json")}`);
  if (failed > 0) {
    console.error(`\n${failed} URL(s) below targets. See growth/b3-lp-viewport-qa.md.`);
    process.exit(1);
  }
  console.log("\nAll ad-funnel Lighthouse targets met.");
}

main();
