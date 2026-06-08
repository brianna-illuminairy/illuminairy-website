#!/usr/bin/env node
/**
 * Emergency CLI deploy — uploads LOCAL files to production, bypassing git.
 * Prefer: commit → npm run release. See docs/deploy.md
 */

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

if (process.env.DEPLOY_CLI_OK !== "1") {
  console.error(`
deploy:cli blocked — this uploads your local folder to production, not git.

Normal ship:
  npm run agent:verify
  git commit …
  npm run release

Emergency only (you accept git/prod drift):
  DEPLOY_CLI_OK=1 npm run deploy:cli
`);
  process.exit(1);
}

const dirty = spawnSync("git", ["status", "--porcelain"], { encoding: "utf8" });
if (dirty.stdout?.trim()) {
  console.warn("⚠  Warning: uncommitted changes will go to prod but are NOT in git.\n");
}

const localSha = spawnSync("git", ["rev-parse", "--short", "HEAD"], { encoding: "utf8" }).stdout?.trim();
const remote = spawnSync("git", ["rev-parse", "--short", "@{u}"], { encoding: "utf8" });
const remoteSha = remote.status === 0 ? remote.stdout?.trim() : "unknown";
console.warn(`CLI deploy: local ${localSha} (origin may be ${remoteSha}) — commit after deploy.\n`);

const r = spawnSync("npx", ["vercel", "deploy", "--prod"], { stdio: "inherit", shell: false });
process.exit(r.status ?? 1);
