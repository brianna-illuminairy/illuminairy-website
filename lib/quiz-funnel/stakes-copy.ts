/** q2 stakes — positive framing (single source for Q2, i1, reveal, booking). */

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

/** Plan reveal / booking — verb phrase after "help them" */
export const STAKES_GOAL_PHRASE: Record<string, string> = {
  "top-choice": "get into their top-choice school",
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

export function stakesOutcome(q2?: string): string {
  return STAKES_OUTCOME[q2 ?? ""] ?? STAKES_OUTCOME["top-choice"];
}

export function stakesGoalPhrase(q2?: string): string {
  return STAKES_GOAL_PHRASE[q2 ?? ""] ?? STAKES_GOAL_PHRASE["top-choice"];
}

export function stakesGoalLabel(q2?: string): string {
  return STAKES_GOAL_LABEL[q2 ?? ""] ?? STAKES_GOAL_LABEL["top-choice"];
}

/** Plan reveal subhead opener */
export function stakesSubheadOpener(q2?: string): string {
  const label = stakesGoalLabel(q2);
  return `Your goal: ${label.toLowerCase()}. Here’s what we see for students in a similar spot.`;
}

/** Shorter prefix for assessment verdict (avoids repeating full subhead). */
export function stakesVerdictPrefix(q2?: string): string {
  const goal = stakesGoalPhrase(q2);
  return `For students working toward ${goal}, `;
}
