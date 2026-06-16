import {
  allCommonTransitionPhrases,
  TRANSITION_CATEGORY_META,
  TRANSITION_COMMON_PHRASE_COUNT,
  type TransitionCategory
} from "@/lib/danielle-transitions-cheat-sheet";

export type TransitionFlashcard = {
  id: string;
  phrase: string;
  category: TransitionCategory;
};

export type FlashcardRoundRecord = {
  round: number;
  correct: number;
  total: number;
  accuracy: number;
  completedAt: string;
};

export const TRANSITION_FLASHCARD_GOAL_ACCURACY = 0.95;
export const TRANSITION_FLASHCARD_MIN_ATTEMPTS = TRANSITION_COMMON_PHRASE_COUNT;

export { TRANSITION_CATEGORY_META };

/** Most common Digital SAT transition phrases → relationship category. */
export const TRANSITION_FLASHCARDS: TransitionFlashcard[] = allCommonTransitionPhrases();

const FLASHCARD_EXAMPLE_OVERRIDES: Partial<Record<string, string>> = {
  however:
    "The poem looked too plain for deep analysis. However, one critic devoted an entire essay to its opening stanza.",
  nevertheless:
    "The first trials failed. Nevertheless, the lab kept refining the method until it worked.",
  nonetheless:
    "The evidence was thin. Nonetheless, the committee approved the grant.",
  instead:
    "She could have skipped the revision. Instead, she rewrote the whole paragraph.",
  alternatively:
    "Teams could survey every site by hand. Alternatively, they could use satellite maps first.",
  conversely:
    "Northern sites showed rapid growth. Conversely, southern plots lost cover over the same period.",
  "in-contrast":
    "The painting suggests deep space. In contrast, its subtitle reveals the image is only paint swatches.",
  therefore:
    "Higher rhythmicity predicted faster mastery. Therefore, teachers prioritized predictable beat patterns first.",
  consequently:
    "The sample was too small. Consequently, the team could not publish the findings.",
  thus:
    "The roads were icy. Thus, schools delayed the morning buses.",
  "as-a-result":
    "Rain softened the clay. As a result, the trail closed for the afternoon.",
  accordingly:
    "The grant required public data. Accordingly, the lab posted every table online.",
  hence:
    "The effect was tiny. Hence, the team reran the trial with a larger sample.",
  because:
    "The roads were icy. Because visibility was near zero, drivers stayed home.",
  since:
    "The data were inconclusive. Since the effect was small, the lab reran the trial.",
  "for-example":
    "Many animals navigate by the sun. For example, bees also use magnetic fields when clouds block the sky.",
  "for-instance":
    "Big trees store centuries of carbon. For instance, one redwood holds more than a small forest.",
  specifically:
    "The program raised reading scores. Specifically, every grade level posted gains.",
  "in-particular":
    "The festival drew artists from abroad. In particular, three painters arrived from Chile.",
  furthermore:
    "The portrait uses bold color. Furthermore, it layers texture in the same style.",
  moreover:
    "The study tracked sleep. Moreover, it measured memory the next morning.",
  additionally:
    "The lab tested soil pH. Additionally, it recorded moisture at each plot.",
  similarly:
    "The first treaty protected river access. Similarly, the second treaty extended those rights inland.",
  likewise:
    "The first treaty protected river access. Likewise, the second treaty extended those rights inland.",
  indeed:
    "The method looked fragile. Indeed, it held up under every stress test.",
  "in-fact":
    "The method looked fragile. In fact, it held up under every stress test."
};

function categoryJobPhrase(category: TransitionCategory) {
  switch (category) {
    case "contrast":
      return "pushes back, qualifies, or contradicts sentence A";
    case "cause":
      return "is a result of sentence A, or explains why A leads to B";
    case "addition":
      return "adds evidence, detail, or a specific example for sentence A";
    case "similarity":
      return "continues the same direction or stresses that the point holds";
  }
}

export function getFlashcardExplain(card: TransitionFlashcard) {
  const meta = TRANSITION_CATEGORY_META[card.category];
  return `${card.phrase} belongs in ${meta.label}. After the blank, sentence B ${categoryJobPhrase(card.category)}. ${meta.hint}`;
}

export function getFlashcardExample(card: TransitionFlashcard) {
  const override = FLASHCARD_EXAMPLE_OVERRIDES[card.id];
  if (override) return override;

  const phrase = card.phrase;
  switch (card.category) {
    case "contrast":
      return `The first result looked disappointing. ${phrase} the follow-up study found a clear pattern.`;
    case "cause":
      return `The sample was too small. ${phrase} the team could not publish the findings.`;
    case "addition":
      return `The program raised reading scores. ${phrase} one school saw gains in every grade level.`;
    case "similarity":
      return `The portrait uses bold color. ${phrase} it layers texture in the same style.`;
  }
}

export function shuffleFlashcardIds(ids: string[]) {
  const copy = ids.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function allFlashcardIds() {
  return TRANSITION_FLASHCARDS.map((card) => card.id);
}

export function flashcardAccuracy(correct: number, attempts: number) {
  if (attempts === 0) return 0;
  return correct / attempts;
}

export function hasMetFlashcardGoal(correct: number, attempts: number) {
  return (
    attempts >= TRANSITION_FLASHCARD_MIN_ATTEMPTS &&
    flashcardAccuracy(correct, attempts) >= TRANSITION_FLASHCARD_GOAL_ACCURACY
  );
}
