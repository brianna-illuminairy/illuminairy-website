import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";

export type StudentVoice = {
  name: string;
  subject: string;
  possessive: string;
  object: string;
  isSelf: boolean;
};

/** Display name for copy — falls back when parent skipped the name field. */
export function studentDisplayName(answers: SatPlanAnswers): string {
  const raw = answers.student_first_name?.trim();
  if (raw) return raw;
  switch (answers.test_taker) {
    case "test_taker_daughter":
      return "your daughter";
    case "test_taker_son":
      return "your son";
    case "test_taker_self":
      return "you";
    default:
      return "your student";
  }
}

export function studentVoice(answers: SatPlanAnswers): StudentVoice {
  const name = studentDisplayName(answers);
  switch (answers.test_taker) {
    case "test_taker_daughter":
      return { name, subject: "she", possessive: "her", object: "her", isSelf: false };
    case "test_taker_son":
      return { name, subject: "he", possessive: "his", object: "him", isSelf: false };
    case "test_taker_self":
      return { name, subject: "you", possessive: "your", object: "you", isSelf: true };
    case "test_taker_other":
      return { name, subject: "they", possessive: "their", object: "them", isSelf: false };
    default:
      return { name, subject: "they", possessive: "their", object: "them", isSelf: false };
  }
}

/** Headline-safe possessive: "Maya's" vs "your daughter's". */
export function studentPossessiveLabel(answers: SatPlanAnswers): string {
  return funnelPossessiveLabel(answers.test_taker, answers.student_first_name);
}

/**
 * Subject for intake headlines — first name, your son/daughter, you, or they.
 * `linkingVerb` is "is" for he/she/name and "are" for you/they.
 */
export function funnelSubjectPhrase(
  testTaker?: string,
  firstName?: string
): { phrase: string; linkingVerb: "is" | "are" } {
  const raw = firstName?.trim();

  if (testTaker === "test_taker_self") {
    return { phrase: "you", linkingVerb: "are" };
  }

  if (raw) {
    return { phrase: raw, linkingVerb: "is" };
  }

  switch (testTaker) {
    case "test_taker_daughter":
      return { phrase: "your daughter", linkingVerb: "is" };
    case "test_taker_son":
      return { phrase: "your son", linkingVerb: "is" };
    case "test_taker_other":
    default:
      return { phrase: "they", linkingVerb: "are" };
  }
}

/** Possessive for headlines — Max's / her / your / their. */
export function funnelPossessiveLabel(
  testTaker?: string,
  firstName?: string
): string {
  const raw = firstName?.trim();

  if (testTaker === "test_taker_self") {
    return "your";
  }

  if (raw) {
    return `${raw}'s`;
  }

  switch (testTaker) {
    case "test_taker_daughter":
      return "her";
    case "test_taker_son":
      return "his";
    case "test_taker_other":
    default:
      return "their";
  }
}
