import { normalizePrepMethods } from "@/lib/sat-plan-funnel/prep-options";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";

export type Int12SatChangedCopy = {
  eyebrow: string;
  headline: string;
  paragraphs: string[];
  analogy: string[];
  prepLine: string | null;
  footnote: string;
};

function voice(testTaker?: string) {
  switch (testTaker) {
    case "test_taker_daughter":
      return { subject: "she", possessive: "her" };
    case "test_taker_son":
      return { subject: "he", possessive: "his" };
    case "test_taker_self":
      return { subject: "you", possessive: "your" };
    case "test_taker_other":
      return { subject: "they", possessive: "their" };
    default:
      return { subject: "they", possessive: "their" };
  }
}

function prepPersonalizationLine(
  prepIds: ReturnType<typeof normalizePrepMethods>,
  subject: string
): string | null {
  if (prepIds.includes("prep_bluebook")) {
    return "Paper practice tests don't teach scrolling, highlighting, or Desmos.";
  }
  if (prepIds.includes("prep_class")) {
    return "Many classes still run paper drills; test day is on a laptop.";
  }
  if (prepIds.includes("prep_khan") || prepIds.includes("prep_app")) {
    return `Apps help — but if ${subject} never trains timed digital reps, test day still feels foreign.`;
  }
  if (prepIds.includes("prep_youtube")) {
    return `Video lessons help — but if ${subject} never trains timed digital reps, test day still feels foreign.`;
  }
  return null;
}

export function buildInt12SatChangedCopy(answers: SatPlanAnswers): Int12SatChangedCopy {
  const { subject, possessive } = voice(answers.test_taker);
  const prepIds = normalizePrepMethods(answers.prep_method);
  const prepLine = prepPersonalizationLine(prepIds, subject);

  const paragraphs =
    subject === "you"
      ? [
          "Every math question includes a built-in graphing calculator (Desmos) and a formula reference sheet — no bringing your own.",
          "Students who practice with the on-screen tools are much faster on math than students who only drill on paper.",
          "Strong math students often skip the calculator because they don't need it — but can do it and can do it in 75 seconds are different skills."
        ]
      : [
          "Every math question includes a built-in graphing calculator (Desmos) and a formula reference sheet — no bringing your own.",
          "Students who practice with the on-screen tools are much faster on math than students who only drill on paper.",
          `Strong math students often skip the calculator because they don't need it — but can do it and can do it in 75 seconds are different skills for ${possessive} student.`
        ];

  return {
    eyebrow: "Did you know",
    headline:
      "The SAT is fully digital now — taken on a laptop, not with pencil and paper.",
    paragraphs,
    analogy: [
      "You wouldn't train for a baseball game on a football field.",
      "Don't train for a digital test with pencil, paper, and a prep book from 2019."
    ],
    prepLine,
    footnote:
      "College Board: Digital SAT format includes embedded Desmos and a formula sheet. Speed comparisons vary by student."
  };
}
