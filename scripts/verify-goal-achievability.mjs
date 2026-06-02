#!/usr/bin/env node
/**
 * Matrix test for reveal achievability copy — q2 stakes, q6 insight, tiers, edge cases.
 * Run: npm run funnel:achievability
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const runner = join(root, "scripts/verify-goal-achievability-runner.ts");

const result = spawnSync("npx", ["--yes", "tsx", runner], {
  cwd: root,
  stdio: "inherit",
  encoding: "utf8",
});

process.exit(result.status ?? 1);
