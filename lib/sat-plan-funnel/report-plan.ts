import { satProgramOutcomes } from "@/lib/site";
import { reportDiagnosisIntro } from "@/lib/sat-plan-funnel/diagnosis-copy";
import {
  conservativeScoreGap,
  targetBandLabel
} from "@/lib/sat-plan-funnel/score-gap";
import { getTestDateLabel, resolveTimelineFromTestDate } from "@/lib/sat-plan-funnel/sat-test-dates";
import { studentPossessiveLabel, studentVoice } from "@/lib/sat-plan-funnel/student-voice";
import { wrongReasonLabels } from "@/lib/sat-plan-funnel/wrong-options";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";

export type ReportPlanSection = {
  title: string;
  body: string;
};

export type ReportPlan = {
  headline: string;
  subhead: string;
  sections: ReportPlanSection[];
};

export function buildReportPlan(answers: SatPlanAnswers): ReportPlan {
  const voice = studentVoice(answers);
  const possessiveLabel = studentPossessiveLabel(answers);
  const gapPts = conservativeScoreGap(answers.target_score, answers.recent_score);
  const band = targetBandLabel(answers.target_score);
  const timeline = resolveTimelineFromTestDate(answers.test_date);
  const wrong = wrongReasonLabels(answers.wrong_reasons);
  const testDate = getTestDateLabel(answers.test_date);

  const sections: ReportPlanSection[] = [
    {
      title: "What we heard",
      body: reportDiagnosisIntro(answers)
    },
    {
      title: "Score gap",
      body: voice.isSelf
        ? `You're aiming for ${band} — about a ${gapPts}-point gap from where you are now.`
        : `${voice.name} is aiming for ${band} — about a ${gapPts}-point gap from where ${voice.subject} is now.`
    }
  ];

  if (testDate) {
    sections.push({
      title: "Timeline",
      body:
        timeline.weeks && answers.test_date !== "test_date_not_planning"
          ? `${testDate} is ${timeline.weeks} weeks out. A typical guided plan for that runway runs about ${timeline.hoursPerWeek} hrs/week on ${voice.possessive} highest-impact gaps.`
          : `Test timing: ${testDate}. We'll map weeks to focused hours once the date is firm.`
    });
  }

  if (answers.target_schools?.trim()) {
    sections.push({
      title: "Schools",
      body: `${possessiveLabel} target list includes ${answers.target_schools.trim()}. We'll stress-test fit on your free review call.`
    });
  }

  if (wrong) {
    sections.push({
      title: "Start here",
      body: `Based on what went wrong last time (${wrong}), the first sessions target pacing, stamina, or content gaps — not a generic review.`
    });
  }

  sections.push({
    title: "What similar students see",
    body: `Program completers average ${satProgramOutcomes.avgPointsGained} points of improvement. ${satProgramOutcomes.varyDisclaimer}`
  });

  const headline = voice.isSelf
    ? "Your SAT improvement plan"
    : `${possessiveLabel} SAT improvement plan`;

  const subhead = voice.isSelf
    ? "A snapshot from your answers — book a free review to walk through it with an SAT expert."
    : `A snapshot from your answers — book a free review to walk through it with an SAT expert.`;

  return { headline, subhead, sections };
}
