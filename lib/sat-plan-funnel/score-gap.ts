import { SCORE_OPTIONS, type ScoreId } from "@/lib/sat-plan-funnel/score-options";
import {
  TARGET_SCORE_BAND_LABEL,
  TARGET_SCORE_OPTIONS,
  type TargetScoreId
} from "@/lib/sat-plan-funnel/target-score-options";

/** Upper bound of each recent-score band — conservative gap uses this as “current.” */
const SCORE_BAND_HIGH: Record<ScoreId, number> = {
  score_below_1000: 999,
  score_1000_1100: 1100,
  score_1100_1200: 1200,
  score_1200_1300: 1300,
  score_1300_plus: 1450
};

/** Lower bound of each target band — conservative gap uses this as “goal.” */
const TARGET_BAND_LOW: Record<Exclude<TargetScoreId, "target_not_sure">, number> = {
  target_1200_1300: 1200,
  target_1300_1400: 1300,
  target_1400_1500: 1400,
  target_1500_plus: 1500
};

/** Midpoint estimates for chart labels. */
const SCORE_BAND_MID: Record<ScoreId, number> = {
  score_below_1000: 950,
  score_1000_1100: 1050,
  score_1100_1200: 1150,
  score_1200_1300: 1250,
  score_1300_plus: 1375
};

const TARGET_BAND_MID: Record<Exclude<TargetScoreId, "target_not_sure">, number> = {
  target_1200_1300: 1250,
  target_1300_1400: 1350,
  target_1400_1500: 1450,
  target_1500_plus: 1525
};

const DEFAULT_GAP_PTS = 150;
const DEFAULT_CHART_CURRENT = 1100;
const DEFAULT_CHART_TARGET = 1350;

function isScoreId(id?: string): id is ScoreId {
  return SCORE_OPTIONS.some((row) => row.id === id);
}

function isTargetId(id?: string): id is TargetScoreId {
  return TARGET_SCORE_OPTIONS.some((row) => row.id === id);
}

/**
 * Conservative point gap: target band floor minus current band ceiling.
 * Documented so legal/product can tune without hunting UI copy.
 */
export function conservativeScoreGap(
  targetScore?: string,
  recentScore?: string
): number {
  if (!isScoreId(recentScore)) return DEFAULT_GAP_PTS;
  const currentHigh = SCORE_BAND_HIGH[recentScore];

  if (!isTargetId(targetScore) || targetScore === "target_not_sure") {
    const inferredTarget = Math.min(currentHigh + DEFAULT_GAP_PTS, 1600);
    return Math.max(inferredTarget - currentHigh, 50);
  }

  const targetLow = TARGET_BAND_LOW[targetScore];
  return Math.max(targetLow - currentHigh, 0);
}

export function targetBandLabel(targetScore?: string): string {
  if (isTargetId(targetScore)) {
    return TARGET_SCORE_BAND_LABEL[targetScore];
  }
  return TARGET_SCORE_BAND_LABEL.target_not_sure;
}

/** True when the parent picked a numeric band (not "Not sure yet" / missing). */
export function hasConcreteTargetBand(
  targetScore?: string
): targetScore is Exclude<TargetScoreId, "target_not_sure"> {
  return isTargetId(targetScore) && targetScore !== "target_not_sure";
}

export function concreteTargetBandLabel(targetScore?: string): string | null {
  if (!hasConcreteTargetBand(targetScore)) return null;
  return TARGET_SCORE_BAND_LABEL[targetScore];
}

export type ScoreGapChartPoints = {
  current: number;
  target: number;
  gapPts: number;
};

export function scoreGapChartPoints(
  targetScore?: string,
  recentScore?: string
): ScoreGapChartPoints {
  const gapPts = conservativeScoreGap(targetScore, recentScore);

  let current = DEFAULT_CHART_CURRENT;
  if (isScoreId(recentScore)) {
    current = SCORE_BAND_MID[recentScore];
  }

  let target = DEFAULT_CHART_TARGET;
  if (isTargetId(targetScore) && targetScore !== "target_not_sure") {
    target = TARGET_BAND_MID[targetScore];
  } else {
    target = Math.min(current + gapPts, 1600);
  }

  if (target <= current) {
    target = current + Math.max(gapPts, 50);
  }

  return { current, target, gapPts };
}

export function isHighGpaLowSat(gpaBand?: string, recentScore?: string): boolean {
  const highGpa =
    gpaBand === "gpa_3_5_3_8" || gpaBand === "gpa_3_8_4" || gpaBand === "gpa_4_plus";
  const lowSat = recentScore !== "score_1300_plus";
  return highGpa && lowSat;
}
