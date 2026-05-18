#!/usr/bin/env node
/**
 * Fetch Curious Cardinals public Typeform definitions (get-started funnel).
 * Usage: node scripts/fetch-cc-typeforms.mjs
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "docs/research/cc-typeform-capture");

const FORMS = [
  { id: "P5h8CCfR", page: "contact-info", embed: "01K8K8SQJ19ZW5HCXAD7WHDAYT" },
  { id: "ALTmLSan", page: "student-info / parent-info", embed: "01K8BW43NZXA5C24GC08WJBB9G" },
  { id: "eE2xCG6H", page: "nested (async path)", embed: null }
];

async function main() {
  mkdirSync(outDir, { recursive: true });
  const all = { fetched_at: new Date().toISOString(), forms: {} };

  for (const f of FORMS) {
    const res = await fetch(`https://api.typeform.com/forms/${f.id}`);
    if (!res.ok) {
      console.error(`Failed ${f.id}: ${res.status}`);
      continue;
    }
    const data = await res.json();
    all.forms[f.id] = { meta: f, definition: data };
    writeFileSync(resolve(outDir, `${f.id}.json`), JSON.stringify(data, null, 2));
    console.error(`Saved ${f.id} (${data.title})`);
  }

  writeFileSync(resolve(outDir, "all-forms.json"), JSON.stringify(all, null, 2));
  console.error(`Done → ${outDir}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
