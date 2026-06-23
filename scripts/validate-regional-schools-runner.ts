/**
 * CI guard: every state + DC gets 3–6 schools, correct inState flags, sparse exception rules.
 * Run: npm run plan-b:validate-regional-schools
 */

import { buildRegionalMarket, MARKET_LIMITS } from "@/lib/plan-b/build-regional-market";
import { runBuildRegionalMarketTests } from "@/lib/plan-b/build-regional-market.test";
import { getCatalogSchool } from "@/lib/plan-b/school-catalog";
import { US_STATE_CODES, type UsStateCode } from "@/lib/plan-b/us-states";
import {
  regionIdFromZip,
  regionalMarketForZip,
} from "@/lib/quiz-funnel-b/regional-schools";

const errors: string[] = [];

function validateState(stateCode: UsStateCode) {
  const market = buildRegionalMarket(stateCode);
  const { schools } = market;

  if (schools.length < MARKET_LIMITS.MIN_OPTIONS || schools.length > MARKET_LIMITS.MAX_TOTAL) {
    errors.push(
      `${stateCode}: expected ${MARKET_LIMITS.MIN_OPTIONS}-${MARKET_LIMITS.MAX_TOTAL} schools, got ${schools.length}`
    );
    return;
  }

  const ids = new Set<string>();
  for (const row of schools) {
    if (ids.has(row.id)) {
      errors.push(`${stateCode}: duplicate id ${row.id}`);
    }
    ids.add(row.id);

    const catalog = getCatalogSchool(row.id);
    if (!catalog) {
      errors.push(`${stateCode}: unknown catalog id ${row.id}`);
      continue;
    }

    const expectedInState = catalog.state === stateCode;
    if (row.inState !== expectedInState) {
      errors.push(
        `${stateCode}: ${row.name} inState=${row.inState}, expected ${expectedInState}`
      );
    }
  }

  const belowMin = schools.filter((s) => {
    const c = getCatalogSchool(s.id);
    return c && c.composite50 < MARKET_LIMITS.SAT_MIN;
  });

  if (belowMin.length > 1) {
    errors.push(`${stateCode}: more than one sub-${MARKET_LIMITS.SAT_MIN} exception`);
  }
  if (belowMin.length === 1 && !belowMin[0]!.inState) {
    errors.push(`${stateCode}: sub-${MARKET_LIMITS.SAT_MIN} exception must be in-state`);
  }
}

for (const code of US_STATE_CODES) {
  validateState(code);
}

for (const fail of runBuildRegionalMarketTests()) {
  if (!fail.ok) errors.push(fail.message);
}

const zipSpots: Array<[string, string]> = [
  ["78701", "texas"],
  ["30301", "georgia"],
  ["74101", "oklahoma"],
  ["33101", "florida"],
  ["82001", "wyoming"],
  ["20001", "dc"],
];

for (const [zip, expectedSlug] of zipSpots) {
  const slug = regionIdFromZip(zip);
  if (slug !== expectedSlug) {
    errors.push(`zip ${zip}: regionId ${slug}, expected ${expectedSlug}`);
  }
  const market = regionalMarketForZip(zip);
  if (market.schools.length < MARKET_LIMITS.MIN_OPTIONS) {
    errors.push(`zip ${zip}: only ${market.schools.length} schools`);
  }
}

if (errors.length > 0) {
  console.error("validate-regional-schools FAILED\n");
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

console.log(`validate-regional-schools passed (${US_STATE_CODES.length} markets + zip spot-checks)`);

for (const code of ["WY", "OK", "DC", "GA"] as UsStateCode[]) {
  const m = buildRegionalMarket(code);
  console.log(
    `\n${m.label} (${m.id}): ${m.schools.map((s) => `${s.name}${s.inState ? " [in]" : ""}`).join(" · ")}`
  );
}
