import { normalizePrepMethods } from "@/lib/sat-plan-funnel/prep-options";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";

export type Int12SatChangedCopy = {
  headlinePrefix: string;
  headlineAccent: string;
  headlineSuffix: string;
  introAboveVisual: string;
  paragraphs: string[];
  closingLine: string;
  prepLine: string | null;
  footnote: string;
};

function prepPersonalizationLine(
  prepIds: ReturnType<typeof normalizePrepMethods>
): string | null {
  if (prepIds.includes("prep_class")) {
    return "Many classes still run paper drills; test day is on a laptop.";
  }
  if (prepIds.includes("prep_khan") || prepIds.includes("prep_app")) {
    return "Apps help, but timed digital reps still matter. Without them, test day feels foreign.";
  }
  if (prepIds.includes("prep_youtube")) {
    return "Video helps, but timed digital reps still matter. Without them, test day feels foreign.";
  }
  return null;
}

export function buildInt12SatChangedCopy(answers: SatPlanAnswers): Int12SatChangedCopy {
  const prepIds = normalizePrepMethods(answers.prep_method);
  const prepLine = prepPersonalizationLine(prepIds);

  return {
    headlinePrefix: "Did you know, the SAT is ",
    headlineAccent: "fully digital",
    headlineSuffix: " now.",
    introAboveVisual:
      "It's taken on a laptop, not pencil and paper, and it includes built-in tools that students have to use in order to not run out of time.",
    paragraphs: [
      "70–85% of all math questions can be solved directly using the built-in formula sheet and calculator. Students who don't know this or don't use it score lower than those who do.",
      "We train our students in the same format, with the same on-screen tools they'll see on test day, to help increase their speed."
    ],
    closingLine:
      "Don't train for a digital test with pencil, paper, and a prep book from 2019.",
    prepLine,
    footnote: "College Board: Digital SAT includes embedded Desmos and a formula sheet."
  };
}
