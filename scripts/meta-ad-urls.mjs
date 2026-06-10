#!/usr/bin/env node
/**
 * Print canonical Meta ad destination URLs from meta-live-creatives.ts.
 * Run: npm run marketing:ad-urls
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const runner = join(root, "scripts/meta-ad-urls-runner.ts");

const result = spawnSync("npx", ["--yes", "tsx", runner], {
  cwd: root,
  stdio: "inherit",
  encoding: "utf8",
});

process.exit(result.status ?? 1);
