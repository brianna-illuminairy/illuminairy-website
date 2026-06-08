/**
 * q-doubts — limiting beliefs a parent has heard from their child since the
 * last SAT, plus the mirror interstitial (doubts-insight) that echoes them back
 * and reframes each into what the diagnostic usually uncovers.
 * Single source of truth so the question options and the recap stay in sync.
 */

export type DoubtOption = {
  id: string;
  /** Short phrase the parent recognizes (question + insight recap). */
  label: string;
  /** What we usually uncover behind that belief. */
  uncover: string;
};

export const DOUBTS_OPTIONS: DoubtOption[] = [
  {
    id: "not-test-taker",
    label: "Not a good test taker",
    uncover: "SAT strategy and pattern recognition.",
  },
  {
    id: "studied-no-help",
    label: "Studied already, didn't help",
    uncover: "A focus on the 5-6 skills worth the most points.",
  },
  {
    id: "cant-raise",
    label: "Can't raise my score that much",
    uncover: "A plan that prioritizes the fastest score gains.",
  },
  {
    id: "bad-at-sat",
    label: "Just bad at the SAT",
    uncover: "To learn how the SAT works differently from school.",
  },
  {
    id: "no-months",
    label: "Don't want to waste months studying",
    uncover: "A more focused study plan, not more hours.",
  },
  {
    id: "no-top-choice",
    label: "No way I get into my top school",
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
  cta: "Continue building my plan",
} as const;
