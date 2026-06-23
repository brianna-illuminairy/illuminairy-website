import {
  SAT_MIN_COMPOSITE,
  schoolsInState,
  topSchoolsNationwide,
  type CatalogSchool,
} from "@/lib/plan-b/school-catalog";
import {
  borderingStates,
  ring2States,
} from "@/lib/plan-b/state-neighbors";
import {
  isUsStateCode,
  stateCodeFromSlug,
  stateLabel,
  stateSlugFromCode,
  type UsStateCode,
} from "@/lib/plan-b/us-states";

export type RegionalMarketSchool = {
  id: string;
  name: string;
  inState: boolean;
};

export type BuiltRegionalMarket = {
  id: string;
  label: string;
  schools: RegionalMarketSchool[];
};

export const MARKET_LIMITS = {
  SAT_MIN: SAT_MIN_COMPOSITE,
  MAX_IN_STATE: 4,
  MAX_REGIONAL: 3,
  TOP_SCHOOLS_PER_NEIGHBOR: 2,
  MAX_TOTAL: 6,
  MIN_OPTIONS: 3,
} as const;

function meetsSatMin(school: CatalogSchool): boolean {
  return school.composite50 >= MARKET_LIMITS.SAT_MIN;
}

function toOption(school: CatalogSchool, marketState: UsStateCode): RegionalMarketSchool {
  return {
    id: school.id,
    name: school.name,
    inState: school.state === marketState,
  };
}

function pickInState(stateCode: UsStateCode): CatalogSchool[] {
  const inStateAll = schoolsInState(stateCode);
  const eligible = inStateAll.filter(meetsSatMin);
  let picks = eligible.slice(0, MARKET_LIMITS.MAX_IN_STATE);

  if (picks.length < 2 && inStateAll.length > 0) {
    const topInState = inStateAll[0];
    if (topInState && !picks.some((p) => p.id === topInState.id)) {
      picks = [topInState, ...picks.filter((p) => p.id !== topInState.id)].slice(
        0,
        MARKET_LIMITS.MAX_IN_STATE
      );
    }
  }

  return picks;
}


/** Top N schools per bordering state, then best picks from that combined list. */
function pickRegionalFromNeighbors(
  stateCode: UsStateCode,
  exclude: Set<string>,
  limit: number
): CatalogSchool[] {
  const candidates: CatalogSchool[] = [];

  for (const neighbor of borderingStates(stateCode)) {
    const topInNeighbor = schoolsInState(neighbor)
      .filter((s) => !exclude.has(s.id) && meetsSatMin(s))
      .slice(0, MARKET_LIMITS.TOP_SCHOOLS_PER_NEIGHBOR);
    candidates.push(...topInNeighbor);
  }

  candidates.sort((a, b) => b.composite50 - a.composite50);

  const picks: CatalogSchool[] = [];
  const seen = new Set<string>();
  for (const school of candidates) {
    if (seen.has(school.id)) continue;
    seen.add(school.id);
    picks.push(school);
    if (picks.length >= limit) break;
  }

  return picks;
}

/** Top 1 per state — used for ring-2 padding so thin markets still get geographic spread. */
function pickTopPerState(
  states: UsStateCode[],
  exclude: Set<string>,
  limit: number
): CatalogSchool[] {
  const candidates: CatalogSchool[] = [];

  for (const state of states) {
    const top = schoolsInState(state)
      .filter((s) => !exclude.has(s.id) && meetsSatMin(s))
      .slice(0, 1);
    candidates.push(...top);
  }

  candidates.sort((a, b) => b.composite50 - a.composite50);
  return candidates.slice(0, limit);
}

function mergeUnique(existing: CatalogSchool[], more: CatalogSchool[]): CatalogSchool[] {
  const map = new Map<string, CatalogSchool>();
  for (const s of existing) map.set(s.id, s);
  for (const s of more) {
    if (!map.has(s.id)) map.set(s.id, s);
  }
  return Array.from(map.values());
}

function padPools(
  stateCode: UsStateCode,
  inStatePicks: CatalogSchool[],
  regionalPicks: CatalogSchool[]
): CatalogSchool[] {
  let combined = mergeUnique(inStatePicks, regionalPicks);
  const ids = () => new Set(combined.map((s) => s.id));

  if (combined.length < MARKET_LIMITS.MIN_OPTIONS) {
    combined = mergeUnique(
      combined,
      pickTopPerState(ring2States(stateCode), ids(), MARKET_LIMITS.MAX_TOTAL)
    );
  }
  if (combined.length < MARKET_LIMITS.MIN_OPTIONS) {
    combined = mergeUnique(
      combined,
      topSchoolsNationwide(MARKET_LIMITS.MAX_TOTAL, ids())
    );
  }

  if (combined.length < MARKET_LIMITS.MAX_TOTAL) {
    combined = mergeUnique(
      combined,
      pickRegionalFromNeighbors(stateCode, ids(), MARKET_LIMITS.MAX_TOTAL - combined.length)
    );
  }
  if (combined.length < MARKET_LIMITS.MAX_TOTAL) {
    combined = mergeUnique(
      combined,
      pickTopPerState(ring2States(stateCode), ids(), MARKET_LIMITS.MAX_TOTAL - combined.length)
    );
  }
  if (combined.length < MARKET_LIMITS.MAX_TOTAL) {
    combined = mergeUnique(
      combined,
      topSchoolsNationwide(MARKET_LIMITS.MAX_TOTAL, ids())
    );
  }

  return combined.slice(0, MARKET_LIMITS.MAX_TOTAL);
}

export function buildRegionalMarket(stateCode: UsStateCode): BuiltRegionalMarket {
  const inStatePicks = pickInState(stateCode);
  const exclude = new Set(inStatePicks.map((s) => s.id));

  const regionalPicks = pickRegionalFromNeighbors(
    stateCode,
    exclude,
    MARKET_LIMITS.MAX_REGIONAL
  );

  const combined = padPools(stateCode, inStatePicks, regionalPicks);

  return {
    id: stateSlugFromCode(stateCode),
    label: stateLabel(stateCode),
    schools: combined.map((s) => toOption(s, stateCode)),
  };
}

export function buildRegionalMarketFromRegionId(regionId: string): BuiltRegionalMarket | null {
  const code = stateCodeFromSlug(regionId.trim().toLowerCase());
  if (!code || !isUsStateCode(code)) return null;
  return buildRegionalMarket(code);
}
