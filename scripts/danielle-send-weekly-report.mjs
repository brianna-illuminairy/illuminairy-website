#!/usr/bin/env node
/**
 * Send Danielle Week 1 weekly progress report email to parent.
 *
 * Usage:
 *   ADMIN_SECRET=... PARENT_EMAIL=... npm run danielle:send-weekly-report
 *
 * Optional:
 *   PARENT_FIRST=...
 *   DANIELLE_WEEKLY_REPORT_BASE_URL=https://illuminairy.com
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvLocal() {
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    if (process.env[key]) continue;
    let val = trimmed.slice(eq + 1);
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

loadEnvLocal();

const secret = process.env.ADMIN_SECRET?.trim();
if (!secret) {
  console.error("Set ADMIN_SECRET.");
  process.exit(1);
}

const parentEmail = process.env.PARENT_EMAIL?.trim() || process.env.DANIELLE_PARENT_EMAIL?.trim();
if (!parentEmail) {
  console.error("Set PARENT_EMAIL or DANIELLE_PARENT_EMAIL.");
  process.exit(1);
}

const baseUrl = (
  process.env.DANIELLE_WEEKLY_REPORT_BASE_URL ||
  process.env.DANIELLE_NOTIFY_BASE_URL ||
  "https://illuminairy.com"
).replace(/\/$/, "");

const body = {
  parentEmail,
  parentFirst: process.env.PARENT_FIRST?.trim() || process.env.DANIELLE_PARENT_FIRST?.trim(),
  weekLabel: process.env.WEEK_LABEL?.trim() || "Week 1 (June 9 to 16, 2026)",
  reportPath: "/danielle/week-1/report"
};

const response = await fetch(`${baseUrl}/api/danielle/weekly-report/send`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${secret}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(body)
});

const text = await response.text();
if (!response.ok) {
  console.error("Weekly report send failed:", response.status, text);
  process.exit(1);
}

console.log(text);
