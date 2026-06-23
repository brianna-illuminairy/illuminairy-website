import {
  SCHOOL_CATALOG_ENTRIES,
  type CatalogSchool,
} from "@/lib/plan-b/school-catalog-data";

export type { CatalogSchool };

export const SAT_MIN_COMPOSITE = 1200;

export const SCHOOL_CATALOG: CatalogSchool[] = SCHOOL_CATALOG_ENTRIES;

const byId = new Map(SCHOOL_CATALOG.map((s) => [s.id, s]));

export function getCatalogSchool(id: string): CatalogSchool | undefined {
  return byId.get(id);
}

export function schoolsInState(state: string): CatalogSchool[] {
  return SCHOOL_CATALOG.filter((s) => s.state === state).sort(
    (a, b) => b.composite50 - a.composite50
  );
}

export function schoolsInStates(states: string[]): CatalogSchool[] {
  const set = new Set(states);
  return SCHOOL_CATALOG.filter((s) => set.has(s.state)).sort(
    (a, b) => b.composite50 - a.composite50
  );
}

export function topSchoolsNationwide(limit: number, excludeIds: Set<string>): CatalogSchool[] {
  return SCHOOL_CATALOG.filter((s) => !excludeIds.has(s.id))
    .sort((a, b) => b.composite50 - a.composite50)
    .slice(0, limit);
}

export function catalogSchoolCount(): number {
  return SCHOOL_CATALOG.length;
}
