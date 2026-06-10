#!/usr/bin/env node
/**
 * Verify utm_content canonicalization for Meta creative aliases.
 * Run: npm run marketing:utm-aliases
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const runner = join(root, "scripts/verify-utm-content-aliases-runner.ts");

const result = spawnSync("npx", ["--yes", "tsx", runner], {
  cwd: root,
  stdio: "inherit",
  encoding: "utf8"
});

process.exit(result.status ?? 1);
