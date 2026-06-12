#!/usr/bin/env node
/**
 * Register Calendly webhook → illuminairy.com/api/webhooks/calendly
 * Requires CALENDLY_API_TOKEN in .env.local (Personal Access Token).
 *
 * Idempotent: deletes any existing subscription pointing at our callback URL,
 * then creates a fresh one with the full event list the CRM v4 pipeline needs.
 * Prints the new signing key for capture into .env.local.
 */
import { readFileSync, existsSync, writeFileSync } from "fs";
import { randomBytes } from "crypto";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");

const WEBHOOK_EVENTS = [
  "invitee.created",
  "invitee.canceled",
  "invitee_no_show.created",
  "invitee_no_show.deleted"
];

function loadEnv() {
  if (!existsSync(envPath)) return {};
  const env = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    let v = t.slice(i + 1);
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    env[t.slice(0, i)] = v;
  }
  return env;
}

async function calendly(token, path, init = {}) {
  const res = await fetch(`https://api.calendly.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {})
    }
  });
  const text = await res.text();
  let body;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!res.ok) {
    const err = new Error(`Calendly API ${res.status}: ${typeof body === "string" ? body : JSON.stringify(body)}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

async function main() {
  const env = loadEnv();
  const token = env.CALENDLY_API_TOKEN || process.env.CALENDLY_API_TOKEN;
  if (!token) {
    console.log("Add CALENDLY_API_TOKEN to .env.local (Calendly → Integrations → API & Webhooks)");
    process.exit(1);
  }

  const siteUrl = env.SITE_URL || "https://illuminairy.com";
  const callbackUrl = `${siteUrl.replace(/\/$/, "")}/api/webhooks/calendly`;

  const me = await calendly(token, "/users/me");
  const orgUri = me.resource.current_organization;
  console.log(`✓ Authenticated as ${me.resource.email}`);
  console.log(`  Org: ${orgUri}`);

  const existing = await calendly(token, `/webhook_subscriptions?organization=${encodeURIComponent(orgUri)}&scope=organization`);
  const matches = (existing.collection ?? []).filter((s) => s.callback_url === callbackUrl);
  for (const sub of matches) {
    console.log(`  Deleting old subscription ${sub.uri.split("/").pop()} (events: ${sub.events.join(",")})`);
    await calendly(token, `/webhook_subscriptions/${sub.uri.split("/").pop()}`, { method: "DELETE" });
  }

  const signingKey = randomBytes(32).toString("base64url");

  const created = await calendly(token, "/webhook_subscriptions", {
    method: "POST",
    body: JSON.stringify({
      url: callbackUrl,
      events: WEBHOOK_EVENTS,
      organization: orgUri,
      scope: "organization",
      signing_key: signingKey
    })
  });

  const signingKeyOut = created.resource?.signing_key ?? signingKey;
  console.log(`✓ Calendly webhook created: ${callbackUrl}`);
  console.log(`  events: ${WEBHOOK_EVENTS.join(", ")}`);
  console.log(`  uri:    ${created.resource?.uri ?? "?"}`);

  const lines = readFileSync(envPath, "utf8").split("\n");
  let updated = false;
  const next = lines.map((line) => {
    if (line.startsWith("CALENDLY_WEBHOOK_SIGNING_KEY=")) {
      updated = true;
      return `CALENDLY_WEBHOOK_SIGNING_KEY="${signingKeyOut}"`;
    }
    return line;
  });
  if (!updated) {
    next.push(`CALENDLY_WEBHOOK_SIGNING_KEY="${signingKeyOut}"`);
  }
  writeFileSync(envPath, next.join("\n"), "utf8");
  console.log(`✓ Wrote CALENDLY_WEBHOOK_SIGNING_KEY to .env.local`);

  console.log("\nAlso push to Vercel production env (one of):");
  console.log(`  npx vercel env rm CALENDLY_WEBHOOK_SIGNING_KEY production --yes && \\`);
  console.log(`  echo -n "${signingKeyOut}" | npx vercel env add CALENDLY_WEBHOOK_SIGNING_KEY production`);
}

main().catch((e) => {
  console.error("setup-calendly-webhook failed:", e.message ?? e);
  if (e.body) console.error(JSON.stringify(e.body, null, 2));
  process.exit(1);
});
