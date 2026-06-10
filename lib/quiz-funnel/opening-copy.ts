/** Plan Builder opening — low-friction Q1–Q3 before segmentation. */

import { isQuizSelfTaker } from "@/lib/quiz-funnel/subject-voice";

export type WhoNeedsHelpId = "child" | "self";

export const Q_WHO_OPTIONS: { id: WhoNeedsHelpId; label: string }[] = [
  { id: "child", label: "My child" },
  { id: "self", label: "Me" }
];

export type ScoreLowerId = "yes" | "planning-ahead";

export const Q_SCORE_LOWER_OPTIONS: { id: ScoreLowerId; label: string }[] = [
  { id: "yes", label: "Yes" },
  { id: "planning-ahead", label: "Not yet, we're planning ahead" }
];

export type UrgencyId = "score-low" | "test-soon" | "app-soon" | "get-ahead";

export const Q_URGENCY_OPTIONS: { id: UrgencyId; label: string }[] = [
  { id: "score-low", label: "SAT score is too low" },
  { id: "test-soon", label: "Next test date is coming up" },
  { id: "app-soon", label: "Application deadlines are coming" },
  { id: "get-ahead", label: "We need to start early" }
];

export function scoreLowerQuestion(qWho?: string): string {
  if (qWho === "self") {
    return "Did your SAT score come back lower than expected?";
  }
  return "Did their SAT score come back lower than expected?";
}

export function scoreLowerOptionLabel(id: ScoreLowerId, qWho?: string): string {
  if (id === "yes") return "Yes";
  return isQuizSelfTaker(qWho)
    ? "Not yet, I'm planning ahead"
    : "Not yet, we're planning ahead";
}

export function urgencyOptionLabel(id: UrgencyId, qWho?: string): string {
  if (isQuizSelfTaker(qWho)) {
    const self: Record<UrgencyId, string> = {
      "score-low": "My SAT score is too low",
      "test-soon": "My next test date is coming up",
      "app-soon": "My application deadlines are coming",
      "get-ahead": "I need to start early",
    };
    return self[id];
  }
  const child: Record<UrgencyId, string> = {
    "score-low": "Their SAT score is too low",
    "test-soon": "Their next test date is coming up",
    "app-soon": "Their application deadlines are coming",
    "get-ahead": "We need to start early",
  };
  return child[id];
}
