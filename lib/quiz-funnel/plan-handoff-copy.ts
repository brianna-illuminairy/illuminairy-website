/**
 * s4 · Plan review handoff — what they got on the call, what unlocks next (before s5 lead).
 */

import type { QuizAnswersLike } from "@/lib/quiz-funnel/score-path-output";
import { buildScorePathOutput } from "@/lib/quiz-funnel/score-path-output";
import {
  hasScheduledTestDate,
  hasTargetScore,
  Q8_TARGET_SCORE,
} from "@/lib/quiz-funnel/quiz-profile";
import { formatSatScoreLabel } from "@/lib/quiz-funnel/score-path-copy";
import { FOCUS_SKILL_COUNT } from "@/lib/sat-skills-copy";

const Q5_HANDOFF_DATE: Record<string, string> = {
  aug22: "Aug 22",
  sept12: "Sept 12",
  oct3: "Oct 3",
  nov7: "Nov 7",
  dec5: "Dec 5",
};

export const PLAN_HANDOFF_EYEBROW = "ELIGIBLE FOR THE SKILL DIAGNOSTIC";

export const PLAN_HANDOFF_HEADLINE = "You're approved for the Skill Diagnostic.";

export const PLAN_HANDOFF_SUBHEADLINE =
  "Next we'll identify the 5–6 skills most likely to raise your child's score and finalize their plan.";

export const PLAN_HANDOFF_CALL_TITLE = "Free SAT Plan Review";

export const PLAN_HANDOFF_CALL_DURATION = "15 min";

export const PLAN_HANDOFF_CTA = "Reserve My SAT Plan Review";

export type PlanHandoffItem = {
  title: string;
  body: string;
};

export type PlanHandoffModel = {
  targetLabel: string | null;
  testDateLabel: string | null;
  hasTarget: boolean;
  hasDate: boolean;
  items: PlanHandoffItem[];
};

function resolveTarget(answers: QuizAnswersLike): number | null {
  const path = buildScorePathOutput(answers);
  if (path.target.value != null) return path.target.value;
  if (hasTargetScore(answers.q8) && answers.q8) {
    return Q8_TARGET_SCORE[answers.q8] ?? null;
  }
  return null;
}

function resolveTestDateLabel(q5?: string): string | null {
  if (!q5 || !hasScheduledTestDate(q5)) return null;
  return Q5_HANDOFF_DATE[q5] ?? null;
}

function buildHandoffItems(
  targetLabel: string | null,
  testDateLabel: string | null
): PlanHandoffItem[] {
  const skillRange = `${FOCUS_SKILL_COUNT}–6`;

  let goalLine = "Whether their target score is realistic, and what it will take.";
  if (targetLabel && testDateLabel) {
    goalLine = `Whether ${targetLabel} by ${testDateLabel} is realistic, and what it will take.`;
  } else if (targetLabel) {
    goalLine = `Whether ${targetLabel} is realistic, and what it will take.`;
  } else if (testDateLabel) {
    goalLine = `Whether their goal by ${testDateLabel} is realistic, and what it will take.`;
  }

  return [
    {
      title: "Confirm the goal",
      body: goalLine,
    },
    {
      title: "Answer your questions",
      body: "Schedule, format, pricing, whatever you need to decide.",
    },
    {
      title: "Schedule the Skill Diagnostic",
      body: `The proctored 2 hr 14 min exam that finds the ${skillRange} skills.`,
    },
    {
      title: "Your personalized weekly plan",
      body: `Built around those ${skillRange} skills, week by week to test day.`,
    },
  ];
}

export function buildPlanHandoff(answers: QuizAnswersLike = {}): PlanHandoffModel {
  const target = resolveTarget(answers);
  const targetLabel = target != null ? formatSatScoreLabel(target) : null;
  const testDateLabel = resolveTestDateLabel(answers.q5);

  return {
    targetLabel,
    testDateLabel,
    hasTarget: targetLabel != null,
    hasDate: testDateLabel != null,
    items: buildHandoffItems(targetLabel, testDateLabel),
  };
}
