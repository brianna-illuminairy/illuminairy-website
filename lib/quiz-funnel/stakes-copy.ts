/** q2 stakes — positive framing (single source for Q2, i1, reveal, booking). */

import { isQuizSelfTaker } from "@/lib/quiz-funnel/subject-voice";

export const Q2_STAKES_QUESTION = "What would a higher SAT score help them achieve?";

export type StakesId = "top-choice" | "merit" | "selective" | "app-rounds" | "early";

export const Q2_STAKES_OPTIONS: { id: StakesId; label: string }[] = [
  { id: "top-choice", label: "Get into their top-choice school" },
  { id: "merit", label: "Qualify for merit scholarships" },
  { id: "selective", label: "Stay competitive at selective colleges" },
  { id: "app-rounds", label: "Be ready for early application rounds" },
];

/** i1 proof bridge — "so that …" clause */
export const STAKES_OUTCOME: Record<string, string> = {
  "top-choice": "they can get into their top-choice school",
  merit: "they can qualify for merit scholarships",
  selective: "they stay competitive at selective colleges",
  "app-rounds": "they're ready for early application rounds",
  early: "they're ready for early application rounds",
};

const STAKES_OUTCOME_SELF: Record<string, string> = {
  "top-choice": "you can get into your top-choice school",
  merit: "you can qualify for merit scholarships",
  selective: "you stay competitive at selective colleges",
  "app-rounds": "you're ready for early application rounds",
  early: "you're ready for early application rounds",
};

/** Plan reveal / booking — verb phrase after "help them" */
export const STAKES_GOAL_PHRASE: Record<string, string> = {
  "top-choice": "get into their top-choice school",
  merit: "qualify for merit scholarships",
  selective: "stay competitive at selective colleges",
  "app-rounds": "be ready for early application rounds",
  early: "be ready for early application rounds",
};

const STAKES_GOAL_PHRASE_SELF: Record<string, string> = {
  "top-choice": "get into your top-choice school",
  merit: "qualify for merit scholarships",
  selective: "stay competitive at selective colleges",
  "app-rounds": "be ready for early application rounds",
  early: "be ready for early application rounds",
};

/** Input row + subhead — "Merit scholarships" style */
export const STAKES_GOAL_LABEL: Record<string, string> = {
  "top-choice": "Top-choice school",
  merit: "Merit scholarships",
  selective: "Selective colleges",
  "app-rounds": "Early application rounds",
  early: "Early application rounds",
};

export function stakesOutcome(q2?: string, qWho?: string): string {
  const map = isQuizSelfTaker(qWho) ? STAKES_OUTCOME_SELF : STAKES_OUTCOME;
  return map[q2 ?? ""] ?? map["top-choice"];
}

export function stakesGoalPhrase(q2?: string, qWho?: string): string {
  const map = isQuizSelfTaker(qWho) ? STAKES_GOAL_PHRASE_SELF : STAKES_GOAL_PHRASE;
  return map[q2 ?? ""] ?? map["top-choice"];
}

export function stakesGoalLabel(q2?: string): string {
  return STAKES_GOAL_LABEL[q2 ?? ""] ?? STAKES_GOAL_LABEL["top-choice"];
}

/** v1 bridge — "their ___ is/are still realistic" (grammar matches q2 goal). */
export const STAKES_REALISTIC_TARGET: Record<
  string,
  { noun: string; verb: "is" | "are" }
> = {
  "top-choice": { noun: "top-choice school", verb: "is" },
  merit: { noun: "merit scholarships", verb: "are" },
  selective: { noun: "selective colleges", verb: "are" },
  "app-rounds": { noun: "early application rounds", verb: "are" },
  early: { noun: "early application rounds", verb: "are" },
};

export function stakesRealisticTarget(q2?: string) {
  return (
    STAKES_REALISTIC_TARGET[q2 ?? ""] ?? STAKES_REALISTIC_TARGET["top-choice"]
  );
}

/** Plan reveal subhead opener */
export function stakesSubheadOpener(q2?: string): string {
  const label = stakesGoalLabel(q2);
  return `Your goal: ${label.toLowerCase()}. Here’s what we see for students in a similar spot.`;
}

/** Shorter prefix for assessment verdict (avoids repeating full subhead). */
export function stakesVerdictPrefix(q2?: string, qWho?: string): string {
  const goal = stakesGoalPhrase(q2, qWho);
  return `For students working toward ${goal}, `;
}
