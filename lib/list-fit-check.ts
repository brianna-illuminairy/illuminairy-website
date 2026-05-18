import {
  georgiaFlagshipScores,
  getFlagshipSchool,
  scoreGapToPercentile,
  type FlagshipSchoolId,
  type FlagshipScoreBand
} from "@/lib/georgia-flagship-scores";

export type StandoutHook = "not_sure" | "no" | "yes";

export type BandPosition = "below_25th" | "in_range" | "above_75th";

export type SatSectionScores = {
  total: number;
  readingWriting: number;
  math: number;
};

export type SatScoreTargets = {
  composite: number;
  readingWriting: number;
  math: number;
  basis: "75th_submitters" | "50th_submitters";
  schoolName: string;
  schoolId: FlagshipSchoolId;
};

export type ListFitSchoolResult = {
  school: FlagshipScoreBand;
  position: BandPosition;
  pointsTo25th: number;
  pointsTo50th: number;
  pointsTo75th: number;
  competitiveTarget: "75th" | "50th";
  sectionTargets: SatSectionScores;
};

export type ListFitReport = {
  gpaSummary: string;
  current: SatSectionScores;
  primaryTargets: SatScoreTargets;
  gaps: {
    composite: number;
    readingWriting: number;
    math: number;
  };
  perSchool: ListFitSchoolResult[];
};

export type ListFitInput = {
  unweightedGpa?: number;
  weightedGpa?: number;
  satTotal: number;
  satReadingWriting?: number;
  satMath?: number;
  schoolIds: FlagshipSchoolId[];
  standoutHook: StandoutHook;
};

export function pointsToThreshold(
  currentScore: number,
  school: FlagshipScoreBand,
  threshold: "25" | "50" | "75"
): number {
  const target =
    threshold === "25"
      ? school.composite25
      : threshold === "50"
        ? school.composite50
        : school.composite75;
  return Math.max(0, target - currentScore);
}

export function competitiveTargetBand(
  standoutHook: StandoutHook
): "75th" | "50th" {
  if (standoutHook === "yes") return "50th";
  return "75th";
}

/** Round to nearest 10 — SAT section scores are reported in tens */
export function roundSatSection(score: number): number {
  return Math.min(800, Math.max(200, Math.round(score / 10) * 10));
}

export function sectionTargetsForSchool(
  school: FlagshipScoreBand,
  basis: "75th" | "50th",
  current?: Pick<SatSectionScores, "readingWriting" | "math">
): SatSectionScores {
  const composite =
    basis === "75th" ? school.composite75 : school.composite50;

  if (school.rw75 != null && school.math75 != null && basis === "75th") {
    return {
      total: composite,
      readingWriting: school.rw75,
      math: school.math75
    };
  }

  const mathShare = school.mathShareAt75 ?? 0.5;
  let math = roundSatSection(composite * mathShare);
  let rw = composite - math;

  if (rw > 800) {
    rw = 800;
    math = composite - rw;
  }
  if (math > 800) {
    math = 800;
    rw = composite - math;
  }
  rw = roundSatSection(rw);
  math = roundSatSection(math);

  if (current && current.readingWriting > 0 && current.math > 0) {
    const totalCurrent = current.readingWriting + current.math;
    const rwShare = current.readingWriting / totalCurrent;
    rw = roundSatSection(composite * rwShare);
    math = composite - rw;
    if (math > 800) {
      math = 800;
      rw = composite - math;
    }
    math = roundSatSection(math);
  }

  return {
    total: composite,
    readingWriting: rw,
    math
  };
}

export function normalizeSatInput(input: ListFitInput): SatSectionScores {
  const total = clampSatTotal(input.satTotal);
  const rw = input.satReadingWriting;
  const math = input.satMath;

  if (
    rw != null &&
    math != null &&
    rw >= 200 &&
    math >= 200 &&
    Math.abs(rw + math - total) <= 30
  ) {
    return {
      total,
      readingWriting: rw,
      math
    };
  }

  return {
    total,
    readingWriting: Math.round(total / 2),
    math: total - Math.round(total / 2)
  };
}

function clampSatTotal(total: number): number {
  return Math.min(1600, Math.max(400, Math.round(total)));
}

export function gpaSummaryText(
  unweightedGpa?: number,
  weightedGpa?: number
): string {
  const uw = unweightedGpa;
  if (uw == null || Number.isNaN(uw)) {
    return "Add GPA to see how it fits with the score targets below. Junior-year GPA is hard to change this summer — the SAT is still movable before August.";
  }

  const w =
    weightedGpa != null && !Number.isNaN(weightedGpa)
      ? ` (${weightedGpa.toFixed(2)} weighted)`
      : "";

  if (uw >= 3.9) {
    return `A ${uw.toFixed(2)} unweighted GPA${w} is strong for this list. Many families in your position focus the summer on raising SAT scores into the upper band below — not retaking classes.`;
  }
  if (uw >= 3.5) {
    return `A ${uw.toFixed(2)} unweighted GPA${w} is solid. Pairing it with SAT scores in the upper band below is how many competitive applicants present — still not a guarantee of admission.`;
  }
  return `A ${uw.toFixed(2)} unweighted GPA${w} may be a headwind at the most selective schools on your list. A stronger SAT helps, but admissions also weighs rigor, essays, and fit — we can't promise outcomes from GPA and test scores alone.`;
}

export function strictestSchoolAmong(
  schoolIds: FlagshipSchoolId[],
  basis: "75th" | "50th"
): FlagshipScoreBand {
  const schools = schoolIds.map((id) => getFlagshipSchool(id));
  return schools.reduce((a, b) => {
    const aScore = basis === "75th" ? a.composite75 : a.composite50;
    const bScore = basis === "75th" ? b.composite75 : b.composite50;
    return bScore > aScore ? b : a;
  });
}

export function evaluateSchool(
  current: SatSectionScores,
  schoolId: FlagshipSchoolId,
  standoutHook: StandoutHook = "not_sure"
): ListFitSchoolResult {
  const school = getFlagshipSchool(schoolId);
  const basis = competitiveTargetBand(standoutHook);
  const position = scoreGapToPercentile(current.total, school);
  const sectionTargets = sectionTargetsForSchool(school, basis, current);

  return {
    school,
    position,
    pointsTo25th: pointsToThreshold(current.total, school, "25"),
    pointsTo50th: pointsToThreshold(current.total, school, "50"),
    pointsTo75th: pointsToThreshold(current.total, school, "75"),
    competitiveTarget: basis,
    sectionTargets
  };
}

export function buildListFitReport(input: ListFitInput): ListFitReport | null {
  if (!input.schoolIds.length) return null;

  const standoutHook = input.standoutHook;
  const basis = competitiveTargetBand(standoutHook);
  const current = normalizeSatInput(input);
  const strictest = strictestSchoolAmong(input.schoolIds, basis);
  const targetSections = sectionTargetsForSchool(strictest, basis, current);

  const primaryTargets: SatScoreTargets = {
    composite: targetSections.total,
    readingWriting: targetSections.readingWriting,
    math: targetSections.math,
    basis: basis === "75th" ? "75th_submitters" : "50th_submitters",
    schoolName: strictest.name,
    schoolId: strictest.id
  };

  const perSchool = input.schoolIds.map((id) =>
    evaluateSchool(current, id, standoutHook)
  );

  return {
    gpaSummary: gpaSummaryText(input.unweightedGpa, input.weightedGpa),
    current,
    primaryTargets,
    gaps: {
      composite: Math.max(0, primaryTargets.composite - current.total),
      readingWriting: Math.max(
        0,
        primaryTargets.readingWriting - current.readingWriting
      ),
      math: Math.max(0, primaryTargets.math - current.math)
    },
    perSchool
  };
}

export function positionLabel(position: BandPosition): string {
  switch (position) {
    case "below_25th":
      return "Below the middle 50% of students who submitted SAT scores";
    case "in_range":
      return "Within the published middle 50% for submitters";
    case "above_75th":
      return "Above the 75th percentile for submitters";
  }
}

export function competitiveFraming(
  position: BandPosition,
  standoutHook: StandoutHook
): string {
  if (position === "below_25th") {
    return "SAT is a headwind for this school — raising the score is one of the few levers still open before August.";
  }
  if (position === "in_range") {
    return "This does not mean accepted. It means the score looks like many other applicants — easy to blend in unless something else really sets them apart.";
  }
  if (standoutHook === "yes") {
    return "A recruited sport or similar edge can matter — but the SAT still signals academic readiness. Use bands as context, not as a reason to stop improving.";
  }
  return "More competitive on test scores — still not a guarantee; holistic review always applies.";
}

export function targetBasisLabel(basis: SatScoreTargets["basis"]): string {
  return basis === "75th_submitters"
    ? "upper 25% of students who submitted SATs (75th percentile)"
    : "middle of students who submitted SATs (50th percentile)";
}
