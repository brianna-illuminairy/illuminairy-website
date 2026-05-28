import type { AssessmentAnswers, AssessmentStep } from "@/lib/assessment-funnel/types";

const SPINE: AssessmentStep[] = [
  "situation",
  "who",
  "target",
  "current",
  "tried",
  "test-date",
  "insight-situation",
  "insight-path",
  "complete"
];

function indexOf(step: AssessmentStep): number {
  return SPINE.indexOf(step);
}

export function nextStepAfter(
  step: AssessmentStep,
  _answers: AssessmentAnswers
): AssessmentStep {
  const i = indexOf(step);
  if (i < 0 || i >= SPINE.length - 1) return "complete";
  return SPINE[i + 1]!;
}

export function stepBefore(step: AssessmentStep): AssessmentStep | "landing" {
  const i = indexOf(step);
  if (i <= 0) return "landing";
  return SPINE[i - 1]!;
}

export function questionNumber(step: AssessmentStep): number | null {
  const questions: AssessmentStep[] = [
    "situation",
    "who",
    "target",
    "current",
    "tried",
    "test-date"
  ];
  const i = questions.indexOf(step);
  return i >= 0 ? i + 1 : null;
}
