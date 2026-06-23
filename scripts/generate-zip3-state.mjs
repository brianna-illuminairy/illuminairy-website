#!/usr/bin/env node
/**
 * Regenerate lib/plan-b/data/zip3-to-state.json from npm zipcodes (dev-only).
 * Run: node scripts/generate-zip3-state.mjs
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tmpDir = join(root, ".tmp-zipcodes");

spawnSync("npm", ["pack", "zipcodes@8.0.0"], { cwd: tmpDir, stdio: "inherit", shell: false });
const packResult = spawnSync("ls", ["zipcodes-*.tgz"], { cwd: tmpDir, encoding: "utf8", shell: true });
const tgz = packResult.stdout.trim().split("\n")[0];
if (!tgz) {
  console.error("Could not download zipcodes package");
  process.exit(1);
}
spawnSync("tar", ["-xzf", tgz], { cwd: tmpDir, stdio: "inherit" });

const z = await import(join(tmpDir, "package/lib/index.js"));
const STATES =
  "AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split(
    " "
  );
const map = {};
for (const st of STATES) {
  for (const row of z.lookupByState(st) || []) {
    map[String(row.zip).padStart(5, "0").slice(0, 3)] = st;
  }
}

const outPath = join(root, "lib/plan-b/data/zip3-to-state.json");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(map));
console.log(`Wrote ${Object.keys(map).length} zip3 prefixes → ${outPath}`);
