import { stakesRealisticTarget } from "@/lib/quiz-funnel/stakes-copy";
import {
  isQuizSelfTaker,
  revealPlanCta,
  scorePathEffortLine,
} from "@/lib/quiz-funnel/subject-voice";

/** @deprecated Prefer scorePathEffortLine(qWho) — default is parent voice. */
export const SCORE_PATH_EFFORT_LINE = scorePathEffortLine();

export { scorePathEffortLine, revealPlanCta };

export type ScorePathCopyPart = { text: string; em?: boolean };

/** Parent-facing SAT score with thousands separator (e.g. 1,400). */
export function formatSatScoreLabel(score: number): string {
  return score.toLocaleString("en-US");
}

/** v1 projection lead — after projection chart. */
export function v1FastWinBridgeParts(
  goalScore: number | null | undefined,
  qWho?: string
): ScorePathCopyPart[] {
  const hasGoal = goalScore != null && goalScore > 0;
  const goalFallback = isQuizSelfTaker(qWho) ? "your goal score" : "their goal score";
  const parts: ScorePathCopyPart[] = [
    { text: "The fastest way to achieve " },
  ];
  if (hasGoal) {
    parts.push({ text: formatSatScoreLabel(goalScore), em: true });
  } else {
    parts.push({ text: goalFallback, em: true });
  }
  parts.push({
    text: " is to attack skills one at a time in the order of highest impact.",
  });
  return parts;
}

/** @deprecated use v1FastWinBridgeParts */
export function v1EmotionalBridgeParts(
  q2?: string,
  targetScore?: number | null
): ScorePathCopyPart[] {
  const { noun, verb } = stakesRealisticTarget(q2);
  const hasTarget = targetScore != null && targetScore > 0;

  const parts: ScorePathCopyPart[] = [
    { text: "After a low SAT score, students start wondering if their " },
    { text: noun, em: true },
    { text: ` ${verb} still realistic. We focus on the ` },
    { text: "highest-impact skill", em: true },
    { text: " first, often worth " },
    { text: "50+ points", em: true },
    { text: ", so they see a quick win and believe " },
  ];

  if (hasTarget) {
    parts.push({ text: `${targetScore}+`, em: true });
    parts.push({ text: " is possible again." });
  } else {
    parts.push({ text: "their " });
    parts.push({ text: "goal score", em: true });
    parts.push({ text: " is possible again." });
  }

  return parts;
}

/** s3 verified case study — see `s3-verified-case-study.ts` + `QFVerifiedCaseStudy`. */

/** @deprecated Prefer revealPlanCta(qWho) — default is parent voice. */
export const REVEAL_CTA = revealPlanCta();

export const I_GAP_CTA = "Final question";

export const NAME_CTA = "Build my plan";

export const V1_CTA = "Get Started";

export const REVEAL_SCORE_PROJECTION_NOTE =
  "Starter plan with free score projection. Exact skills, missed questions, and lessons unlock after the Skill Diagnostic.";

export const S3_PERSONALIZE_CTA = "Continue to book your call";

/** s3 · advisor credibility (team photo + one line). */
export const S4_CALL_LINE =
  "Every SAT advisor scored 1450+ on the Digital SAT.";

/** hit-outcome-month-one · score report caption */
export const OUTCOME_SCORE_CAPTION = "Ethan scored +230 pts in 12 weeks";
