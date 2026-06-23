/** Canonical SAT bands for Georgia flagship guides — SSOT: lib/plan-b/school-catalog-data.ts */

import { getCatalogSchool } from "@/lib/plan-b/school-catalog";

export type FlagshipSchoolId = "uga" | "georgia-tech" | "emory";

export type FlagshipScoreBand = {
  id: FlagshipSchoolId;
  name: string;
  composite25: number;
  composite50: number;
  composite75: number;
  mathShareAt75?: number;
  rw75?: number;
  math75?: number;
  sectionNote?: string;
  sourceLabel: string;
  sourceUrl: string;
  dataAsOf: string;
  testPolicyNote?: string;
};

function catalogToFlagship(id: FlagshipSchoolId): FlagshipScoreBand {
  const row = getCatalogSchool(id);
  if (!row || row.composite25 == null || row.composite75 == null) {
    throw new Error(`Flagship catalog row incomplete: ${id}`);
  }
  const extra =
    id === "georgia-tech"
      ? {
          mathShareAt75: 0.53 as const,
          sectionNote: "STEM-heavy admits often show strong Math bands.",
          testPolicyNote: undefined,
        }
      : id === "emory"
        ? {
            rw75: 770,
            math75: 790,
            mathShareAt75: 0.51 as const,
            sectionNote:
              "Section bands for submitters: R&W roughly 740–770, Math roughly 760–800.",
            testPolicyNote:
              "Emory has been test-optional; these ranges reflect students who chose to submit SAT scores.",
          }
        : {
            mathShareAt75: 0.5 as const,
            testPolicyNote:
              "SAT mid-range for admits where the SAT was the strongest or only test submitted.",
          };

  return {
    id,
    name: row.name,
    composite25: row.composite25,
    composite50: row.composite50,
    composite75: row.composite75,
    sourceLabel: row.sourceLabel,
    sourceUrl: row.sourceUrl,
    dataAsOf: row.dataAsOf,
    ...extra,
  };
}

export function getFlagshipSchool(id: FlagshipSchoolId): FlagshipScoreBand {
  return catalogToFlagship(id);
}

export const georgiaFlagshipScores: FlagshipScoreBand[] = (
  ["uga", "georgia-tech", "emory"] as FlagshipSchoolId[]
).map(getFlagshipSchool);

export function scoreGapToPercentile(
  currentScore: number,
  school: FlagshipScoreBand
): "below_25th" | "in_range" | "above_75th" {
  if (currentScore < school.composite25) return "below_25th";
  if (currentScore > school.composite75) return "above_75th";
  return "in_range";
}
