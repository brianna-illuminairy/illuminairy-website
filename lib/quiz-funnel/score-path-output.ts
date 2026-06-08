/**
 * Score Path output resolver — single source for preview vs prescription,
 * known vs inferred vs missing inputs. See growth/score-path-edge-cases.md
 */

import { funnelToday } from "@/lib/funnel-today";
import {
  hasKnownStartingScore,
  hasTargetScore,
  hasScheduledTestDate,
  Q4_BAND_TO_SCORE,
  Q8_TARGET_SCORE,
  Q4_NO_SCORE,
  SCORE_PATH_DEFAULT_START,
  SCORE_PATH_DEFAULT_START_BAND,
  SCORE_PATH_DEFAULT_WEEKS,
  SCORE_PATH_DEFAULT_GAIN,
  clampSatScore,
  q5DisplayLabel
} from "@/lib/quiz-funnel/quiz-profile";
import {
  weeksUntilQ5Test,
  shouldShowGainMath,
  MIN_WEEKS_FOR_GAIN_MATH
} from "@/lib/quiz-funnel/gains";
import {
  buildWeeklyGainCurve,
  modeledGainForTimeline,
  projectedGainBand
} from "@/lib/quiz-funnel/score-path-gain";
import { inferredStartFromGpa } from "@/lib/quiz-funnel/gpa-inferred-start";
import { isQuizSelfTaker } from "@/lib/quiz-funnel/subject-voice";

export type ScoreConfidence = "known" | "estimate" | "inferred" | "illustrative" | "missing";

export type ScorePathMode = "full" | "partial" | "illustrative" | "process_only";

export type QuizAnswersLike = {
  qWho?: string;
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
  q6?: string[];
  q7?: string[];
  q8?: string;
  q9?: string;
};

export type TestDateStatus = "scheduled" | "tbd";

export type ChartWeeksSource = "q5" | "default_16";

/** Illustrative starting score when q4 = na (see quiz-profile SCORE_PATH_DEFAULT_START). */
export { SCORE_PATH_DEFAULT_START, SCORE_PATH_DEFAULT_START_BAND, SCORE_PATH_DEFAULT_WEEKS, SCORE_PATH_DEFAULT_GAIN } from "@/lib/quiz-funnel/quiz-profile";

/** Illustrative target mid when q8 = tbd (stakes-based). */
const STAKES_INFERRED_TARGET_MID: Record<string, number> = {
  merit: 1425,
  "top-choice": 1425,
  selective: 1375,
  "app-rounds": 1375,
  early: 1375
};

const STAKES_INFERRED_TARGET_LABEL: Record<string, string> = {
  merit: "1400–1450",
  "top-choice": "1400–1450",
  selective: "1350–1400",
  "app-rounds": "1350–1400",
  early: "1350–1400"
};

export type ResolvedScore = {
  value: number | null;
  confidence: ScoreConfidence;
  label: string;
  bandLabel: string | null;
};

export type ScorePathOutput = {
  mode: ScorePathMode;
  /** q3 = none — no official SAT yet */
  isFirstOfficialSit: boolean;
  testDateStatus: TestDateStatus;
  hasScheduledTestDate: boolean;
  /** “By Oct 3…” vs “Over ~12 weeks…” */
  showDeadlineHeadline: boolean;
  showDateUrgency: boolean;
  showScoreChart: boolean;
  showGainMath: boolean;
  showPersonalLikelihood: boolean;

  starting: ResolvedScore;
  target: ResolvedScore;

  chartWeeks: number;
  chartWeeksSource: ChartWeeksSource;
  testDateLabel: string | null;

  rawGap: number | null;
  modeledGain: number | null;
  gainBand: { low: number; typical: number; high: number } | null;

  scoreRange: {
    low: number | null;
    typical: number | null;
    high: number | null;
  };

  flags: {
    targetAtOrBelowCurrent: boolean;
    gapExceedsModeledGain: boolean;
    shortRunway: boolean;
    pastTestDate: boolean;
  };

  disclaimers: string[];
  callHooks: string[];
};

function resolveStarting(q3?: string, q4?: string, q9?: string): ResolvedScore {
  const firstSit = q3 === "none";
  const psatOnly = q3 === "psat-only";

  if (hasKnownStartingScore(q4)) {
    const value = Q4_BAND_TO_SCORE[q4!];
    if (firstSit) {
      return {
        value,
        confidence: "estimate",
        label: String(value),
        bandLabel: q4!
      };
    }
    if (psatOnly) {
      return {
        value,
        confidence: "estimate",
        label: String(value),
        bandLabel: q4!
      };
    }
    return {
      value,
      confidence: "known",
      label: String(value),
      bandLabel: q4!
    };
  }

  if (q4 === Q4_NO_SCORE || !q4) {
    const fromGpa = inferredStartFromGpa(q9);
    if (fromGpa != null) {
      return {
        value: fromGpa,
        confidence: "inferred",
        label: `~${fromGpa}`,
        bandLabel: `${fromGpa} (from GPA)`
      };
    }
    return {
      value: SCORE_PATH_DEFAULT_START,
      confidence: "inferred",
      label: `~${SCORE_PATH_DEFAULT_START}`,
      bandLabel: SCORE_PATH_DEFAULT_START_BAND
    };
  }

  return {
    value: null,
    confidence: "missing",
    label: "TBD",
    bandLabel: null
  };
}

function resolveTarget(q8?: string, q2?: string): ResolvedScore {
  if (hasTargetScore(q8)) {
    const value = Q8_TARGET_SCORE[q8!];
    return {
      value,
      confidence: "known",
      label: String(value),
      bandLabel: q8!
    };
  }

  if (q8 === "tbd" || !q8) {
    const stakes = q2 ?? "selective";
    const mid = STAKES_INFERRED_TARGET_MID[stakes] ?? 1350;
    const band = STAKES_INFERRED_TARGET_LABEL[stakes] ?? "1300–1400";
    return {
      value: mid,
      confidence: "inferred",
      label: `~${mid}`,
      bandLabel: band
    };
  }

  return {
    value: null,
    confidence: "missing",
    label: "TBD",
    bandLabel: null
  };
}

function resolveMode(
  q4: string | undefined,
  q8: string | undefined,
  starting: ResolvedScore,
  target: ResolvedScore
): ScorePathMode {
  if (q4 === Q4_NO_SCORE && q8 === "tbd") {
    return "process_only";
  }
  if (starting.confidence === "known" && target.confidence === "known") {
    return "full";
  }
  if (starting.confidence === "estimate" && target.confidence === "known") {
    return "illustrative";
  }
  if (starting.confidence === "missing" || target.confidence === "missing") {
    return "partial";
  }
  return "illustrative";
}

function resolveTestTimeline(q5?: string, today = funnelToday()) {
  const weeksRaw = weeksUntilQ5Test(q5, today);
  const pastTestDate = weeksRaw != null && weeksRaw <= 0;
  const scheduled = hasScheduledTestDate(q5) && !pastTestDate;

  if (scheduled && weeksRaw != null && weeksRaw > 0) {
    return {
      testDateStatus: "scheduled" as const,
      hasScheduledTestDate: true,
      chartWeeks: weeksRaw,
      chartWeeksSource: "q5" as const,
      pastTestDate,
      shortRunway: weeksRaw < MIN_WEEKS_FOR_GAIN_MATH
    };
  }

  return {
    testDateStatus: "tbd" as const,
    hasScheduledTestDate: false,
    chartWeeks: SCORE_PATH_DEFAULT_WEEKS,
    chartWeeksSource: "default_16" as const,
    pastTestDate,
    shortRunway: false
  };
}

/** Personal likelihood — omit without scheduled date, baseline, or full inputs. */
export function shouldShowPersonalLikelihood(
  output: Pick<
    ScorePathOutput,
    | "mode"
    | "modeledGain"
    | "flags"
    | "hasScheduledTestDate"
    | "isFirstOfficialSit"
  >
): boolean {
  if (!output.hasScheduledTestDate) return false;
  if (output.isFirstOfficialSit) return false;
  if (output.mode === "process_only" || output.mode === "partial") return false;
  if (output.modeledGain == null || output.modeledGain < 50) return false;
  if (output.flags.shortRunway || output.flags.pastTestDate) return false;
  if (output.flags.gapExceedsModeledGain) return false;
  return true;
}

export function buildScorePathOutput(
  answers: QuizAnswersLike,
  today = funnelToday()
): ScorePathOutput {
  const { q2, q3, q4, q5, q6, q7, q8, q9, qWho } = answers;
  const self = isQuizSelfTaker(qWho);

  const isFirstOfficialSit = q3 === "none";
  const starting = resolveStarting(q3, q4, q9);
  const target = resolveTarget(q8, q2);
  const mode = resolveMode(q4, q8, starting, target);

  const timeline = resolveTestTimeline(q5, today);
  const {
    testDateStatus,
    hasScheduledTestDate: hasDate,
    chartWeeks,
    chartWeeksSource,
    pastTestDate,
    shortRunway
  } = timeline;

  const showGainMath = shouldShowGainMath(q5, today) && !pastTestDate;

  let rawGap: number | null = null;
  if (starting.value != null && target.value != null) {
    rawGap = Math.max(0, target.value - starting.value);
  }

  const targetAtOrBelowCurrent =
    starting.value != null &&
    target.value != null &&
    target.value <= starting.value;

  let modeledGain: number | null = null;
  if (rawGap != null && rawGap > 0 && showGainMath) {
    modeledGain = modeledGainForTimeline(
      rawGap,
      hasDate ? chartWeeks : null
    );
    if (!hasDate && modeledGain != null) {
      modeledGain = Math.min(modeledGain, SCORE_PATH_DEFAULT_GAIN);
    }
  } else if (targetAtOrBelowCurrent && showGainMath) {
    modeledGain = Math.min(80, projectedGainBand(chartWeeks).typical);
  }

  const gainBand =
    showGainMath && modeledGain != null
      ? projectedGainBand(chartWeeks)
      : null;

  const gapExceedsModeledGain =
    rawGap != null &&
    modeledGain != null &&
    rawGap > modeledGain &&
    !targetAtOrBelowCurrent;

  let scoreRange = { low: null as number | null, typical: null as number | null, high: null as number | null };
  if (starting.value != null && modeledGain != null && gainBand) {
    const cap = rawGap ?? modeledGain;
    scoreRange = {
      low: clampSatScore(starting.value + Math.min(cap, gainBand.low)),
      typical: clampSatScore(starting.value + modeledGain),
      high: clampSatScore(starting.value + Math.min(cap, gainBand.high)),
    };
  } else if (starting.value != null && modeledGain != null) {
    scoreRange = {
      low: null,
      typical: clampSatScore(starting.value + modeledGain),
      high: null,
    };
  }

  const showScoreChart =
    mode !== "process_only" &&
    showGainMath &&
    starting.value != null &&
    (modeledGain != null || targetAtOrBelowCurrent);

  const disclaimers: string[] = [];
  if (isFirstOfficialSit) {
    disclaimers.push(
      self
        ? "No official SAT yet. The Skill Diagnostic sets your real starting score before the first test."
        : "No official SAT yet. The Skill Diagnostic sets their real starting score before the first test."
    );
  } else if (q3 === "psat-only") {
    disclaimers.push(
      self
        ? "PSAT is a rough signal. The Skill Diagnostic confirms where you stand for the official SAT."
        : "PSAT is a rough signal. The Skill Diagnostic confirms where they stand for the official SAT."
    );
  }
  if (starting.confidence === "estimate") {
    disclaimers.push(
      "Starting score is your best estimate. The Skill Diagnostic replaces this with a measured baseline."
    );
  }
  if (starting.confidence === "inferred") {
    disclaimers.push(
      "Starting score assumed ~1100 (typical for students without an official SAT yet). The Skill Diagnostic sets the real baseline."
    );
  }
  if (starting.confidence === "missing") {
    disclaimers.push("Starting score TBD until the Skill Diagnostic.");
  }
  if (target.confidence === "inferred") {
    disclaimers.push(
      `Target range (${target.bandLabel}) is typical for your stakes, confirmed on your SAT Strategy Call.`
    );
  }
  if (target.confidence === "missing") {
    disclaimers.push("Target score TBD. Set on your SAT Strategy Call.");
  }
  if (chartWeeksSource === "default_16") {
    disclaimers.push(
      "No test date yet. Chart shows a typical ~16-week window (~+250 pts illustrative), not a deadline."
    );
  }
  if (gapExceedsModeledGain && target.value != null && scoreRange.typical != null) {
    disclaimers.push(
      hasDate
        ? `Modeled gain may not reach ${target.label} by test day. Your SAT Strategy Call can adjust target or timeline.`
        : `Modeled +${modeledGain} may not close the full gap to ${target.label}. Your SAT Strategy Call sets date and runway.`
    );
  }

  const callHooks: string[] = [];
  if (!hasDate) {
    callHooks.push("Pick a test date and backwards-plan prep weeks");
  }
  if (isFirstOfficialSit || starting.confidence !== "known") {
    callHooks.push("Baseline Skill Diagnostic before first official SAT");
  }
  if (target.confidence !== "known") {
    callHooks.push("Confirm target score and timeline");
  }
    callHooks.push("Schedule Skill Diagnostic and review the Improvement Plan");

  void buildWeeklyGainCurve(chartWeeks);
  void q6;
  void q7;

  const output: ScorePathOutput = {
    mode,
    isFirstOfficialSit,
    testDateStatus,
    hasScheduledTestDate: hasDate,
    showDeadlineHeadline: hasDate,
    showDateUrgency: hasDate && !shortRunway && !pastTestDate,
    showScoreChart,
    showGainMath,
    showPersonalLikelihood: false,
    starting,
    target,
    chartWeeks,
    chartWeeksSource,
    testDateLabel: q5DisplayLabel(q5) ?? null,
    rawGap,
    modeledGain,
    gainBand,
    scoreRange,
    flags: {
      targetAtOrBelowCurrent,
      gapExceedsModeledGain,
      shortRunway,
      pastTestDate
    },
    disclaimers,
    callHooks
  };

  output.showPersonalLikelihood = shouldShowPersonalLikelihood(output);
  return output;
}
