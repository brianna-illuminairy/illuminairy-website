/**
 * q-doubts — limiting beliefs since the last SAT, plus doubts-insight mirror.
 * Parent path: third-person option labels (what they heard their child say).
 * Self path: first-person labels (rare — step is removed from route when qWho=self).
 */

import { isQuizSelfTaker } from "@/lib/quiz-funnel/subject-voice";

export type DoubtOption = {
  id: string;
  label: string;
  uncover: string;
};

const DOUBTS_UNCOVER: Record<string, string> = {
  "not-test-taker": "SAT strategy and pattern recognition.",
  "studied-no-help": "A focus on the 5-6 skills worth the most points.",
  "cant-raise": "A plan that prioritizes the fastest score gains.",
  "bad-at-sat": "To learn how the SAT works differently from school.",
  "no-months": "A more focused study plan, not more hours.",
  "no-top-choice": "A realistic roadmap from today's score to test day.",
};

const DOUBTS_SELF_LABELS: Record<string, string> = {
  "not-test-taker": "I'm not a good test taker",
  "studied-no-help": "I studied already, it didn't help",
  "cant-raise": "I can't raise my score that much",
  "bad-at-sat": "I'm just bad at the SAT",
  "no-months": "I don't want to waste months studying",
  "no-top-choice": "No way I get into my top school",
};

const DOUBTS_CHILD_LABELS: Record<string, string> = {
  "not-test-taker": "They're not a good test taker",
  "studied-no-help": "Studying didn't help",
  "cant-raise": "They can't raise their score that much",
  "bad-at-sat": "They're just bad at the SAT",
  "no-months": "They don't want to waste months studying",
  "no-top-choice": "No way they get into their top school",
};

const DOUBT_IDS = [
  "not-test-taker",
  "studied-no-help",
  "cant-raise",
  "bad-at-sat",
  "no-months",
  "no-top-choice",
] as const;

/** @deprecated Use doubtsOptions(qWho) — parent labels only. */
export const DOUBTS_OPTIONS: DoubtOption[] = DOUBT_IDS.map((id) => ({
  id,
  label: DOUBTS_CHILD_LABELS[id],
  uncover: DOUBTS_UNCOVER[id],
}));

export function doubtsOptions(qWho?: string): DoubtOption[] {
  const labels = isQuizSelfTaker(qWho) ? DOUBTS_SELF_LABELS : DOUBTS_CHILD_LABELS;
  return DOUBT_IDS.map((id) => ({
    id,
    label: labels[id],
    uncover: DOUBTS_UNCOVER[id],
  }));
}

export function doubtsQuestionHtml(qWho?: string): string {
  return isQuizSelfTaker(qWho)
    ? "Which of these have you <em>thought</em> or said?"
    : "Which of these have you <em>heard</em> from your child?";
}

/** Selected doubts (label + uncover), in option order. */
export function selectedDoubts(qDoubts: string[] = [], qWho?: string): DoubtOption[] {
  return doubtsOptions(qWho).filter((o) => qDoubts.includes(o.id));
}

export function doubtsInsightCopy(qWho?: string) {
  const self = isQuizSelfTaker(qWho);
  return {
    headline: "Good news: this is fixable.",
    subheadline: self
      ? "Many students think these things and are still capable of much higher scores. Here's what we usually find and work on."
      : "Most students who say these things are capable of much higher scores. Here's what we actually find and work on.",
    sayingLabel: self ? "What you've said" : "What you heard",
    uncoverLabel: "How we fix it",
    cta: "Continue building my plan",
  } as const;
}

/** @deprecated Use doubtsInsightCopy(qWho) */
export const DOUBTS_INSIGHT_COPY = doubtsInsightCopy("child");
