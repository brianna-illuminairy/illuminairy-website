import { normalizePrepMethods } from "@/lib/sat-plan-funnel/prep-options";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";

export type Int12SatChangedCopy = {
  eyebrow: string;
  headline: string;
  subhead: string;
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
    return `Apps help, but timed digital reps still matter. Without them, test day feels foreign.`;
  }
  if (prepIds.includes("prep_youtube")) {
    return `Video helps, but timed digital reps still matter. Without them, test day feels foreign.`;
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
          "Every math question includes built-in Desmos and a formula sheet. On-screen practice is faster than paper-only drilling.",
          "Being able to solve a problem and solving it in 75 seconds are different skills."
        ]
      : [
          "Every math question includes built-in Desmos and a formula sheet. On-screen practice is faster than paper-only drilling.",
          `Being able to solve a problem and solving it in 75 seconds are different skills for ${possessive} student.`
        ];

  return {
    eyebrow: "Did you know",
    headline: "The SAT is fully digital now.",
    subhead: "Taken on a laptop, not pencil and paper.",
    paragraphs,
    analogy: [
      "Don't train for a digital test with pencil, paper, and a prep book from 2019."
    ],
    prepLine,
    footnote: "College Board: Digital SAT includes embedded Desmos and a formula sheet."
  };
}
