import type { TransitionCategory } from "@/lib/danielle-transitions-cheat-sheet";
import { allCommonTransitionPhrases } from "@/lib/danielle-transitions-cheat-sheet";

export type { TransitionCategory };

export type TransitionMatchPair = {
  id: string;
  phrase: string;
  follows: string;
};

/** Phrase → what type of sentence typically follows (study / matching games). */
export const TRANSITION_FOLLOWS_PAIRS: TransitionMatchPair[] = [
  {
    id: "1",
    phrase: "However,",
    follows: "an opposite or differing point"
  },
  {
    id: "2",
    phrase: "Therefore,",
    follows: "a logical result of the previous sentence"
  },
  {
    id: "3",
    phrase: "For instance,",
    follows: "a specific example of what was just said"
  },
  {
    id: "4",
    phrase: "Nevertheless,",
    follows: "a point that still holds despite what was just said"
  },
  {
    id: "5",
    phrase: "Consequently,",
    follows: "a direct effect or result"
  },
  {
    id: "6",
    phrase: "Likewise,",
    follows: "a similar fact pointing the same direction"
  },
  {
    id: "7",
    phrase: "Instead,",
    follows: "what happens or should happen on the other path"
  },
  {
    id: "8",
    phrase: "Moreover,",
    follows: "a stronger or expanded point in the same direction"
  },
  {
    id: "9",
    phrase: "Specifically,",
    follows: "a narrowed detail or example"
  },
  {
    id: "10",
    phrase: "In contrast,",
    follows: "an opposite or differing point"
  },
  {
    id: "11",
    phrase: "Accordingly,",
    follows: "a consequence that matches the prior idea"
  },
  {
    id: "12",
    phrase: "For example,",
    follows: "a concrete illustration"
  },
  {
    id: "13",
    phrase: "Similarly,",
    follows: "a parallel fact in the same direction"
  },
  {
    id: "14",
    phrase: "Indeed,",
    follows: "a stronger statement of the same point"
  },
  {
    id: "15",
    phrase: "In fact,",
    follows: "a sharper or more surprising version of the same point"
  },
  {
    id: "16",
    phrase: "As a result,",
    follows: "what happened because of the previous sentence"
  }
];

const chipPhrase = (phrase: string) => phrase.replace(/,$/, "").trim().toLowerCase();

/** Category sort chips aligned to the common Digital SAT word list. */
export const TRANSITION_SORT_CHIPS: Array<{
  word: string;
  cat: TransitionCategory;
}> = allCommonTransitionPhrases().map((entry) => ({
  word: chipPhrase(entry.phrase),
  cat: entry.category
}));
