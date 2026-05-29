import {
  profilePatternLine,
  thePatternWeUsuallySee
} from "@/lib/sat-plan-funnel/diagnosis-copy";
import { KHAN_SAT_SKILL_COUNT, FOCUS_SKILL_COUNT } from "@/lib/sat-skills-copy";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";
import { yourStudentPhrase } from "@/lib/sat-plan-funnel/subject-pronouns";

export type Int8GroupClassFailCopy = {
  headline: string;
  paragraphs: string[];
  graphicAriaLabel: string;
};

const SAT_SKILL_COUNT = KHAN_SAT_SKILL_COUNT;

function scoreLiftPhrase(testTaker?: string): string {
  const student = yourStudentPhrase(testTaker);

  if (testTaker === "test_taker_self") {
    return "your score";
  }

  if (student === "your son") {
    return "your son's score";
  }

  if (student === "your daughter") {
    return "your daughter's score";
  }

  return "their score";
}

function patternAuthorityFallback(): string {
  const line = thePatternWeUsuallySee();
  return line.charAt(0).toUpperCase() + line.slice(1);
}

function buildParagraphs(answers: SatPlanAnswers): string[] {
  const scoreLift = scoreLiftPhrase(answers.test_taker);
  const mirror =
    profilePatternLine(answers, { includePrep: true }) ??
    patternAuthorityFallback();

  const opening = `${mirror} the same few skill gaps costing points, not weakness in every topic.`;

  return [
    `Most SAT classes try to cover all ${SAT_SKILL_COUNT} SAT skills, moving every student through the same topics at the same pace. ${opening}`,
    `They're losing points from a smaller number of recurring skill weaknesses that never get diagnosed or fully fixed. Classes teaching ${SAT_SKILL_COUNT} skills can't afford to go deep on the ${FOCUS_SKILL_COUNT} that will actually improve ${scoreLift}.`
  ];
}

export function buildInt8GroupClassFailCopy(
  answers: SatPlanAnswers
): Int8GroupClassFailCopy {
  return {
    headline: "Why group SAT classes fail",
    paragraphs: buildParagraphs(answers),
    graphicAriaLabel:
      "Classroom with fifteen students, each highlighting a different weak area, while the teacher delivers one broad lesson. Overlay: one curriculum, different weaknesses. Score progression shows minimal movement: 1100 to 1120 to 1110 to 1140."
  };
}
