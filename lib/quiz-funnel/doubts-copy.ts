/**
 * q-doubts — limiting beliefs a parent has heard from their child since the
 * last SAT, plus the mirror interstitial (doubts-insight) that echoes them back.
 * Single source of truth so the question options and the recap stay in sync.
 */

export type DoubtOption = { id: string; label: string };

export const DOUBTS_OPTIONS: DoubtOption[] = [
  { id: "not-test-taker", label: `"I'm just not a good test taker."` },
  { id: "studied-no-help", label: `"I already studied and it didn't help."` },
  { id: "cant-raise", label: `"There's no way I can raise my score that much."` },
  { id: "bad-at-sat", label: `"Maybe I'm just bad at the SAT."` },
  { id: "no-months", label: `"I don't want to spend months studying again."` },
  { id: "no-top-choice", label: `"I don't think I can get into my top-choice school anymore."` },
];

/** Max quotes echoed back on the mirror interstitial (keeps it tight). */
export const DOUBTS_INSIGHT_MAX_QUOTES = 3;

/** Selected doubt labels, in option order, capped for the recap screen. */
export function selectedDoubtLabels(qDoubts: string[] = []): string[] {
  return DOUBTS_OPTIONS.filter((o) => qDoubts.includes(o.id))
    .map((o) => o.label)
    .slice(0, DOUBTS_INSIGHT_MAX_QUOTES);
}

export const DOUBTS_INSIGHT_COPY = {
  headline: "We noticed something",
  intro: "You mentioned that your child has said:",
  common:
    "These are some of the most common things we hear from students with good grades but lower-than-expected SAT scores.",
  notAbility: "The problem isn't ability or effort.",
  realIssue:
    "It's that no one has identified the few skills responsible for most of the points, the same skills that caused them to struggle on the SAT last time.",
  diagnostic: "That's exactly what our Diagnostic is designed to uncover.",
} as const;
