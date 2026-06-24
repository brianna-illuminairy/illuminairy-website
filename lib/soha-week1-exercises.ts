import { TRANSITION_COMMON_PHRASE_COUNT } from "@/lib/danielle-transitions-cheat-sheet";

export type SohaWeek1Exercise = {
  id: string;
  title: string;
  href: string;
  dueLabel: string;
  goal: string;
  summary: string;
  instructions: readonly string[];
};

export const WEEK1_POST_SESSION_EXERCISES: SohaWeek1Exercise[] = [
  {
    id: "transitions-flashcards",
    title: "Transitions category flashcards",
    href: "/soha/week-1/exercises/transitions-flashcards",
    dueLabel: "Before Transitions 1 (Sunday, June 29)",
    goal: "3 full rounds in a row at 95%+ accuracy",
    summary: `${TRANSITION_COMMON_PHRASE_COUNT} Digital SAT transitions from your study list. Pick contrast & concession, causation, addition & exemplification, similarity & emphasis, or sequence & time.`,
    instructions: [
      "Run after you have reviewed the slide deck and set up your mistake log.",
      `Work in full rounds. Each round shuffles all ${TRANSITION_COMMON_PHRASE_COUNT} phrases.`,
      "Use Explain or Show me an example on any card you are unsure about.",
      "Keep going until three consecutive full rounds each hit 95% or higher.",
      "Finish this before you start Transitions 1 in the Homework Portal.",
    ],
  },
];

export function getWeek1Exercise(id: string) {
  return WEEK1_POST_SESSION_EXERCISES.find((exercise) => exercise.id === id);
}
