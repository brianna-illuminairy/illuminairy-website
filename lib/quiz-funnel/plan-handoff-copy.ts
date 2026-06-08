/**
 * s4 · Plan review handoff — what they got on the call, what unlocks next (before s5 lead).
 */

import type { QuizAnswersLike } from "@/lib/quiz-funnel/score-path-output";
import { isQuizSelfTaker } from "@/lib/quiz-funnel/subject-voice";
import { buildScorePathOutput } from "@/lib/quiz-funnel/score-path-output";
import { hasScheduledTestDate, hasTargetScore } from "@/lib/quiz-funnel/quiz-profile";
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

export const PLAN_HANDOFF_HEADLINE =
  "Next step to get started with your diagnostic";

export const PLAN_HANDOFF_SUBHEADLINE = "Reserve your free SAT Plan Review.";

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

const Q8_GOAL_DISPLAY: Record<string, string> = {
  "1250": "1250",
  "1300": "1300",
  "1350": "1350",
  "1400": "1400",
  "1450": "1450+",
};

function resolveGoalDisplay(answers: QuizAnswersLike): {
  targetLabel: string | null;
  targetValue: number | null;
  isInferred: boolean;
} {
  const path = buildScorePathOutput(answers);
  const q8 = answers.q8;

  if (hasTargetScore(q8) && q8) {
    return {
      targetLabel: Q8_GOAL_DISPLAY[q8] ?? formatSatScoreLabel(path.target.value ?? 0),
      targetValue: path.target.value,
      isInferred: false,
    };
  }

  if (path.target.value != null) {
    const label =
      path.target.confidence === "inferred" && path.target.bandLabel
        ? path.target.bandLabel
        : path.target.label;
    return {
      targetLabel: label,
      targetValue: path.target.value,
      isInferred: path.target.confidence === "inferred",
    };
  }

  return { targetLabel: null, targetValue: null, isInferred: false };
}

function resolveTestDateLabel(q5?: string): string | null {
  if (!q5 || !hasScheduledTestDate(q5)) return null;
  return Q5_HANDOFF_DATE[q5] ?? null;
}

function buildGoalConfirmTitle(
  targetLabel: string | null,
  testDateLabel: string | null,
  qWho?: string
): string {
  const goalWord = isQuizSelfTaker(qWho) ? "your goal" : "their goal";
  if (targetLabel && testDateLabel) {
    return `Confirm ${targetLabel} by ${testDateLabel}`;
  }
  if (targetLabel) {
    return `Confirm ${targetLabel}`;
  }
  if (testDateLabel) {
    return `Confirm ${goalWord} by ${testDateLabel}`;
  }
  return "Confirm the goal";
}

function buildGoalConfirmBody(
  targetLabel: string | null,
  testDateLabel: string | null,
  isInferred: boolean,
  qWho?: string
): string {
  const forWhom = isQuizSelfTaker(qWho) ? "you" : "them";
  const goalWord = isQuizSelfTaker(qWho) ? "your goal" : "their goal";
  const targetWord = isQuizSelfTaker(qWho) ? "your target score" : "their target score";
  if (targetLabel && testDateLabel) {
    if (isInferred) {
      return `Whether that range by ${testDateLabel} is realistic, and what it will take.`;
    }
    return `Whether that's realistic by ${testDateLabel}, and what it will take.`;
  }
  if (targetLabel) {
    return isInferred
      ? `Whether that range is realistic for ${forWhom}, and what it will take.`
      : `Whether that's realistic for ${forWhom}, and what it will take.`;
  }
  if (testDateLabel) {
    return `Whether ${goalWord} by ${testDateLabel} is realistic, and what it will take.`;
  }
  return `Whether ${targetWord} is realistic, and what it will take.`;
}

function buildHandoffItems(
  targetLabel: string | null,
  testDateLabel: string | null,
  isInferred: boolean,
  qWho?: string
): PlanHandoffItem[] {
  const skillRange = `${FOCUS_SKILL_COUNT}–6`;

  return [
    {
      title: buildGoalConfirmTitle(targetLabel, testDateLabel, qWho),
      body: buildGoalConfirmBody(targetLabel, testDateLabel, isInferred, qWho),
    },
    {
      title: "Answer your questions",
      body: "Timeline, how Week 1 works, and whatever you still need to know before booking.",
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
  const { targetLabel, isInferred } = resolveGoalDisplay(answers);
  const testDateLabel = resolveTestDateLabel(answers.q5);

  return {
    targetLabel,
    testDateLabel,
    hasTarget: targetLabel != null,
    hasDate: testDateLabel != null,
    items: buildHandoffItems(targetLabel, testDateLabel, isInferred, answers.qWho),
  };
}
