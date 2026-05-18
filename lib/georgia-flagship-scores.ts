/** Canonical SAT bands for Georgia flagship guides — keep in sync with docs/seo-georgia-parent-icp.md */

export type FlagshipSchoolId = "uga" | "georgia-tech" | "emory";

export type FlagshipScoreBand = {
  id: FlagshipSchoolId;
  name: string;
  composite25: number;
  composite50: number;
  composite75: number;
  /** Share of composite at 75th attributed to Math (rest = R&W). Used when section scores not published. */
  mathShareAt75?: number;
  /** Published or derived section targets at 75th for submitters */
  rw75?: number;
  math75?: number;
  sectionNote?: string;
  sourceLabel: string;
  sourceUrl: string;
  dataAsOf: string;
  testPolicyNote?: string;
};

export function getFlagshipSchool(id: FlagshipSchoolId): FlagshipScoreBand {
  const school = georgiaFlagshipScores.find((s) => s.id === id);
  if (!school) {
    throw new Error(`Unknown flagship school: ${id}`);
  }
  return school;
}

export const georgiaFlagshipScores: FlagshipScoreBand[] = [
  {
    id: "uga",
    name: "University of Georgia",
    composite25: 1360,
    composite50: 1430,
    composite75: 1500,
    mathShareAt75: 0.5,
    sourceLabel: "UGA Admissions blog — Class of 2026 admitted students",
    sourceUrl:
      "https://admissions.uga.edu/blog/2026-final-freshman-admit-decisions/",
    dataAsOf: "March 2026",
    testPolicyNote:
      "SAT mid-range for admits where the SAT was the strongest or only test submitted."
  },
  {
    id: "georgia-tech",
    name: "Georgia Tech",
    composite25: 1370,
    composite50: 1460,
    composite75: 1530,
    mathShareAt75: 0.53,
    sectionNote: "STEM-heavy admits often show strong Math bands.",
    sourceLabel: "Georgia Tech Common Data Set 2024–25",
    sourceUrl:
      "https://irp.gatech.edu/files/CDS/CDS_2024-2025_FINAL_20FEB2025.pdf",
    dataAsOf: "2024–25 cycle"
  },
  {
    id: "emory",
    name: "Emory University (Emory College)",
    composite25: 1480,
    composite50: 1510,
    composite75: 1540,
    rw75: 770,
    math75: 790,
    mathShareAt75: 0.51,
    sectionNote:
      "Section bands for submitters: R&W roughly 740–770, Math roughly 760–800.",
    sourceLabel: "Emory University — Admitted Students, Class of 2029",
    sourceUrl:
      "https://apply.emory.edu/discover/about/first-year.html",
    dataAsOf: "Fall 2025 enrollment",
    testPolicyNote:
      "Emory has been test-optional; these ranges reflect students who chose to submit SAT scores."
  }
];

export function scoreGapToPercentile(
  currentScore: number,
  school: FlagshipScoreBand
): "below_25th" | "in_range" | "above_75th" {
  if (currentScore < school.composite25) return "below_25th";
  if (currentScore > school.composite75) return "above_75th";
  return "in_range";
}
