import type { ScoreReviewAnswers } from "@/lib/score-review-funnel/funnel-steps";

export const BASE_SCORE_REVIEW_STEPS = [
  "sr-grade",
  "sr-recent-score",
  "sr-prepared",
  "sr-test-date",
  "sr-target",
  "sr-school-referral",
  "sr-email",
  "sr-name",
  "sr-phone",
  "sr-book",
  "sr-prep-cb",
  "sr-share",
  "sr-thank-you",
] as const;

export type ScoreReviewStepId = (typeof BASE_SCORE_REVIEW_STEPS)[number];

export function getScoreReviewRouteSteps(_answers: ScoreReviewAnswers = {}): string[] {
  return [...BASE_SCORE_REVIEW_STEPS];
}
