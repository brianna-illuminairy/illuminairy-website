#!/usr/bin/env node
/**
 * Send Danielle portal update alerts (email + SMS) to opted-in subscribers.
 *
 * Usage:
 *   ADMIN_SECRET=... npm run danielle:notify-updates
 * Optional:
 *   UPDATE_IDS=2026-06-09-post-session-1,2026-06-09-lesson-2-math
 *   EMAIL=dansodanielle9@gmail.com
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

const baseUrl = (process.env.DANIELLE_NOTIFY_BASE_URL || "https://illuminairy.com").replace(
  /\/$/,
  ""
);
const updateIds = process.env.UPDATE_IDS?.split(",").map((id) => id.trim()).filter(Boolean);
const email = process.env.EMAIL?.trim();

const body = {};
if (updateIds?.length) {
  body.updateIds = updateIds;
}
if (email) {
  body.email = email;
}

const response = await fetch(`${baseUrl}/api/danielle/notifications/dispatch`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${secret}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(body)
});

const text = await response.text();
if (!response.ok) {
  console.error("Dispatch failed:", response.status, text);
  process.exit(1);
}

console.log(text);
