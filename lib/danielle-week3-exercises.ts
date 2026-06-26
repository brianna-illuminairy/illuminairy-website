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
      "Pass all four sections before Equivalent Expressions 3. Use the formula sheet, deck, and whiteboard notes on set 3; use solutions and the chatbot for miss review.",
    instructions: [
      "Step 1: Review the formula sheet.",
      "Step 2: Review the patterns deck from Lesson 2.",
      "Step 3: Pass Pattern spotter, FOIL builder, Combine & simplify, and Missing values (see pass targets on the hub).",
      "Step 4: Equivalent Expressions 3 in the Homework Portal (untimed, 100% accuracy).",
      "Step 5: For each miss, read the solution, then use the Homework Portal chatbot for more of that question type until you can do them on your own (3 correct in a row per miss).",
      "Step 6: Equivalent Expressions Quiz at the start of Week 4."
    ]
  }
];

export function getWeek3Exercise(id: string) {
  return WEEK3_POST_SESSION_EXERCISES.find((exercise) => exercise.id === id);
}
