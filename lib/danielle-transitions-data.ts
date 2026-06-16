export type TransitionCategory =
  | "contrast"
  | "cause"
  | "add"
  | "example"
  | "sequence";

export type TransitionMatchPair = {
  id: string;
  phrase: string;
  follows: string;
};

/** Phrase → what type of sentence typically follows (study / matching games). */
export const TRANSITION_FOLLOWS_PAIRS: TransitionMatchPair[] = [
  {
    id: "1",
    phrase: "Granted,",
    follows: "a point that weakens or contradicts what was just said"
  },
  {
    id: "2",
    phrase: "Ultimately,",
    follows: "the final outcome of a process"
  },
  {
    id: "3",
    phrase: "For instance,",
    follows: "a specific example of what was just said"
  },
  {
    id: "4",
    phrase: "Therefore,",
    follows: "a logical result of the previous sentence"
  },
  {
    id: "5",
    phrase: "In other words,",
    follows: "a restatement of the previous idea in plainer words"
  },
  {
    id: "6",
    phrase: "Likewise,",
    follows: "a similar fact pointing the same direction"
  },
  {
    id: "7",
    phrase: "However,",
    follows: "an opposite or differing point"
  },
  {
    id: "8",
    phrase: "Consequently,",
    follows: "a direct effect or result"
  },
  {
    id: "9",
    phrase: "Moreover,",
    follows: "a stronger or expanded point in the same direction"
  },
  {
    id: "10",
    phrase: "Specifically,",
    follows: "a narrowed detail or example"
  },
  {
    id: "11",
    phrase: "That said,",
    follows: "a contrast or qualification of what was just said"
  },
  {
    id: "12",
    phrase: "Then,",
    follows: "the next step in a sequence"
  },
  {
    id: "13",
    phrase: "In contrast,",
    follows: "an opposite or differing point"
  },
  {
    id: "14",
    phrase: "Accordingly,",
    follows: "a consequence that matches the prior idea"
  },
  {
    id: "15",
    phrase: "For example,",
    follows: "a concrete illustration"
  },
  {
    id: "16",
    phrase: "Subsequently,",
    follows: "what happens next in time or order"
  }
];

export const TRANSITION_SORT_CHIPS: Array<{
  word: string;
  cat: TransitionCategory;
}> = [
  { word: "however", cat: "contrast" },
  { word: "therefore", cat: "cause" },
  { word: "for example", cat: "example" },
  { word: "moreover", cat: "add" },
  { word: "nevertheless", cat: "contrast" },
  { word: "consequently", cat: "cause" },
  { word: "for instance", cat: "example" },
  { word: "furthermore", cat: "add" },
  { word: "on the other hand", cat: "contrast" },
  { word: "as a result", cat: "cause" },
  { word: "specifically", cat: "example" },
  { word: "in addition", cat: "add" },
  { word: "instead", cat: "contrast" },
  { word: "thus", cat: "cause" },
  { word: "in fact", cat: "example" },
  { word: "similarly", cat: "add" }
];
