#!/usr/bin/env node
// Snapshot .env.local to .env-backups/ with timestamp + retention.
// Run before any destructive env operation. Idempotent.

import { copyFileSync, mkdirSync, readdirSync, statSync, unlinkSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = resolve(root, ".env.local");
const dir = resolve(root, ".env-backups");

if (!existsSync(src)) {
  console.error("env-snapshot: .env.local not found at", src);
  process.exit(1);
}

mkdirSync(dir, { recursive: true });

const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const dest = join(dir, `.env.local.${ts}.bak`);
copyFileSync(src, dest);
console.log("env-snapshot: wrote", dest);

// Keep 20 newest; prune older
const keep = 20;
const backups = readdirSync(dir)
  .filter((f) => f.startsWith(".env.local.") && f.endsWith(".bak"))
  .map((f) => ({ f, t: statSync(join(dir, f)).mtimeMs }))
  .sort((a, b) => b.t - a.t);

for (const old of backups.slice(keep)) {
  unlinkSync(join(dir, old.f));
  console.log("env-snapshot: pruned", old.f);
}
