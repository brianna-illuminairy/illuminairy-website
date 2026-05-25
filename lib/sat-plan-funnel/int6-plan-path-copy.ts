import { satProgramOutcomes } from "@/lib/site";
import { diagnosisProfileLabel } from "@/lib/sat-plan-funnel/diagnosis-copy";
import {
  conservativeScoreGap,
  scoreGapChartPoints,
  targetBandLabel
} from "@/lib/sat-plan-funnel/score-gap";
import { resolveTimelineFromTestDate } from "@/lib/sat-plan-funnel/sat-test-dates";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";

export type Int6PlanPathCopy = {
  gapLine: string;
  proofLine: string;
  supportingLine: string;
  footnote: string;
  chart: {
    current: number;
    target: number;
    gapPts: number;
    currentLabel: string;
    targetLabel: string;
  };
};

function voice(testTaker?: string) {
  switch (testTaker) {
    case "test_taker_daughter":
      return { subject: "she", possessive: "her" };
    case "test_taker_son":
      return { subject: "he", possessive: "his" };
    case "test_taker_self":
      return { subject: "you", possessive: "your" };
    case "test_taker_other":
      return { subject: "they", possessive: "their" };
    default:
      return { subject: "they", possessive: "their" };
  }
}

export function buildInt6PlanPathCopy(answers: SatPlanAnswers): Int6PlanPathCopy {
  const { subject, possessive } = voice(answers.test_taker);
  const gapPts = conservativeScoreGap(answers.target_score, answers.recent_score);
  const band = targetBandLabel(answers.target_score);
  const timeline = resolveTimelineFromTestDate(answers.test_date);
  const weeks = timeline.weeks ?? 12;
  const hoursPerWeek = timeline.hoursPerWeek ?? 7;
  const chart = scoreGapChartPoints(answers.target_score, answers.recent_score);
  const avgGain = satProgramOutcomes.avgPointsGained;

  const gapLine =
    subject === "you"
      ? `You've got a ${gapPts}-point gap to your goal.`
      : `${gapPts} points stand between ${subject} and ${band}.`;

  const profile = diagnosisProfileLabel(answers);
  const proofLine =
    subject === "you"
      ? `For a ${gapPts}-point gap like yours (${profile}), students who complete our 12-week program improve by an average of ${avgGain} points.`
      : `For a ${gapPts}-point gap like this (${profile}), students who complete our 12-week program improve by an average of ${avgGain} points.`;

  let supportingLine: string;
  if (answers.test_date === "test_date_not_planning") {
    supportingLine =
      subject === "you"
        ? `Improving your score by ${gapPts} points takes more than a few weekends of cramming — focused work on the right gaps, not random review.`
        : `Improving ${possessive} score by ${gapPts} points takes more than a few weekends of cramming — focused work on the right gaps, not random review.`;
  } else {
    supportingLine =
      subject === "you"
        ? `That takes more than a few weekends of cramming — ${weeks} weeks at ${hoursPerWeek} hrs/week on the right gaps.`
        : `That takes more than a few weekends of cramming — ${weeks} weeks at ${hoursPerWeek} hrs/week on the right gaps.`;
  }

  return {
    gapLine,
    proofLine,
    supportingLine,
    footnote: `${satProgramOutcomes.varyDisclaimer} College Board research cites ~80 hours of guided prep for 200+ point gains.`,
    chart: {
      current: chart.current,
      target: chart.target,
      gapPts: chart.gapPts,
      currentLabel: "Current",
      targetLabel: "Goal"
    }
  };
}
