/**
 * V1 score projection — same runway + gain math as reveal (`buildScorePathOutput`).
 */

import type { QuizAnswersLike } from "@/lib/quiz-funnel/score-path-output";
import { buildScorePathOutput } from "@/lib/quiz-funnel/score-path-output";
import {
  allocateGainToRankedSkills,
  v1ChartSkillCount,
} from "@/lib/quiz-funnel/score-path-gain";
import { buildGoalAchievability } from "@/lib/quiz-funnel/goal-achievability";
import { SCORE_PATH_DEFAULT_START } from "@/lib/quiz-funnel/quiz-profile";

function roundGainPoints(gain: number): number {
  if (gain <= 0) return 0;
  if (gain < 50) return Math.round(gain / 5) * 5;
  return Math.round(gain / 10) * 10;
}

const Q5_HEADLINE_DATE: Record<string, string> = {
  aug22: "Aug 22",
  sept12: "Sept 12",
  oct3: "Oct 3",
  nov7: "Nov 7",
  dec5: "Dec 5",
};

export type V1ProjectionModel = {
  current: number;
  /** Modeled endpoint on the chart (starting + capped gain for this timeline). */
  displayTarget: number;
  /** Parent-selected goal from q8 (may exceed modeled endpoint). */
  goalTarget: number | null;
  modeledGain: number;
  displayGain: number;
  skillCount: 5 | 6 | 7;
  skillPts: number[];
  pointsLine: string;
  showChart: boolean;
  hasDate: boolean;
  testDateLabel: string;
  chartWeeks: number;
  gapExceedsModeled: boolean;
  disclaimers: string[];
};

export function buildV1Projection(answers: QuizAnswersLike): V1ProjectionModel {
  const path = buildScorePathOutput(answers);
  const achievability = buildGoalAchievability(answers, path);

  const current = path.starting.value ?? SCORE_PATH_DEFAULT_START;
  const modeledGain = path.modeledGain ?? 0;
  const displayGain = roundGainPoints(modeledGain);
  const displayTarget =
    path.scoreRange.typical ?? (modeledGain > 0 ? current + modeledGain : current);

  const skillCount = v1ChartSkillCount(path.chartWeeks);
  const skillPts =
    modeledGain > 0
      ? allocateGainToRankedSkills(modeledGain, [], skillCount).map((s) => s.points)
      : [];

  const q5 = answers.q5 ?? "tbd";
  const testDateLabel = Q5_HEADLINE_DATE[q5] ?? "test day";

  return {
    current,
    displayTarget,
    goalTarget: path.target.value,
    modeledGain,
    displayGain,
    skillCount,
    skillPts,
    pointsLine: achievability.pointsLine,
    showChart: path.showScoreChart && skillPts.length === skillCount && current > 0,
    hasDate: path.hasScheduledTestDate,
    testDateLabel,
    chartWeeks: path.chartWeeks,
    gapExceedsModeled: path.flags.gapExceedsModeledGain,
    disclaimers: path.disclaimers,
  };
}
