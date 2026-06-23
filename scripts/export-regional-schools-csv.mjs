#!/usr/bin/env node
/**
 * Export per-state target school picker for Brianna review.
 * Run: npm run plan-b:export-regional-schools
 */
import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
mkdirSync(join(root, "exports"), { recursive: true });

const runner = join(root, "scripts/export-regional-schools-csv-runner.ts");

const result = spawnSync("npx", ["--yes", "tsx", runner], {
  cwd: root,
  stdio: "inherit",
  encoding: "utf8",
});

process.exit(result.status ?? 1);
