#!/usr/bin/env node
/**
 * Verify PostHog is configured and the live site proxy responds.
 * Usage: npm run posthog:verify
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = (process.env.SITE_URL || "https://illuminairy.com").replace(
  /\/$/,
  ""
);

function loadLocalKey() {
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) {
    return "";
  }
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("NEXT_PUBLIC_POSTHOG_KEY=")) {
      return trimmed.split("=").slice(1).join("=").trim();
    }
    if (trimmed.startsWith("NEXT_PUBLIC_POSTHOG_TOKEN=")) {
      return trimmed.split("=").slice(1).join("=").trim();
    }
  }
  return "";
}

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY || loadLocalKey();

if (!key) {
  console.error("✗ No PostHog key in .env.local (NEXT_PUBLIC_POSTHOG_KEY)");
  process.exit(1);
}

if (!key.startsWith("phc_")) {
  console.error("✗ PostHog key should start with phc_");
  process.exit(1);
}

const configUrl = `${siteUrl}/ia/array/${key}/config.js`;

try {
  const res = await fetch(configUrl, { redirect: "follow" });
  if (!res.ok) {
    console.error(`✗ PostHog proxy failed: ${configUrl} → HTTP ${res.status}`);
    process.exit(1);
  }
  const body = await res.text();
  if (!body.includes("posthog") && !body.includes("config")) {
    console.error("✗ Unexpected response from PostHog proxy");
    process.exit(1);
  }
  console.log("✓ PostHog key found locally");
  console.log(`✓ Live site proxy OK (${siteUrl}/ia/...)`);

  const decideRes = await fetch(`${siteUrl}/ia/decide?v=3`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: key, distinct_id: "posthog-verify-script" })
  });
  if (decideRes.ok) {
    const decide = await decideRes.json();
    const sr = decide.sessionRecording;
    if (sr === false || sr == null) {
      console.log("⚠ Session recordings not active (decide returned false).");
      console.log(
        "  Run: POSTHOG_PERSONAL_API_KEY=phx_... npm run posthog:enable-recordings"
      );
      console.log(
        "  Or PostHog → Project settings → Session replay → Enable."
      );
    } else {
      const rate =
        sr.sampleRate == null ? "100% (no sampling)" : String(sr.sampleRate);
      console.log(`✓ Session recordings active (${rate})`);
    }
  }

  console.log("\nPostHog is working. Open app.posthog.com → Activity → Live events");
  console.log("when you want to see visitors (no browser tools needed).\n");
} catch (err) {
  console.error(`✗ Could not reach ${configUrl}:`, err.message);
  process.exit(1);
}
