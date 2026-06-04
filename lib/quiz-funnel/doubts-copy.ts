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
    uncover:
      "They were never taught the SAT-specific patterns and strategies that strong scorers use.",
  },
  {
    id: "studied-no-help",
    label: `"I already studied and it didn't help."`,
    uncover:
      "They focused on the wrong skills and spent time where the score impact was small.",
  },
  {
    id: "cant-raise",
    label: `"There's no way I can raise my score that much."`,
    uncover:
      "They don't know which 5-6 skills are responsible for most of their lost points.",
  },
  {
    id: "bad-at-sat",
    label: `"Maybe I'm just bad at the SAT."`,
    uncover:
      "They're repeating the same question-type mistakes without knowing it.",
  },
  {
    id: "no-months",
    label: `"I don't want to spend months studying again."`,
    uncover: "They need a prioritized plan, not more hours of studying.",
  },
  {
    id: "no-top-choice",
    label: `"I don't think I can get into my top-choice school anymore."`,
    uncover:
      "They haven't seen how much improvement is still available before test day.",
  },
];

/** Selected doubts (label + uncover), in option order. */
export function selectedDoubts(qDoubts: string[] = []): DoubtOption[] {
  return DOUBTS_OPTIONS.filter((o) => qDoubts.includes(o.id));
}

export const DOUBTS_INSIGHT_COPY = {
  headline:
    "Good news. We've helped hundreds of students who felt the exact same way raise their SAT scores.",
  subheadline:
    "A disappointing SAT score doesn't mean your child isn't capable of a much higher score.",
  sayingLabel: "What they're saying",
  uncoverLabel: "What we usually uncover",
  cta: "What's Really Holding Them Back?",
} as const;
