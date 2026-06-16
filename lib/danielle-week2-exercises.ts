import { TRANSITION_COMMON_PHRASE_COUNT } from "@/lib/danielle-transitions-cheat-sheet";

export type DanielleWeek2Exercise = {
  id: string;
  title: string;
  href: string;
  dueLabel: string;
  goal: string;
  summary: string;
  instructions: readonly string[];
};

export const WEEK2_POST_SESSION_EXERCISES: DanielleWeek2Exercise[] = [
  {
    id: "transitions-flashcards",
    title: "Transitions category flashcards",
    href: "/danielle/week-2/exercises/transitions-flashcards",
    dueLabel: "Wednesday, June 17 (before Transitions 1)",
    goal: `95% overall accuracy (after ${TRANSITION_COMMON_PHRASE_COUNT} cards)`,
    summary:
      `${TRANSITION_COMMON_PHRASE_COUNT} most common Digital SAT transitions. Pick contrast & concession, causation, addition & exemplification, or similarity & emphasis.`,
    instructions: [
      "Run after you have reviewed the slide deck and memorized the cheat sheet categories.",
      `Work in rounds. Each round shuffles all ${TRANSITION_COMMON_PHRASE_COUNT} phrases.`,
      "Use Explain or Show me an example on any card you are unsure about.",
      `Keep going until overall accuracy is 95% with at least ${TRANSITION_COMMON_PHRASE_COUNT} attempts logged.`,
      "Finish this before you start Transitions 1 in the Homework Portal."
    ]
  }
];

export function getWeek2Exercise(id: string) {
  return WEEK2_POST_SESSION_EXERCISES.find((exercise) => exercise.id === id);
}
