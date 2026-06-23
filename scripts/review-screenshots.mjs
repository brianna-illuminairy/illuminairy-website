#!/usr/bin/env node
/**
 * Review screenshots — Plan B funnel + portal (mobile iPhone 13).
 * Requires: npm run dev
 *
 *   FUNNEL_B_E2E_BASE=http://localhost:3003 node scripts/review-screenshots.mjs
 */

import { createHmac } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "playwright";
import { createClient } from "@supabase/supabase-js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");

function loadEnvFile() {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let val = trimmed.slice(eq + 1);
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvFile();

const BASE = process.env.FUNNEL_B_E2E_BASE ?? "http://localhost:3000";
const SHOT_DIR = join(root, "exports", "review-screenshots");
const TIMEOUT = 30_000;

const SEED = {
  qWho: "parent",
  qGrade: "11",
  qScoreLower: "yes",
  q1: "aug2026",
  q2: "1400",
  q3: "khan",
  q4: "yes",
  q5: "aug2026",
  q6: ["time"],
  q8: "1400",
  q9: "3.8",
  qSchoolReferral: "no",
  parentEmail: "testemil@gmail.com",
  parentZip: "30301",
  parentName: "QA Parent",
  parentPhone: "+14045551212",
  targetSchoolIds: ["ga-emory-university"],
  targetRegionId: "ga",
  regionalDiscountCode: "partner-college2",
  q7: [],
  childEmail: "",
  kidName: "Lilianna",
  regionalDiscountPct: 10,
  claimCommitment: true,
  lessonLinkShared: false,
  confirmTcpa: true,
  devicePreference: "computer-tablet",
  phoneVerifiedAt: new Date().toISOString(),
  strategyCallStart: new Date(Date.now() + 86400000 * 3).toISOString(),
};

const FUNNEL_STEPS = [
  { id: "01-funnel-entry", step: "q1-parent-child" },
  { id: "02-regional-unlock", step: "b-regional-unlock", wait: ".qfb-regional-unlock__card" },
  { id: "03-target-schools", step: "b-target-schools", wait: ".qfb-target-schools" },
  { id: "04-plan-ready", step: "b-plan-ready", wait: ".qfb-plan-ready-card" },
  { id: "05-email-capture", step: "b-email", wait: ".qfb-email-capture", networkIdle: true },
  { id: "06-computing", step: "b-computing", wait: ".qfb-computing__headline" },
  { id: "07-phone-verify", step: "b-phone", wait: ".qfb-phone-title" },
  { id: "08-post-device", step: "b-post-device", wait: ".qfb-post-device" },
];

const PORTAL_PAGES = [
  { id: "09-portal-home", path: "/portal/home", wait: ".portal-app" },
  { id: "10-portal-profile", path: "/portal/profile", wait: ".portal-profile-page" },
];

function portalSessionSecret() {
  return (
    process.env.PORTAL_SESSION_SECRET?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim() ||
    process.env.ADMIN_SECRET?.trim() ||
    null
  );
}

function createPortalSessionToken(leadId, email, secret) {
  const full = {
    leadId,
    email: email.trim().toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  };
  const encoded = Buffer.from(JSON.stringify(full)).toString("base64url");
  const sig = createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${sig}`;
}

async function findPortalLead() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const emails = ["testemil@gmail.com", "brianna@illuminairy.com"];

  for (const email of emails) {
    const { data } = await supabase
      .from("leads")
      .select("id, parent_email, student_first")
      .ilike("parent_email", email)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data?.id) return { leadId: data.id, email: data.parent_email ?? email };
  }

  const { data } = await supabase
    .from("leads")
    .select("id, parent_email, student_first")
    .not("student_first", "is", null)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (data?.id) {
    return { leadId: data.id, email: data.parent_email ?? "parent@example.com" };
  }
  return null;
}

async function seedFunnel(page, step) {
  await page.evaluate(
    ({ answers, stepId }) => {
      localStorage.setItem("qfb_answers", JSON.stringify(answers));
      localStorage.setItem("qfb_last_step", stepId);
      localStorage.setItem("qfb_updated_at", String(Date.now()));
    },
    { answers: SEED, stepId: step }
  );
}

async function screenshot(page, name, opts = {}) {
  const path = join(SHOT_DIR, `${name}.png`);
  if (opts.wait) {
    await page.waitForSelector(opts.wait, { timeout: opts.timeout ?? TIMEOUT });
  }
  await page.waitForTimeout(opts.delay ?? 500);
  await page.screenshot({ path, fullPage: false });
  console.log(`  📸 ${name}.png`);
  return path;
}

async function safeScreenshot(page, name, opts = {}) {
  try {
    return await screenshot(page, name, opts);
  } catch (err) {
    console.warn(`  ⚠ ${name}: ${err.message}`);
    const fallback = join(SHOT_DIR, `${name}-partial.png`);
    await page.screenshot({ path: fallback, fullPage: false });
    return fallback;
  }
}

async function main() {
  mkdirSync(SHOT_DIR, { recursive: true });

  try {
    const health = await fetch(`${BASE}/plan-b?step=q1-parent-child&pb=b`);
    if (!health.ok) throw new Error(`HTTP ${health.status}`);
  } catch (e) {
    console.error(`Cannot reach ${BASE}. Start dev server first. (${e.message})`);
    process.exit(1);
  }

  const portalLead = await findPortalLead();
  const portalSecret = portalSessionSecret();
  const manifest = [];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...devices["iPhone 13"],
    reducedMotion: "reduce",
  });

  if (portalLead && portalSecret) {
    const token = createPortalSessionToken(portalLead.leadId, portalLead.email, portalSecret);
    await context.addCookies([
      {
        name: "portal_session",
        value: token,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        sameSite: "Lax",
      },
    ]);
    console.log(`Portal session → ${portalLead.email} (${portalLead.leadId.slice(0, 8)}…)`);
  } else {
    console.warn("Portal screenshots skipped (no Supabase lead or session secret).");
  }

  const page = await context.newPage();

  console.log("\nPlan B funnel (iPhone 13)");
  for (const item of FUNNEL_STEPS) {
    await page.goto(`${BASE}/plan-b?step=${item.step}&pb=b`, { waitUntil: "domcontentloaded" });
    await seedFunnel(page, item.step);
    await page.reload({
      waitUntil: item.networkIdle ? "networkidle" : "domcontentloaded",
    });
    if (item.networkIdle) await page.waitForTimeout(2000);

    if (item.step === "b-computing") {
      await page
        .locator(".qfb-compute-popup")
        .first()
        .waitFor({ state: "visible", timeout: 45_000 })
        .catch(() => {});
    }

    const file = await safeScreenshot(page, item.id, { wait: item.wait });
    manifest.push({ label: item.id, file, url: `${BASE}/plan-b?step=${item.step}` });
  }

  if (portalLead && portalSecret) {
    console.log("\nPortal (iPhone 13)");
    for (const item of PORTAL_PAGES) {
      await page.goto(`${BASE}${item.path}`, { waitUntil: "networkidle" });
      const file = await safeScreenshot(page, item.id, { wait: item.wait });
      manifest.push({ label: item.id, file, url: `${BASE}${item.path}` });
    }

    await page.goto(`${BASE}/portal/home`, { waitUntil: "networkidle" });
    await page.waitForSelector(".portal-profile__chip", { timeout: TIMEOUT });
    await page.locator(".portal-profile__chip").click();
    await page.waitForURL(/\/portal\/profile/, { timeout: TIMEOUT });
    await page.waitForTimeout(400);
    const file = await safeScreenshot(page, "11-portal-profile-from-chip", {
      wait: ".portal-profile-page",
    });
    manifest.push({
      label: "11-portal-profile-from-chip",
      file,
      url: `${BASE}/portal/profile`,
    });
  }

  await browser.close();

  writeFileSync(
    join(SHOT_DIR, "manifest.json"),
    JSON.stringify({ capturedAt: new Date().toISOString(), base: BASE, shots: manifest }, null, 2)
  );

  console.log(`\nDone → ${SHOT_DIR}`);
  console.log(`  ${manifest.length} screenshots`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
