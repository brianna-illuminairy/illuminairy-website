export type DanielleWeek3Exercise = {
  id: string;
  title: string;
  href: string;
  goal: string;
  summary: string;
  instructions: readonly string[];
};

export const WEEK3_POST_SESSION_EXERCISES: DanielleWeek3Exercise[] = [
  {
    id: "equivalent-expressions-practice",
    title: "Equivalent expressions practice hub",
    href: "/danielle/week-3/exercises/equivalent-expressions",
    goal: "Pass all 4 sections (20 reps each): pattern 17/20 · FOIL 72/80 · combine 17/20 · missing 17/20",
    summary:
      "80 total reps across pattern spotting, FOIL speed, combine/simplify, and missing values. Ramps warm-up to stretch for SAT pace.",
    instructions: [
      "Section 1 · Pattern spotter (20): pass at 17 of 20. Spot DOS, perfect squares, and trinomials, including coefficient tricks.",
      "Section 2 · FOIL builder (20 products, 80 steps): unlocks after pattern pass. Pass at 72 of 80 steps.",
      "Section 3 · Combine & simplify (20): distribute, expand, combine like terms. Pass at 17 of 20.",
      "Section 4 · Missing values (20): unlocks after combine pass. Pass at 17 of 20, then Homework Portal set 3."
    ]
  }
];

export function getWeek3Exercise(id: string) {
  return WEEK3_POST_SESSION_EXERCISES.find((exercise) => exercise.id === id);
}
