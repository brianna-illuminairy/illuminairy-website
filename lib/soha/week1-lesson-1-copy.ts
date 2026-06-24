import { SOHA_WEEKLY_PLAN } from "@/lib/soha/weekly-plan";

const week1Plan = SOHA_WEEKLY_PLAN.find((week) => week.week === 1);

export const SOHA_WEEK1_LESSON1_TOPIC = {
  section: "Reading & Writing",
  skill: "Transitions",
} as const;

export const SOHA_WEEK1_LESSON1_PLAN_POINTS = week1Plan?.points ?? 52;

export const SOHA_WEEK1_LESSON1_OVERVIEW =
  "Transition questions give you two sentences with a word missing between them. Your job is to name how the sentences relate (contrast, cause and effect, example, addition, sequence, and so on), then pick the word that matches that relationship. The answer choices will all sound fine in the sentence. You win by naming the relationship before you read them.";

export type SohaDiagnosticTransitionMiss = {
  module: string;
  question: string;
  difficulty: "Easy" | "Medium" | "Hard";
  yourAnswer: string;
  correctAnswer: string;
  note: string;
};

export const SOHA_WEEK1_LESSON1_DIAGNOSTIC_MISSES: SohaDiagnosticTransitionMiss[] = [
  {
    module: "Module 1",
    question: "Q22",
    difficulty: "Easy",
    yourAnswer: "For example",
    correctAnswer: "In contrast",
    note: "The second sentence contradicts the first. It is not an example of the first.",
  },
  {
    module: "Module 2",
    question: "Q23",
    difficulty: "Medium",
    yourAnswer: "Additionally",
    correctAnswer: "Ultimately",
    note: "The second sentence is where the reader lands at the end, not more of the same idea.",
  },
];

export const SOHA_WEEK1_LESSON1_DIAGNOSTIC_NOTE =
  "On the diagnostic you missed 2 transition questions: Module 1, Q22 (easy) and Module 2, Q23 (medium). The Module 1 easy miss cost the most points on your score. The lesson deck walks through both.";

export const SOHA_WEEK1_LESSON1_PLAN_NOTE = (points: number) =>
  `Transitions is Week 1 on your SAT Improvement Plan. Improving here is worth up to ${points} points toward your August target.`;
