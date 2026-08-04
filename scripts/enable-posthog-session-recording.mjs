#!/usr/bin/env node
/**
 * Turn on PostHog session replay for the Illuminairy project (one-time / after reset).
 *
 * Requires a personal API key (phx_...) from PostHog → Settings → Personal API keys
 * with project write access.
 *
 * Usage:
 *   POSTHOG_PERSONAL_API_KEY=phx_... npm run posthog:enable-recordings
 *
 * Optional:
 *   POSTHOG_API_HOST=https://us.posthog.com  (default; use https://eu.posthog.com on EU cloud)
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvValue(name) {
  if (process.env[name]?.trim()) {
    return process.env[name].trim();
  }
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) {
    return "";
  }
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith(`${name}=`)) {
      return trimmed.split("=").slice(1).join("=").trim();
    }
  }
  return "";
}

const personalKey =
  loadEnvValue("POSTHOG_PERSONAL_API_KEY") || loadEnvValue("POSTHOG_API_KEY");

if (!personalKey.startsWith("phx_")) {
  console.error(
    "✗ Set POSTHOG_PERSONAL_API_KEY or POSTHOG_API_KEY (phx_...) from PostHog → Settings → Personal API keys"
  );
  console.error("  Example: POSTHOG_PERSONAL_API_KEY=phx_... npm run posthog:enable-recordings");
  process.exit(1);
}

const apiHost = (
  process.env.POSTHOG_API_HOST ?? "https://us.posthog.com"
).replace(/\/$/, "");

const authHeaders = {
  Authorization: `Bearer ${personalKey}`,
  "Content-Type": "application/json"
};

const getRes = await fetch(`${apiHost}/api/projects/@current/`, {
  headers: { Authorization: `Bearer ${personalKey}` }
});

const project = await getRes.json();

if (!getRes.ok) {
  console.error("✗ Could not load PostHog project:", project.detail ?? project);
  process.exit(1);
}

console.log(`Project: ${project.name} (${project.id})`);
console.log(`  session_recording_opt_in: ${project.session_recording_opt_in}`);

const patchBody = {
  session_recording_opt_in: true,
  session_recording_sample_rate: "1.00",
  // Empty = record on every domain (prod, www, Vercel previews, localhost).
  // A non-empty allowlist blocks any host not listed.
  recording_domains: [],
  session_recording_masking_config: {
    maskAllInputs: true
  }
};

const patchRes = await fetch(`${apiHost}/api/projects/${project.id}/`, {
  method: "PATCH",
  headers: authHeaders,
  body: JSON.stringify(patchBody)
});

const updated = await patchRes.json();

if (!patchRes.ok) {
  console.error("✗ Failed to enable session recordings:", updated.detail ?? updated);
  process.exit(1);
}

console.log("✓ Session recordings enabled");
console.log(`  opt_in: ${updated.session_recording_opt_in}`);
console.log(`  sample_rate: ${updated.session_recording_sample_rate}`);
console.log(`  domains: ${(updated.recording_domains ?? []).join(", ")}`);
console.log("\nNext: deploy the site (if not already), browse illuminairy.com, then open");
console.log("PostHog → Session replay → Recent recordings.\n");
