import { formatPrepLabels } from "@/lib/sat-plan-funnel/prep-labels";
import {
  normalizePrepMethods,
  PREP_SELF_STUDY_IDS,
  type PrepId
} from "@/lib/sat-plan-funnel/prep-options";
import { concreteTargetBandLabel } from "@/lib/sat-plan-funnel/score-gap";
import { subjectPronouns } from "@/lib/sat-plan-funnel/subject-pronouns";
import { studentVoice } from "@/lib/sat-plan-funnel/student-voice";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";
import { KHAN_SAT_MATH_SKILL_COUNT, KHAN_SAT_SKILL_COUNT_LABEL } from "@/lib/sat-skills-copy";

export type Int8SelfStudyFailCopy = {
  headline: string;
  leadParagraph: string;
  closingParagraph: string;
  graphicAriaLabel: string;
};

const DEFAULT_SELF_STUDY_TOOLS = "Khan Academy and Bluebook";

function selfStudyPrepIds(answers: SatPlanAnswers): PrepId[] {
  return normalizePrepMethods(answers.prep_method).filter(
    (id) => id !== "prep_little_none" && id !== "prep_class"
  );
}

function selectedSelfStudyPrep(answers: SatPlanAnswers): boolean {
  return selfStudyPrepIds(answers).some((id) => PREP_SELF_STUDY_IDS.has(id));
}

function selfStudyToolsLabel(answers: SatPlanAnswers): string {
  const labels = formatPrepLabels(selfStudyPrepIds(answers));
  return labels ?? DEFAULT_SELF_STUDY_TOOLS;
}

function openerSubject(answers: SatPlanAnswers): string {
  const raw = answers.student_first_name?.trim();
  const voice = studentVoice(answers);

  if (voice.isSelf) {
    return "You";
  }

  if (raw) {
    return raw;
  }

  switch (answers.test_taker) {
    case "test_taker_son":
      return "Your son";
    case "test_taker_daughter":
      return "Your daughter";
    default:
      return "They";
  }
}

function studiedHardOpener(answers: SatPlanAnswers): string {
  const who = openerSubject(answers);
  const tools = selfStudyToolsLabel(answers);
  const target = concreteTargetBandLabel(answers.target_score);
  const voice = studentVoice(answers);

  if (target) {
    return `${who} studied hard with ${tools}, but still didn't achieve ${target}.`;
  }

  if (voice.isSelf) {
    return `${who} studied hard with ${tools}, but your score still hasn't moved.`;
  }

  return `${who} studied hard with ${tools}, but ${voice.possessive} score still hasn't moved.`;
}

function skillsStruggleSentence(answers: SatPlanAnswers): string {
  const voice = studentVoice(answers);
  const subject = voice.isSelf ? "you" : voice.subject;

  return `Khan's SAT course covers ${KHAN_SAT_SKILL_COUNT_LABEL} skills (${KHAN_SAT_MATH_SKILL_COUNT} in math alone) — ${subject} probably struggled to identify which ones to focus on to actually improve ${voice.possessive} score.`;
}

function buildLeadParagraph(answers: SatPlanAnswers): string {
  return `${studiedHardOpener(answers)} ${skillsStruggleSentence(answers)}`;
}

function headline(answers: SatPlanAnswers): string {
  return selectedSelfStudyPrep(answers)
    ? "Why self-study failed"
    : "Why self-study fails";
}

const CLOSING_HELP_STEPS =
  "1) diagnose & prioritize what to focus on, 2) learn the content, and 3) drill until memorized";

function closingParagraph(testTaker?: string): string {
  const { subject } = subjectPronouns(testTaker);

  if (testTaker === "test_taker_self") {
    return `Without someone to help you ${CLOSING_HELP_STEPS}, simply doing practice problems doesn't help raise your score.`;
  }

  if (subject === "he") {
    return `Without someone to help him ${CLOSING_HELP_STEPS}, simply doing practice problems doesn't help raise his score.`;
  }

  if (subject === "she") {
    return `Without someone to help her ${CLOSING_HELP_STEPS}, simply doing practice problems doesn't help raise her score.`;
  }

  return `Without someone to help them ${CLOSING_HELP_STEPS}, simply doing practice problems doesn't help raise their score.`;
}

export function buildInt8SelfStudyFailCopy(
  answers: SatPlanAnswers
): Int8SelfStudyFailCopy {
  return {
    headline: headline(answers),
    leadParagraph: buildLeadParagraph(answers),
    closingParagraph: closingParagraph(answers.test_taker),
    graphicAriaLabel:
      "Messy self-study dashboard with practice tests, random videos, scattered SAT topics, and a long checklist. An overwhelmed student sits in the middle. Overlay: more studying does not equal targeted improvement. Bottom line: lots of effort, little score movement."
  };
}
