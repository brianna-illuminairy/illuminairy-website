/**
 * Pure selection-logic checks — run via scripts/validate-regional-schools-runner.ts
 */

import {
  buildRegionalMarket,
  MARKET_LIMITS,
} from "@/lib/plan-b/build-regional-market";
import { getCatalogSchool } from "@/lib/plan-b/school-catalog";
import type { UsStateCode } from "@/lib/plan-b/us-states";

export type MarketTestResult = { ok: true } | { ok: false; message: string };

function assertMarket(stateCode: UsStateCode): MarketTestResult {
  const market = buildRegionalMarket(stateCode);
  const { schools } = market;

  if (schools.length < MARKET_LIMITS.MIN_OPTIONS || schools.length > MARKET_LIMITS.MAX_TOTAL) {
    return {
      ok: false,
      message: `${stateCode}: expected ${MARKET_LIMITS.MIN_OPTIONS}-${MARKET_LIMITS.MAX_TOTAL} schools, got ${schools.length}`,
    };
  }

  const ids = new Set<string>();
  for (const row of schools) {
    if (ids.has(row.id)) {
      return { ok: false, message: `${stateCode}: duplicate id ${row.id}` };
    }
    ids.add(row.id);

    const catalog = getCatalogSchool(row.id);
    if (!catalog) {
      return { ok: false, message: `${stateCode}: unknown catalog id ${row.id}` };
    }

    const expectedInState = catalog.state === stateCode;
    if (row.inState !== expectedInState) {
      return {
        ok: false,
        message: `${stateCode}: ${row.id} inState=${row.inState}, expected ${expectedInState}`,
      };
    }
  }

  const belowMin = schools.filter((s) => {
    const c = getCatalogSchool(s.id);
    return c && c.composite50 < MARKET_LIMITS.SAT_MIN;
  });

  if (belowMin.length > 1) {
    return {
      ok: false,
      message: `${stateCode}: more than one sub-${MARKET_LIMITS.SAT_MIN} school`,
    };
  }

  if (belowMin.length === 1 && !belowMin[0]!.inState) {
    return {
      ok: false,
      message: `${stateCode}: sub-${MARKET_LIMITS.SAT_MIN} school must be in-state`,
    };
  }

  return { ok: true };
}

export function runBuildRegionalMarketTests(): MarketTestResult[] {
  const edgeStates: UsStateCode[] = ["WY", "AK", "HI", "RI", "MS", "OK", "GA", "TX", "FL", "DC"];
  const failures = edgeStates.map(assertMarket).filter((r) => !r.ok);

  const ga = buildRegionalMarket("GA");
  const gaRegional = ga.schools.filter((s) => !s.inState);
  if (gaRegional.length === 0) {
    failures.push({ ok: false, message: "GA: expected regional picks from neighbors" });
  }

  return failures;
}
