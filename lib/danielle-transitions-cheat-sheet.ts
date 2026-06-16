/**
 * SSOT: most common Digital SAT transition words (official Bluebook 4–11 pool).
 * Four relationship categories for flashcards, cheat sheet, and portal copy.
 */

export type TransitionCategory = "contrast" | "cause" | "addition" | "similarity";

export type TransitionCheatSheetSection = {
  id: TransitionCategory;
  title: string;
  tag?: string;
  description: string;
  phrases: readonly string[];
  note?: string;
};

export const TRANSITION_CHEAT_SHEET_SECTIONS: readonly TransitionCheatSheetSection[] = [
  {
    id: "contrast",
    title: "Contrast & Concession",
    tag: "Most common",
    description:
      "Shows a contradiction, surprise, or shift in direction. Sentence B fights, qualifies, or reverses sentence A.",
    phrases: [
      "However,",
      "Nevertheless,",
      "Nonetheless,",
      "Instead,",
      "Alternatively,",
      "Conversely,",
      "In contrast,"
    ],
    note: "However is the most frequently tested transition on the exam."
  },
  {
    id: "cause",
    title: "Causation",
    description:
      "Shows that the second idea happens as a result of the first, or explains why the first leads to the second.",
    phrases: [
      "Therefore,",
      "Consequently,",
      "Thus,",
      "As a result,",
      "Accordingly,",
      "Hence,",
      "Because",
      "Since"
    ]
  },
  {
    id: "addition",
    title: "Addition & Exemplification",
    description:
      "Provides extra evidence, elaboration, or a specific example for what sentence A just said.",
    phrases: [
      "For example,",
      "For instance,",
      "Specifically,",
      "In particular,",
      "Furthermore,",
      "Moreover,",
      "Additionally,"
    ]
  },
  {
    id: "similarity",
    title: "Similarity & Emphasis",
    description:
      "Reinforces or continues a train of thought in a similar direction, or stresses that the point holds.",
    phrases: ["Similarly,", "Likewise,", "Indeed,", "In fact,"]
  }
];

export const TRANSITION_CATEGORY_META: Record<
  TransitionCategory,
  { label: string; hint: string }
> = {
  contrast: {
    label: "Contrast & Concession",
    hint: "Sentence B contradicts, qualifies, or shifts direction from A."
  },
  cause: {
    label: "Causation",
    hint: "Sentence B is a result of A, or explains why A leads to B."
  },
  addition: {
    label: "Addition & Exemplification",
    hint: "Sentence B adds evidence, detail, or a specific example for A."
  },
  similarity: {
    label: "Similarity & Emphasis",
    hint: "Sentence B continues the same direction or stresses the point."
  }
};

export const TRANSITION_CATEGORY_ORDER: TransitionCategory[] = [
  "contrast",
  "cause",
  "addition",
  "similarity"
];

export function transitionPhraseId(phrase: string) {
  return phrase
    .replace(/,$/, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export function allCommonTransitionPhrases() {
  return TRANSITION_CHEAT_SHEET_SECTIONS.flatMap((section) =>
    section.phrases.map((phrase) => ({
      id: transitionPhraseId(phrase),
      phrase,
      category: section.id
    }))
  );
}

export const TRANSITION_COMMON_PHRASE_COUNT = allCommonTransitionPhrases().length;
