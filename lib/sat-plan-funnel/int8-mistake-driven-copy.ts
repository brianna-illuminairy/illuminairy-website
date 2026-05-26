import { formatPrepLabels } from "@/lib/sat-plan-funnel/prep-labels";
import {
  normalizePrepMethods,
  type PrepId
} from "@/lib/sat-plan-funnel/prep-options";
import { concreteTargetBandLabel } from "@/lib/sat-plan-funnel/score-gap";
import { studentVoice } from "@/lib/sat-plan-funnel/student-voice";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";

export type Int8MistakeProgressionStep = {
  title: string;
  status: "miss" | "tutor" | "hint" | "solo" | "mastery";
  statusMark: string;
};

export type Int8MistakeDrivenCopy = {
  headline: string;
  introParagraph: string;
  approachParagraph: string;
  closingParagraph: string;
  sessionBannerLead: string;
  sessionSkillLabel: string;
  progressionSteps: Int8MistakeProgressionStep[];
  footerLabel: string;
  footerStatus: string;
  graphicAriaLabel: string;
};

const PROGRESSION_STEPS: Int8MistakeProgressionStep[] = [
  {
    title: "Mistake Found",
    status: "miss",
    statusMark: "✕"
  },
  {
    title: "Guided Correction",
    status: "tutor",
    statusMark: "T"
  },
  {
    title: "Supported Solve",
    status: "hint",
    statusMark: "✓"
  },
  {
    title: "Independent Solve",
    status: "solo",
    statusMark: "✓"
  },
  {
    title: "Automatic",
    status: "mastery",
    statusMark: "✓"
  }
];

function meaningfulPrepIds(answers: SatPlanAnswers): PrepId[] {
  return normalizePrepMethods(answers.prep_method).filter(
    (id) => id !== "prep_little_none"
  );
}

/** "For students like Max" / your son / your daughter — never "your student". */
function forStudentsLikeLead(answers: SatPlanAnswers): string | null {
  const raw = answers.student_first_name?.trim();

  if (answers.test_taker === "test_taker_self") {
    return "For students like you";
  }

  if (raw) {
    return `For students like ${raw}`;
  }

  switch (answers.test_taker) {
    case "test_taker_daughter":
      return "For students like your daughter";
    case "test_taker_son":
      return "For students like your son";
    default:
      return null;
  }
}

function satHistoryClause(testHistory?: string, forSelf = false): string | null {
  if (forSelf) {
    switch (testHistory) {
      case "history_once":
        return "you've already taken the SAT once";
      case "history_twice":
        return "you've already taken the SAT twice";
      case "history_three_plus":
        return "you've already taken the SAT three or more times";
      case "history_psat_only":
        return "you've taken the PSAT but not the SAT yet";
      case "history_none":
        return "you haven't taken the SAT yet";
      default:
        return null;
    }
  }

  switch (testHistory) {
    case "history_once":
      return "who've already taken the SAT once";
    case "history_twice":
      return "who've already taken the SAT twice";
    case "history_three_plus":
      return "who've already taken the SAT three or more times";
    case "history_psat_only":
      return "who've taken the PSAT but not the SAT yet";
    case "history_none":
      return "who haven't taken the SAT yet";
    default:
      return null;
  }
}

function targetGapClauseSelf(answers: SatPlanAnswers): string | null {
  const band = concreteTargetBandLabel(answers.target_score);
  if (!band) return null;

  const tested =
    answers.test_history &&
    answers.test_history !== "history_none" &&
    answers.test_history !== "history_psat_only";

  if (tested) {
    return `and still need to reach ${band}`;
  }

  return `and are aiming for ${band}`;
}

function prepMethodsClause(answers: SatPlanAnswers): string | null {
  const labels = formatPrepLabels(meaningfulPrepIds(answers));
  if (!labels) return null;
  return `using ${labels}`;
}

function targetGapClause(answers: SatPlanAnswers): string | null {
  const band = concreteTargetBandLabel(answers.target_score);
  if (!band) return null;

  const tested =
    answers.test_history &&
    answers.test_history !== "history_none" &&
    answers.test_history !== "history_psat_only";

  if (tested) {
    return `and still need to reach ${band}`;
  }

  return `and are aiming for ${band}`;
}

const LECTURE_UNLIKELY =
  "lecture-based learning is unlikely to move the needle.";

function lectureUnlikelySentence(answers: SatPlanAnswers): string {
  const likeLead = forStudentsLikeLead(answers);
  const isSelf = answers.test_taker === "test_taker_self";
  const history = satHistoryClause(answers.test_history, isSelf);
  const methods = prepMethodsClause(answers);
  const target = isSelf
    ? targetGapClauseSelf(answers)
    : targetGapClause(answers);

  const whoParts: string[] = [];
  if (history) whoParts.push(history);
  if (methods) whoParts.push(methods);
  if (target) whoParts.push(target);

  if (isSelf) {
    if (whoParts.length === 0) {
      return `If you're in this situation, ${LECTURE_UNLIKELY}`;
    }
    return `If ${whoParts.join(", ")}, ${LECTURE_UNLIKELY}`;
  }

  if (likeLead) {
    if (whoParts.length === 0) {
      return `${likeLead}, ${LECTURE_UNLIKELY}`;
    }
    return `${likeLead}, ${whoParts.join(", ")}, ${LECTURE_UNLIKELY}`;
  }

  if (whoParts.length === 0) {
    return `For students in a similar situation, ${LECTURE_UNLIKELY}`;
  }

  const whoClause = whoParts.join(", ");
  return `Students ${whoClause}, ${LECTURE_UNLIKELY}`;
}

function buildLeadParagraph(answers: SatPlanAnswers): string {
  return lectureUnlikelySentence(answers);
}

function needsTutorClosing(answers: SatPlanAnswers): string {
  const voice = studentVoice(answers);

  if (voice.isSelf) {
    return "You need someone to identify what you're getting wrong, teach you so you understand it, and then practice with you until you can solve them on your own.";
  }

  const subject =
    voice.subject === "they"
      ? "They"
      : voice.subject === "he"
        ? "He"
        : "She";
  const needs = voice.subject === "they" ? "need" : "needs";
  const getting =
    voice.subject === "he"
      ? "he's"
      : voice.subject === "she"
        ? "she's"
        : "they're";
  const understands =
    voice.subject === "they" ? "understand" : "understands";
  const possessive =
    voice.subject === "they" ? "their" : voice.possessive;

  return `${subject} ${needs} someone to identify what ${getting} getting wrong, teach ${voice.object} so ${voice.subject} ${understands} it, and then practice with ${voice.object} until ${voice.subject} can solve them on ${possessive} own.`;
}

export function buildInt8MistakeDrivenCopy(
  answers: SatPlanAnswers
): Int8MistakeDrivenCopy {
  return {
    headline: "Improve faster through mistake-driven learning.",
    introParagraph: buildLeadParagraph(answers),
    approachParagraph: "",
    closingParagraph: needsTutorClosing(answers),
    sessionBannerLead: "One session · One skill",
    sessionSkillLabel: "Geometry: Right Triangles",
    progressionSteps: PROGRESSION_STEPS.map((step) => ({ ...step })),
    footerLabel: "Geometry · Mastery",
    footerStatus: "Automatic",
    graphicAriaLabel:
      "One skill session: mistake found, guided correction, supported solve, independent solve, then automatic."
  };
}
