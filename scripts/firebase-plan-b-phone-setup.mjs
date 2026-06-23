#!/usr/bin/env node
/**
 * Plan B Firebase Phone Auth — full GCP + Firebase setup via APIs (no console).
 *
 * Prereq (one time on this machine):
 *   export PATH=/opt/homebrew/share/google-cloud-sdk/bin:"$PATH"
 *   gcloud auth login
 *   gcloud auth application-default login
 *   gcloud config set project illuminairy-plan-b-e4fc5
 *
 * Run:
 *   npm run firebase:plan-b-setup
 *
 * Writes service account key to .env-backups/ (gitignored) and prints Vercel env steps.
 */
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { GoogleAuth } from "google-auth-library";

const PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ||
  process.env.FIREBASE_PROJECT_ID?.trim() ||
  "illuminairy-plan-b-e4fc5";

const API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() ||
  "AIzaSyDDMZLAWKLPS7dJ0GNCSf8akfIroJj-3ZQ";

const SA_ID = "plan-b-phone-verify";
const SA_EMAIL = `${SA_ID}@${PROJECT_ID}.iam.gserviceaccount.com`;

const AUTHORIZED_DOMAINS = [
  "illuminairy.com",
  "www.illuminairy.com",
  "localhost",
  "127.0.0.1",
];

const BROWSER_KEY_REFERRERS = [
  "https://illuminairy.com/*",
  "https://www.illuminairy.com/*",
  "http://localhost:3000/*",
  "http://127.0.0.1:3000/*",
];

const root = process.cwd();
const backupDir = join(root, ".env-backups");

function gcpHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    "x-goog-user-project": PROJECT_ID,
  };
}

async function getAccessToken() {
  try {
    return gcloud("auth print-access-token");
  } catch {
    const auth = new GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      projectId: PROJECT_ID,
      quotaProjectId: PROJECT_ID,
    });
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    if (!token.token) {
      throw new Error(
        "No GCP access token. Run:\n  gcloud auth login\n  gcloud auth application-default login\n  gcloud config set project " +
          PROJECT_ID
      );
    }
    return token.token;
  }
}

function gcloud(args) {
  return execSync(`gcloud ${args}`, { encoding: "utf8" }).trim();
}

function ensureServiceAccount() {
  try {
    gcloud(`iam service-accounts describe ${SA_EMAIL} --project=${PROJECT_ID}`);
    console.log(`Service account exists: ${SA_EMAIL}`);
  } catch {
    console.log(`Creating service account ${SA_EMAIL}...`);
    gcloud(
      `iam service-accounts create ${SA_ID} --project=${PROJECT_ID} --display-name="Plan B phone verify (Vercel)"`
    );
  }

  for (const role of [
    "roles/firebaseauth.admin",
    "roles/recaptchaenterprise.agent",
    "roles/serviceusage.serviceUsageConsumer",
  ]) {
    try {
      gcloud(
        `projects add-iam-policy-binding ${PROJECT_ID} --member=serviceAccount:${SA_EMAIL} --role=${role} --quiet`
      );
      console.log(`IAM: ${role} → ${SA_EMAIL}`);
    } catch (err) {
      console.warn(`IAM ${role}:`, err.stderr?.toString() || err.message || err);
    }
  }
}

function createServiceAccountKey() {
  mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const keyPath = join(backupDir, `firebase-plan-b-sa-${stamp}.json`);
  try {
    gcloud(
      `iam service-accounts keys create "${keyPath}" --iam-account=${SA_EMAIL} --project=${PROJECT_ID}`
    );
    console.log(`Service account key: ${keyPath}`);
    return keyPath;
  } catch (err) {
    const msg = err.stderr?.toString() || err.message || String(err);
    if (msg.includes("disableServiceAccountKeyCreation") || msg.includes("Key creation is not allowed")) {
      console.log(
        "Skipping SA key download (org policy blocks key creation). Phone verify uses Web API key + assessments API."
      );
      return null;
    }
    throw err;
  }
}

async function enableService(token, serviceName) {
  const url = `https://serviceusage.googleapis.com/v1/projects/${PROJECT_ID}/services/${serviceName}:enable`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json().catch(() => ({}));
  console.log(`enable ${serviceName}: ${res.status}`, body.error?.message || "ok");
}

async function patchIdentityConfig(token) {
  const getUrl = `https://identitytoolkit.googleapis.com/v2/projects/${PROJECT_ID}/config`;
  const getRes = await fetch(getUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const current = await getRes.json().catch(() => ({}));
  if (!getRes.ok) {
    console.error("GET identity config failed:", current);
    return;
  }

  const mergedDomains = Array.from(
    new Set([...(current.authorizedDomains || []), ...AUTHORIZED_DOMAINS])
  );

  const patchBody = {
    authorizedDomains: mergedDomains,
    signIn: {
      ...(current.signIn || {}),
      phoneNumber: {
        ...(current.signIn?.phoneNumber || {}),
        enabled: true,
      },
    },
    smsRegionConfig: {
      allowByDefault: {
        disallowedRegions: [],
      },
      allowlistOnly: {
        allowedRegions: ["US"],
      },
    },
  };

  const patchUrl = `${getUrl}?updateMask=authorizedDomains,signIn.phoneNumber.enabled,smsRegionConfig`;
  const patchRes = await fetch(patchUrl, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patchBody),
  });
  const patchResult = await patchRes.json().catch(() => ({}));
  console.log(
    `identity config (phone on, US SMS, domains): ${patchRes.status}`,
    patchResult.error?.message || "ok"
  );
}

const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY?.trim() ||
  "6LfY4y4tAAAAAJIIuRDs0cKXvxWoN4JgKuWmKPJ6";

async function createServerRecaptchaApiKey(token) {
  const listUrl = `https://apikeys.googleapis.com/v2/projects/${PROJECT_ID}/locations/global/keys`;
  const listRes = await fetch(listUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const listBody = await listRes.json().catch(() => ({}));
  if (!listRes.ok) {
    console.error("list API keys failed:", listBody);
    return null;
  }

  const existing = (listBody.keys || []).find(
    (k) => k.displayName === "Plan B reCAPTCHA Enterprise assessments (server)"
  );
  if (existing?.name) {
    const uid = existing.name.split("/").pop();
    const keyStringRes = await fetch(
      `https://apikeys.googleapis.com/v2/projects/${PROJECT_ID}/locations/global/keys/${uid}/keyString`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (keyStringRes.ok) {
      const { keyString } = await keyStringRes.json();
      console.log("Server reCAPTCHA API key already exists (reusing).");
      return keyString;
    }
  }

  const createRes = await fetch(listUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      displayName: "Plan B reCAPTCHA Enterprise assessments (server)",
      restrictions: {
        apiTargets: [{ service: "recaptchaenterprise.googleapis.com" }],
      },
    }),
  });
  const created = await createRes.json().catch(() => ({}));
  if (!createRes.ok) {
    console.error("create server reCAPTCHA API key failed:", created);
    return null;
  }

  const opName = created.name;
  if (!opName) {
    console.error("create server key: missing operation name", created);
    return null;
  }

  let keyResource = null;
  for (let i = 0; i < 30; i += 1) {
    await new Promise((r) => setTimeout(r, 2000));
    const opRes = await fetch(`https://apikeys.googleapis.com/v2/${opName}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const opBody = await opRes.json().catch(() => ({}));
    if (opBody.done && opBody.response?.name) {
      keyResource = opBody.response.name;
      break;
    }
  }

  if (!keyResource) {
    console.error("timed out waiting for server API key operation");
    return null;
  }

  const uid = keyResource.split("/").pop();
  const keyStringRes = await fetch(
    `https://apikeys.googleapis.com/v2/projects/${PROJECT_ID}/locations/global/keys/${uid}/keyString`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const keyBody = await keyStringRes.json().catch(() => ({}));
  if (!keyStringRes.ok || !keyBody.keyString) {
    console.error("fetch server key string failed:", keyBody);
    return null;
  }

  console.log("Created server reCAPTCHA API key for assessments.create");
  return keyBody.keyString;
}

async function smokeRecaptchaAssessment(apiKey, recaptchaToken) {
  const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${PROJECT_ID}/assessments?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: {
        token: recaptchaToken,
        expectedAction: "phone_verify",
        siteKey: RECAPTCHA_SITE_KEY,
      },
    }),
  });
  const body = await res.json().catch(() => ({}));
  console.log(`assessments smoke (HTTP ${res.status}):`, body.error?.message || "ok");
  if (res.status === 403) {
    console.log("403 = wrong key type or reCAPTCHA Enterprise API not enabled.");
  } else if (res.status === 400 || body.tokenProperties?.valid === false) {
    console.log("Invalid token is expected for dummy token — auth works.");
  }
  return { status: res.status, body };
}

async function patchBrowserApiKeyReferrers(token) {
  const listUrl = `https://apikeys.googleapis.com/v2/projects/${PROJECT_ID}/locations/global/keys`;
  const listRes = await fetch(listUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const listBody = await listRes.json().catch(() => ({}));
  if (!listRes.ok) {
    console.error("list API keys failed:", listBody);
    return;
  }

  const keys = listBody.keys || [];
  let target = null;

  for (const key of keys) {
    const keyName = key.name;
    const getRes = await fetch(
      `https://apikeys.googleapis.com/v2/${keyName}/keyString?keyString=${encodeURIComponent(API_KEY)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (getRes.ok) {
      const body = await getRes.json();
      if (body.keyString === API_KEY) {
        const metaRes = await fetch(`https://apikeys.googleapis.com/v2/${keyName}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (metaRes.ok) target = await metaRes.json();
        break;
      }
    }
  }

  if (!target) {
    for (const key of keys) {
      const getRes = await fetch(`https://apikeys.googleapis.com/v2/${key.name}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!getRes.ok) continue;
      const meta = await getRes.json();
      const uid = key.name.split("/").pop();
      const keyStringRes = await fetch(
        `https://apikeys.googleapis.com/v2/projects/${PROJECT_ID}/locations/global/keys/${uid}/keyString`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (keyStringRes.ok) {
        const { keyString } = await keyStringRes.json();
        if (keyString === API_KEY) {
          target = meta;
          break;
        }
      }
    }
  }

  if (!target?.name) {
    console.log(
      "Could not match browser API key. Set HTTP referrers manually for key ending in",
      API_KEY.slice(-8)
    );
    return;
  }

  const patchRes = await fetch(
    `https://apikeys.googleapis.com/v2/${target.name}?updateMask=restrictions`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        restrictions: {
          browserKeyRestrictions: { allowedReferrers: BROWSER_KEY_REFERRERS },
        },
      }),
    }
  );
  const patchBody = await patchRes.json().catch(() => ({}));
  console.log(
    `API key referrers (${target.displayName || target.name}): ${patchRes.status}`,
    patchBody.error?.message || "ok"
  );
}

function printEnvLocalBlock(extraLines = []) {
  const lines = [
    "",
    "# Plan B Firebase — generated by npm run firebase:plan-b-setup",
    `NEXT_PUBLIC_FIREBASE_API_KEY=${API_KEY}`,
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=illuminairy-plan-b-e4fc5.firebaseapp.com",
    `NEXT_PUBLIC_FIREBASE_PROJECT_ID=${PROJECT_ID}`,
    "NEXT_PUBLIC_FIREBASE_APP_ID=1:331382853798:web:084df38ceff1d4a3806467",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=331382853798",
    `NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY=${RECAPTCHA_SITE_KEY}`,
    `FIREBASE_PROJECT_ID=${PROJECT_ID}`,
    "FIREBASE_ENTERPRISE_RECAPTCHA=1",
    ...extraLines,
  ];
  console.log("\nAdd to .env.local and Vercel Production:\n");
  console.log(lines.join("\n"));
}

async function main() {
  console.log(`\n=== Plan B Firebase phone setup — ${PROJECT_ID} ===\n`);

  ensureServiceAccount();
  createServiceAccountKey();

  const token = await getAccessToken();
  await enableService(token, "identitytoolkit.googleapis.com");
  await enableService(token, "recaptchaenterprise.googleapis.com");
  await enableService(token, "firebase.googleapis.com");
  await patchIdentityConfig(token);
  await patchBrowserApiKeyReferrers(token);

  const serverRecaptchaKey = await createServerRecaptchaApiKey(token);
  const envExtras = [];
  if (serverRecaptchaKey) {
    await smokeRecaptchaAssessment(serverRecaptchaKey, "setup-smoke-token");
    envExtras.push(`RECAPTCHA_ENTERPRISE_API_KEY=${serverRecaptchaKey}`);
  }

  printEnvLocalBlock(envExtras);

  console.log("\nTest: https://illuminairy.com/plan-b?step=b-phone (incognito)\n");
}

main().catch((err) => {
  console.error("\nSetup failed:", err.message || err);
  process.exit(1);
});
