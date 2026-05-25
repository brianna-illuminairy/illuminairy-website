import {
  prepMirrorPhrase,
  profilePatternLine
} from "@/lib/sat-plan-funnel/diagnosis-copy";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";
import { subjectPronouns, yourStudentPhrase } from "@/lib/sat-plan-funnel/subject-pronouns";

export type Int8SelfStudyFailCopy = {
  headline: string;
  leadParagraph: string;
  closingParagraph: string;
  graphicAriaLabel: string;
};

const EFFORT_INLINE =
  "Bluebook, Khan Academy, Practice Tests, YouTube";

const FOCUS_GAP =
  "which of the 28 SAT skills to focus on that would actually improve";

function leadParagraph(answers: SatPlanAnswers): string {
  const testTaker = answers.test_taker;
  const { subject } = subjectPronouns(testTaker);
  const student = yourStudentPhrase(testTaker);
  const mirror = prepMirrorPhrase(answers) ?? profilePatternLine(answers, { includePrep: true });
  const prefix = mirror ? `${mirror} ` : "";

  if (testTaker === "test_taker_self") {
    return `${prefix}You probably studied hard: ${EFFORT_INLINE}. But you likely struggled to identify ${FOCUS_GAP} your score.`;
  }

  if (student) {
    const who = student.charAt(0).toUpperCase() + student.slice(1);
    const scoreWord =
      subject === "he" ? "his" : subject === "she" ? "her" : "their";
    return `${prefix}${who} probably studied hard: ${EFFORT_INLINE}. But ${subject} likely struggled to identify ${FOCUS_GAP} ${scoreWord} score.`;
  }

  return `${prefix}They probably studied hard: ${EFFORT_INLINE}. But they likely struggled to identify ${FOCUS_GAP} their score.`;
}

const CLOSING_HELP_STEPS =
  "1) diagnose & prioritize what to focus on, 2) learn the content, and 3) drill until memorized";

function closingParagraph(testTaker?: string): string {
  const { subject } = subjectPronouns(testTaker);

  if (testTaker === "test_taker_self") {
    return `Without someone to help you ${CLOSING_HELP_STEPS}, simply doing practice problems won't help raise your score.`;
  }

  if (subject === "he") {
    return `Without someone to help him ${CLOSING_HELP_STEPS}, simply doing practice problems won't help raise his score.`;
  }

  if (subject === "she") {
    return `Without someone to help her ${CLOSING_HELP_STEPS}, simply doing practice problems won't help raise her score.`;
  }

  return `Without someone to help them ${CLOSING_HELP_STEPS}, simply doing practice problems won't help raise their score.`;
}

export function buildInt8SelfStudyFailCopy(
  answers: SatPlanAnswers
): Int8SelfStudyFailCopy {
  return {
    headline: "Why self-study fails",
    leadParagraph: leadParagraph(answers),
    closingParagraph: closingParagraph(answers.test_taker),
    graphicAriaLabel:
      "Messy self-study dashboard with practice tests, random videos, scattered SAT topics, and a long checklist. An overwhelmed student sits in the middle. Overlay: more studying does not equal targeted improvement. Bottom line: lots of effort, little score movement."
  };
}
