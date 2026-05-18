#!/usr/bin/env node
/**
 * Register Calendly webhook → illuminairy.com/api/webhooks/calendly
 * Requires CALENDLY_API_TOKEN in .env.local (Personal Access Token)
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");

function loadEnv() {
  if (!existsSync(envPath)) return {};
  const env = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    env[t.slice(0, i)] = t.slice(i + 1);
  }
  return env;
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

  const meRes = await fetch("https://api.calendly.com/users/me", {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!meRes.ok) {
    console.error("Calendly auth failed:", await meRes.text());
    process.exit(1);
  }
  const me = await meRes.json();
  const orgUri = me.resource.current_organization;

  const body = {
    url: callbackUrl,
    events: ["invitee.created", "invitee.canceled"],
    organization: orgUri,
    scope: "organization"
  };

  const subRes = await fetch("https://api.calendly.com/webhook_subscriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const sub = await subRes.json();
  if (!subRes.ok) {
    console.error("Webhook create failed:", JSON.stringify(sub, null, 2));
    process.exit(1);
  }

  const signingKey = sub.resource?.signing_key;
  console.log("✓ Calendly webhook created:", callbackUrl);
  if (signingKey) {
    console.log("\nAdd to .env.local and Vercel:");
    console.log(`CALENDLY_WEBHOOK_SIGNING_KEY=${signingKey}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
