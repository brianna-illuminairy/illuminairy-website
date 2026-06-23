#!/usr/bin/env node
/**
 * CI guard for 50-state Plan B target school picker.
 * Run: npm run plan-b:validate-regional-schools
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const runner = join(root, "scripts/validate-regional-schools-runner.ts");

const result = spawnSync("npx", ["--yes", "tsx", runner], {
  cwd: root,
  stdio: "inherit",
  encoding: "utf8",
});

process.exit(result.status ?? 1);
