/**
 * SAT Score Path — modeled point gains over time.
 *
 * Three phases (typical pts/week):
 *   Weeks 1–6:   ~25  (highest-leverage skills first)
 *   Weeks 7–12:  ~15
 *   Week 13+:    ~5   (tail skills / maintenance)
 *
 * Illustrative totals: 6 wk → 150 · 12 wk → 240 · 16 wk → 260 · 19 wk → 275
 * No-date defaults: 16 wk, ~+250 pts illustrative cap (see quiz-profile).
 * Use with disclaimers — modeled from plan patterns, not the Skill Diagnostic.
 */

import {
  SCORE_PATH_DEFAULT_GAIN,
  SCORE_PATH_DEFAULT_WEEKS
} from "@/lib/quiz-funnel/quiz-profile";

export type GainPhase = {
  /** Max weeks in this phase (Infinity for last). */
  maxWeeks: number;
  /** Typical points per week in this phase. */
  typicalPtsPerWeek: number;
  /** Low end of weekly band for pessimistic range. */
  lowPtsPerWeek: number;
  /** High end of weekly band for optimistic range. */
  highPtsPerWeek: number;
  /** Parent-facing label for charts. */
  label: string;
};

export const SCORE_PATH_GAIN_PHASES: readonly GainPhase[] = [
  {
    maxWeeks: 6,
    typicalPtsPerWeek: 25,
    lowPtsPerWeek: 18,
    highPtsPerWeek: 30,
    label: "Top skills"
  },
  {
    maxWeeks: 6,
    typicalPtsPerWeek: 15,
    lowPtsPerWeek: 10,
    highPtsPerWeek: 20,
    label: "Next skills"
  },
  {
    maxWeeks: Infinity,
    typicalPtsPerWeek: 5,
    lowPtsPerWeek: 3,
    highPtsPerWeek: 8,
    label: "Tail / polish"
  }
] as const;

/** Relative weight per ranked skill (skill 1 = largest jump). Sums to 100. */
export const RANKED_SKILL_GAIN_WEIGHTS = [28, 24, 20, 16, 12] as const;

/** V1 projection chart — front-loaded weights by skill count (sum 100). */
export const RANKED_SKILL_GAIN_WEIGHTS_6 = [26, 22, 18, 15, 12, 7] as const;
export const RANKED_SKILL_GAIN_WEIGHTS_7 = [22, 18, 16, 14, 12, 10, 8] as const;

/** V1 chart skill zones: under 12 wk → 5 · 12 wk → 6 · 13+ wk → 7. */
export function v1ChartSkillCount(weeks: number): 5 | 6 | 7 {
  if (weeks >= 13) return 7;
  if (weeks === 12) return 6;
  return 5;
}

export function rankedSkillGainWeights(skillCount: number): readonly number[] {
  if (skillCount >= 7) return RANKED_SKILL_GAIN_WEIGHTS_7;
  if (skillCount === 6) return RANKED_SKILL_GAIN_WEIGHTS_6;
  return RANKED_SKILL_GAIN_WEIGHTS;
}

export type WeeklyGainPoint = {
  week: number;
  weeklyGain: number;
  cumulativeGain: number;
  phaseIndex: number;
  phaseLabel: string;
};

export type RankedSkillGain = {
  rank: number;
  label: string;
  points: number;
  cumulativeAfter: number;
};

function gainOverWeeks(
  totalWeeks: number,
  pickRate: (phase: GainPhase) => number
): number {
  if (totalWeeks <= 0) return 0;

  let remainingWeeks = totalWeeks;
  let total = 0;

  for (const phase of SCORE_PATH_GAIN_PHASES) {
    const weeksInPhase =
      phase.maxWeeks === Infinity
        ? remainingWeeks
        : Math.min(remainingWeeks, phase.maxWeeks);
    if (weeksInPhase <= 0) break;
    total += weeksInPhase * pickRate(phase);
    remainingWeeks -= weeksInPhase;
  }

  return Math.round(total);
}

/** Modeled cumulative gain for `weeks` until test (typical curve). */
export function projectedGainPoints(weeks: number): number {
  return gainOverWeeks(weeks, (p) => p.typicalPtsPerWeek);
}

/** Pessimistic / optimistic cumulative gain for score bands. */
export function projectedGainBand(weeks: number): { low: number; typical: number; high: number } {
  return {
    low: gainOverWeeks(weeks, (p) => p.lowPtsPerWeek),
    typical: projectedGainPoints(weeks),
    high: gainOverWeeks(weeks, (p) => p.highPtsPerWeek)
  };
}

/** Week-by-week curve for time-based projection charts. */
export function buildWeeklyGainCurve(weeks: number): WeeklyGainPoint[] {
  if (weeks <= 0) return [];

  const points: WeeklyGainPoint[] = [];
  let cumulative = 0;
  let phaseIndex = 0;
  let weekInPhase = 0;

  for (let week = 1; week <= weeks; week++) {
    while (
      phaseIndex < SCORE_PATH_GAIN_PHASES.length - 1 &&
      weekInPhase >= SCORE_PATH_GAIN_PHASES[phaseIndex].maxWeeks
    ) {
      phaseIndex++;
      weekInPhase = 0;
    }

    const phase = SCORE_PATH_GAIN_PHASES[phaseIndex];
    const weeklyGain = phase.typicalPtsPerWeek;
    cumulative += weeklyGain;
    weekInPhase++;

    points.push({
      week,
      weeklyGain,
      cumulativeGain: cumulative,
      phaseIndex,
      phaseLabel: phase.label
    });
  }

  return points;
}

/**
 * Split total modeled gain across ranked skills (front-loaded).
 * `skillCount` defaults to 5; V1 chart uses `v1ChartSkillCount(weeks)`.
 */
export function allocateGainToRankedSkills(
  totalGain: number,
  skillLabels: string[] = [],
  skillCount = 5
): RankedSkillGain[] {
  const weights = rankedSkillGainWeights(skillCount);
  const sum = weights.reduce((a, b) => a + b, 0);
  const scaled = weights.map((w) => Math.round((w / sum) * totalGain));
  const diff = totalGain - scaled.reduce((a, b) => a + b, 0);
  if (scaled.length > 0) scaled[0] += diff;

  let cumulative = 0;
  return scaled.map((points, i) => {
    cumulative += points;
    return {
      rank: i + 1,
      label: skillLabels[i] ?? `Skill ${i + 1}`,
      points,
      cumulativeAfter: cumulative
    };
  });
}

/** Modeled gain for a timeline, capped by score gap. */
export function modeledGainForTimeline(
  rawGap: number | null | undefined,
  weeksUntilTest: number | null | undefined
): number | null {
  if (rawGap == null || rawGap <= 0) return null;
  if (weeksUntilTest == null || weeksUntilTest <= 0) {
    return Math.min(rawGap, projectedGainPoints(SCORE_PATH_DEFAULT_WEEKS), SCORE_PATH_DEFAULT_GAIN);
  }
  return Math.min(rawGap, projectedGainPoints(weeksUntilTest));
}

/** Modeled score band: current + gain curve, capped by target gap. */
export function modeledScoreBand(
  currentScore: number,
  targetScore: number,
  weeksUntilTest: number
): {
  low: number;
  typical: number;
  high: number;
  modeledGain: number;
  cappedTarget: number;
} {
  const gap = Math.max(0, targetScore - currentScore);
  const band = projectedGainBand(weeksUntilTest);
  const modeledGain = Math.min(gap, band.typical);
  const cappedTarget = currentScore + modeledGain;

  return {
    low: currentScore + Math.min(gap, band.low),
    typical: cappedTarget,
    high: currentScore + Math.min(gap, band.high),
    modeledGain,
    cappedTarget
  };
}
