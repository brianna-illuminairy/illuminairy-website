#!/usr/bin/env node
/**
 * Push variables from .env.local to Vercel.
 * Run after changing secrets locally: npm run env:sync
 *
 * Requires: vercel CLI logged in, project linked (vercel link).
 */

import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envFile = process.argv[2] ?? resolve(root, ".env.local");
// Preview needs a git branch in Vercel's CLI; production is what illuminairy.com uses.
const environments = process.argv.includes("--all")
  ? ["production", "preview", "development"]
  : ["production"];

function parseEnvFile(path) {
  if (!existsSync(path)) {
    console.error(`Missing ${path}. Copy .env.example and fill in values.`);
    process.exit(1);
  }

  const vars = new Map();
  const text = readFileSync(path, "utf8");

  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!key || key.startsWith("VERCEL_")) {
      continue;
    }
    vars.set(key, value);
  }

  return vars;
}

function runVercel(args) {
  return spawnSync("npx", ["vercel", ...args], {
    cwd: root,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"]
  });
}

function addVar(name, value, env, sensitive) {
  const args = [
    "env",
    "add",
    name,
    env,
    "--value",
    value,
    "--yes",
    "--force"
  ];
  if (sensitive) {
    args.push("--sensitive");
  }
  const result = runVercel(args);
  if (result.status !== 0) {
    const err = (result.stderr || result.stdout || "").trim();
    throw new Error(`Failed to set ${name} (${env}): ${err}`);
  }
}

const vars = parseEnvFile(envFile);
console.log(
  `Syncing ${vars.size} variables from ${envFile} → ${environments.join(", ")}...\n`
);

for (const [name, value] of vars) {
  const sensitive =
    !name.startsWith("NEXT_PUBLIC_") &&
    !["CONTACT_INBOX", "STRIPE_TUITION_CENTS"].includes(name);

  for (const env of environments) {
    addVar(name, value, env, sensitive);
  }
  console.log(`  ✓ ${name}`);
}

console.log("\nDone. Redeploy so NEXT_PUBLIC_* vars are baked into the build:");
console.log("  npm run deploy:prod\n");
