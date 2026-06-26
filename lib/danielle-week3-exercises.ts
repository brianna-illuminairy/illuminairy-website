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
    goal: "Pass all four sections before Equivalent Expressions 3",
    summary:
      "Pass all four sections before Equivalent Expressions 3. Use the formula sheet, deck, and whiteboard notes on set 3.",
    instructions: [
      "Step 1: Review the formula sheet.",
      "Step 2: Review the patterns deck from Lesson 2.",
      "Step 3: Pass Pattern spotter, FOIL builder, Combine & simplify, and Missing values (see pass targets on the hub).",
      "Step 4: Equivalent Expressions 3 in the Homework Portal (untimed, 100% accuracy).",
      "Step 5: Review every miss until you understand why. Quiz at the start of Week 4."
    ]
  }
];

export function getWeek3Exercise(id: string) {
  return WEEK3_POST_SESSION_EXERCISES.find((exercise) => exercise.id === id);
}
