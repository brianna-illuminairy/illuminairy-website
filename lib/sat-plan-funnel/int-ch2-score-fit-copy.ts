import { satProgramOutcomes } from "@/lib/site";
import {
  conservativeScoreGap,
  scoreGapChartPoints,
  targetBandLabel
} from "@/lib/sat-plan-funnel/score-gap";
import { resolveTimelineFromTestDate } from "@/lib/sat-plan-funnel/sat-test-dates";
import { studentVoice } from "@/lib/sat-plan-funnel/student-voice";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";

export type IntCh2ScoreFitCopy = {
  headline: string;
  paragraphs: string[];
  footnote: string;
};

function recentScoreLabel(recentScore?: string): string | null {
  if (!recentScore) return null;
  const chart = scoreGapChartPoints(undefined, recentScore);
  return `about ${chart.current}`;
}

export function buildIntCh2ScoreFitCopy(answers: SatPlanAnswers): IntCh2ScoreFitCopy {
  const voice = studentVoice(answers);
  const gapPts = conservativeScoreGap(answers.target_score, answers.recent_score);
  const band = targetBandLabel(answers.target_score);
  const timeline = resolveTimelineFromTestDate(answers.test_date);
  const schools = answers.target_schools?.trim();
  const current = recentScoreLabel(answers.recent_score);
  const avgGain = satProgramOutcomes.avgPointsGained;

  const paragraphs: string[] = [];

  if (schools) {
    paragraphs.push(
      voice.isSelf
        ? `For schools like ${schools}, many applicants land in the ${band} range to stay competitive.`
        : `For schools like ${schools}, ${voice.name} often needs to be in the ${band} range to stay competitive.`
    );
  } else {
    paragraphs.push(
      voice.isSelf
        ? `For the score you're aiming for (${band}), the gap is concrete — not vague.`
        : `For the score ${voice.name} is aiming for (${band}), the gap is concrete — not vague.`
    );
  }

  if (current) {
    paragraphs.push(
      voice.isSelf
        ? `That's ${gapPts} points above your recent score of ${current}.`
        : `That's ${gapPts} points above ${voice.name}'s recent score of ${current}.`
    );
  } else {
    paragraphs.push(
      voice.isSelf
        ? `We're mapping a ${gapPts}-point path toward ${band}.`
        : `We're mapping a ${gapPts}-point path for ${voice.name} toward ${band}.`
    );
  }

  paragraphs.push(
    voice.isSelf
      ? `Students with a similar starting profile often land in a realistic range with about 12 weeks of guided tutoring. Our program completers average ${avgGain} points of improvement.`
      : `Students with a similar starting profile often land in a realistic range with about 12 weeks of guided tutoring. Our program completers average ${avgGain} points of improvement.`
  );

  if (timeline.weeks && answers.test_date !== "test_date_not_planning") {
    const tight = timeline.weeks < 8;
    paragraphs.push(
      tight
        ? `The ${timeline.dateLabel} SAT is ${timeline.weeks} weeks away — a tight runway, but the highest-impact gaps can still move first.`
        : `The ${timeline.dateLabel} SAT is ${timeline.weeks} weeks away — a solid runway for a ${gapPts}-point focus plan.`
    );
  }

  const headline = voice.isSelf
    ? "Here's what's realistic for you."
    : `Here's what's realistic for ${voice.name}.`;

  return {
    headline,
    paragraphs,
    footnote: satProgramOutcomes.varyDisclaimer
  };
}
