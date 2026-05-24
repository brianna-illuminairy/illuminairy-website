import { normalizePrepMethods, type PrepId } from "@/lib/sat-plan-funnel/prep-options";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";

export type Int13KidProblemCopy = {
  headline: string;
  opening: string[];
  structureBeats: string[];
  prepLine: string | null;
  spouseLine: string;
  bridge: string;
  footnote: string;
};

function voice(testTaker?: string) {
  switch (testTaker) {
    case "test_taker_daughter":
      return { subject: "she", possessive: "her", object: "her" };
    case "test_taker_son":
      return { subject: "he", possessive: "his", object: "him" };
    case "test_taker_self":
      return { subject: "you", possessive: "your", object: "you" };
    case "test_taker_other":
      return { subject: "they", possessive: "their", object: "them" };
    default:
      return { subject: "they", possessive: "their", object: "them" };
  }
}

function prepPersonalizationLine(prepIds: PrepId[], subject: string, possessive: string): string | null {
  if (prepIds.includes("prep_bluebook")) {
    return "The book wasn't wrong — solo follow-through was hard.";
  }
  if (prepIds.includes("prep_khan")) {
    return "Khan is useful, but open tabs don't assign today's three tasks.";
  }
  if (prepIds.includes("prep_little_none")) {
    return "Free resources are fine — sustainability is what separates movers from stallers.";
  }
  if (prepIds.includes("prep_youtube")) {
    return "Videos help — but without a written plan, it's easy to watch instead of practice.";
  }
  if (prepIds.includes("prep_app")) {
    return "Apps help — but without someone checking the plan, progress stalls.";
  }
  if (prepIds.includes("prep_class")) {
    return `Even with a class, ${subject} still needs a plan between sessions.`;
  }
  return null;
}

export function shouldShowKidProblem(prepMethod?: SatPlanAnswers["prep_method"]): boolean {
  const prepIds = normalizePrepMethods(prepMethod);
  if (prepIds.length === 0) return true;
  if (prepIds.includes("prep_class")) return false;
  return prepIds.some((id) =>
    ["prep_khan", "prep_bluebook", "prep_youtube", "prep_little_none", "prep_app"].includes(id)
  );
}

export function buildInt13KidProblemCopy(answers: SatPlanAnswers): Int13KidProblemCopy {
  const { subject, possessive, object } = voice(answers.test_taker);
  const prepIds = normalizePrepMethods(answers.prep_method);
  const prepLine = prepPersonalizationLine(prepIds, subject, possessive);

  const openingSelf =
    subject === "you"
      ? [
          "Prep book, Khan tab, printed schedule — it worked for a week or two.",
          "Then life happened. The materials sat unused. SAT prep became another solo homework pile.",
          "That's not failure. It's normal."
        ]
      : [
          "Prep book, Khan tab, printed schedule — it worked for a week or two.",
          `Then life happened. The materials sat unused. SAT prep became another solo homework pile for ${object}.`,
          "That's not failure. It's normal."
        ];

  const structureBeats =
    subject === "you"
      ? [
          "SAT prep is a project, not a class with attendance.",
          "Good materials don't prioritize — easy topics win over high-value gaps.",
          "Clarity beats motivation. \"Study for the SAT\" is too vague to sustain.",
          "Distraction is competing priorities, not a character flaw."
        ]
      : [
          "SAT prep is a project, not a class with attendance.",
          "Good materials don't prioritize — easy topics win over high-value gaps.",
          `Clarity beats motivation. \"Study for the SAT\" is too vague for most teens to sustain on ${possessive} own.`,
          "Distraction is competing priorities, not a character flaw."
        ];

  return {
    headline: "The kid problem nobody talks about.",
    opening: openingSelf,
    structureBeats,
    prepLine,
    spouseLine: "Materials were fine — missing today's tasks and someone checking they happened.",
    bridge:
      subject === "you"
        ? "Guided prep with a clear plan works differently — not because you need to try harder, but because the project gets managed."
        : `Guided prep with a clear plan works differently — not because ${subject} needs to try harder, but because the project gets managed.`,
    footnote:
      "College Board: students who retake without a new approach often see modest gains (~20–60 points). Results vary."
  };
}
