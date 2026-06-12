#!/usr/bin/env node
// Safer wrapper around `vercel env pull`.
// 1. Snapshots .env.local first.
// 2. Pulls into a TEMP file so a broken pull can't wipe live values.
// 3. Merges: keep your local values, only fill in keys that are EMPTY locally.
// 4. Shows a diff summary.

import { copyFileSync, existsSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const localPath = resolve(root, ".env.local");
const tmpPath = resolve(root, ".env.vercel.tmp");

const env = process.argv[2] === "production" ? "production" : process.argv[2] === "preview" ? "preview" : "development";
console.log(`env-pull-safe: target environment = ${env}`);

execSync("node scripts/env-snapshot.mjs", { stdio: "inherit", cwd: root });

console.log(`env-pull-safe: pulling ${env} env to temp file...`);
execSync(`npx vercel env pull ${tmpPath} --environment=${env} --yes`, { stdio: "inherit", cwd: root });

if (!existsSync(tmpPath)) {
  console.error("env-pull-safe: vercel pull failed, no temp file produced");
  process.exit(1);
}

function parseEnv(text) {
  const out = new Map();
  for (const raw of text.split("\n")) {
    const line = raw.trimEnd();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    out.set(key, val);
  }
  return out;
}

const localText = existsSync(localPath) ? readFileSync(localPath, "utf8") : "";
const local = parseEnv(localText);
const remote = parseEnv(readFileSync(tmpPath, "utf8"));

const added = [];
const skippedNonEmpty = [];
const remoteEmpty = [];

for (const [k, v] of remote) {
  const lv = local.get(k);
  if (!v) { remoteEmpty.push(k); continue; }
  if (lv && lv.length > 0) { skippedNonEmpty.push(k); continue; }
  local.set(k, v);
  added.push(k);
}

const keys = Array.from(local.keys()).sort();
const header = "# Managed by scripts/env-pull-safe.mjs (snapshots in .env-backups/)\n";
const body = keys.map((k) => `${k}="${local.get(k) ?? ""}"`).join("\n") + "\n";
writeFileSync(localPath, header + body, "utf8");
unlinkSync(tmpPath);

console.log("\nenv-pull-safe: summary");
console.log("  added from Vercel       :", added.length, added.length ? added.join(", ") : "");
console.log("  kept local (had value)  :", skippedNonEmpty.length);
console.log("  empty in Vercel (skip)  :", remoteEmpty.length);
console.log("  snapshot                :", ".env-backups/  (last 20 retained)");
