/**
 * Export per-state picker rows for owner review.
 * Run: npm run plan-b:export-regional-schools
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { buildRegionalMarket } from "@/lib/plan-b/build-regional-market";
import { getCatalogSchool } from "@/lib/plan-b/school-catalog";
import { US_STATE_CODES } from "@/lib/plan-b/us-states";

const rows: string[] = [
  "state_code,state_slug,state_label,school_id,school_name,in_state,composite50,source_label",
];

for (const code of US_STATE_CODES) {
  const market = buildRegionalMarket(code);
  for (const school of market.schools) {
    const catalog = getCatalogSchool(school.id);
    const composite50 = catalog?.composite50 ?? "";
    const sourceLabel = catalog?.sourceLabel ?? "";
    const line = [
      code,
      market.id,
      market.label,
      school.id,
      `"${school.name.replace(/"/g, '""')}"`,
      school.inState ? "true" : "false",
      composite50,
      `"${String(sourceLabel).replace(/"/g, '""')}"`,
    ].join(",");
    rows.push(line);
  }
}

const outPath = join(process.cwd(), "exports", "plan-b-regional-schools.csv");
writeFileSync(outPath, rows.join("\n") + "\n", "utf8");
console.log(`Wrote ${rows.length - 1} rows to ${outPath}`);
