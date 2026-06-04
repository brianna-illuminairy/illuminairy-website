/**
 * q-doubts — limiting beliefs a parent has heard from their child since the
 * last SAT, plus the mirror interstitial (doubts-insight) that echoes them back
 * and reframes each into what the diagnostic usually uncovers.
 * Single source of truth so the question options and the recap stay in sync.
 */

export type DoubtOption = {
  id: string;
  /** What the parent hears (quote). */
  label: string;
  /** What we usually uncover behind that belief. */
  uncover: string;
};

export const DOUBTS_OPTIONS: DoubtOption[] = [
  {
    id: "not-test-taker",
    label: `"I'm just not a good test taker."`,
    uncover: "SAT strategy and pattern recognition.",
  },
  {
    id: "studied-no-help",
    label: `"I already studied and it didn't help."`,
    uncover: "A focus on the 5-6 skills worth the most points.",
  },
  {
    id: "cant-raise",
    label: `"There's no way I can raise my score that much."`,
    uncover: "A plan that prioritizes the fastest score gains.",
  },
  {
    id: "bad-at-sat",
    label: `"Maybe I'm just bad at the SAT."`,
    uncover: "To learn how the SAT works differently from school.",
  },
  {
    id: "no-months",
    label: `"I don't want to spend months studying again."`,
    uncover: "A more focused study plan, not more hours.",
  },
  {
    id: "no-top-choice",
    label: `"I don't think I can get into my top-choice school anymore."`,
    uncover: "A realistic roadmap from today's score to test day.",
  },
];

/** Selected doubts (label + uncover), in option order. */
export function selectedDoubts(qDoubts: string[] = []): DoubtOption[] {
  return DOUBTS_OPTIONS.filter((o) => qDoubts.includes(o.id));
}

export const DOUBTS_INSIGHT_COPY = {
  headline: "Good news: this is fixable.",
  subheadline:
    "Most students who say these things are capable of much higher scores. Here's what we actually find and work on.",
  sayingLabel: "What you heard",
  uncoverLabel: "How we fix it",
  cta: "What's Really Holding Them Back?",
} as const;
