#!/usr/bin/env node
/**
 * Smoke-test reCAPTCHA Enterprise assessments API (GCP console backend step).
 *
 * Usage:
 *   RECAPTCHA_ENTERPRISE_API_KEY=... node scripts/recaptcha-enterprise-assess-smoke.mjs [TOKEN]
 *
 * Without TOKEN, sends a dummy token — expect invalid token (proves auth works), not 403 blocked.
 */
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || "illuminairy-plan-b-e4fc5";
const SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY?.trim() ||
  "6LfY4y4tAAAAAJIIuRDs0cKXvxWoN4JgKuWmKPJ6";
const API_KEY = process.env.RECAPTCHA_ENTERPRISE_API_KEY?.trim();
const TOKEN = process.argv[2] || "smoke-test-token";
const ACTION = "phone_verify";

if (!API_KEY) {
  console.error("Set RECAPTCHA_ENTERPRISE_API_KEY (server key, not Firebase browser key).");
  process.exit(1);
}

const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${PROJECT_ID}/assessments?key=${encodeURIComponent(API_KEY)}`;

const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    event: {
      token: TOKEN,
      expectedAction: ACTION,
      siteKey: SITE_KEY,
    },
  }),
});

const body = await res.json().catch(() => ({}));
console.log("HTTP", res.status);
console.log(JSON.stringify(body, null, 2));

if (res.status === 403) {
  console.error("\n403 blocked: enable reCAPTCHA Enterprise API + use a server API key (not browser key).");
  process.exit(1);
}
