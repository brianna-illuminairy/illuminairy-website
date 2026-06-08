#!/usr/bin/env node
/**
 * Canonical production release: verify → push main → Vercel Git deploy → smoke.
 * Does NOT upload local files via CLI. See docs/deploy.md
 */

import { spawnSync } from "node:child_process";

const SMOKE_WAIT_MS = Number(process.env.RELEASE_SMOKE_WAIT_MS ?? 90_000);

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    stdio: opts.inherit === false ? "pipe" : "inherit",
    encoding: "utf8",
    shell: false,
  });
  return { ok: r.status === 0, stdout: r.stdout ?? "", stderr: r.stderr ?? "", status: r.status ?? 1 };
}

function git(args) {
  return run("git", args, { inherit: false });
}

function fail(msg) {
  console.error(`\nrelease: ${msg}`);
  console.error("See docs/deploy.md\n");
  process.exit(1);
}

console.log("Release — git push → Vercel auto-deploy (not CLI upload)\n");

const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]).stdout.trim();
if (branch !== "main") {
  fail(`on branch "${branch}" — merge to main first, then release from main`);
}

const dirty = git(["status", "--porcelain"]).stdout.trim();
if (dirty) {
  fail("working tree has uncommitted changes — commit first, then npm run release");
}

const verify = run("npm", ["run", "agent:verify"]);
if (!verify.ok) {
  fail("agent:verify failed — fix before release");
}

const upstream = git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"]).stdout.trim();
if (!upstream) {
  fail("main has no upstream — run: git push -u origin main");
}

const aheadBehind = git(["rev-list", "--left-right", "--count", "@{u}...HEAD"]).stdout.trim();
const [behind = "0", ahead = "0"] = aheadBehind.split(/\s+/);
if (Number(behind) > 0) {
  fail(`local main is ${behind} commit(s) behind ${upstream} — pull first`);
}

const localSha = git(["rev-parse", "--short", "HEAD"]).stdout.trim();
const remoteSha = git(["rev-parse", "--short", "@{u}"]).stdout.trim();

if (Number(ahead) === 0) {
  console.log(`main is already pushed (${localSha} = ${upstream}).`);
  console.log("Vercel will not rebuild unless you push a new commit.");
  console.log("Running smoke:prod on current production…\n");
} else {
  console.log(`Pushing ${ahead} commit(s) (${localSha}) to origin/main…\n`);
  const push = run("git", ["push", "origin", "main"]);
  if (!push.ok) fail("git push failed");
  console.log(`\nPushed. Vercel Git deploy should start for ${localSha}.`);
  console.log(`Waiting ${Math.round(SMOKE_WAIT_MS / 1000)}s for build…\n`);
  spawnSync("sleep", [String(Math.ceil(SMOKE_WAIT_MS / 1000))]);
}

const smoke = run("npm", ["run", "smoke:prod"]);
if (!smoke.ok) {
  fail("smoke:prod failed — check Vercel dashboard; prod may still be building");
}

console.log("\nrelease complete — production deploy path: git → Vercel\n");
