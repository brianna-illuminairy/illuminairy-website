import { GPA_OPTIONS } from "@/lib/sat-plan-funnel/gpa-options";
import { studentPossessiveLabel } from "@/lib/sat-plan-funnel/student-voice";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";

export type Int2CopyPart = {
  text: string;
  bold?: boolean;
  accent?: boolean;
  italic?: boolean;
};

export type Int2CompareCard = {
  contextLabel: string;
  rewardHeading: string;
  habits: string[];
};

export type Int2GpaParadoxCopy = {
  headlinePrefix: string;
  headlineAccent: string;
  quoteParts: Int2CopyPart[];
  schoolCard: Int2CompareCard;
  satCard: Int2CompareCard;
  insightParts: Int2CopyPart[];
  tutorName: string;
  tutorTitle: string;
};

function gpaDisplayLabel(gpaBand?: string): string | null {
  if (!gpaBand) return null;
  return GPA_OPTIONS.find((row) => row.id === gpaBand)?.label ?? null;
}

function subjectForms(testTaker?: string): {
  possessive: string;
  optimizedClosing: string;
} {
  switch (testTaker) {
    case "test_taker_daughter":
      return {
        possessive: "her",
        optimizedClosing: "She's optimized for the wrong scoring environment."
      };
    case "test_taker_son":
      return {
        possessive: "his",
        optimizedClosing: "He's optimized for the wrong scoring environment."
      };
    case "test_taker_self":
      return {
        possessive: "your",
        optimizedClosing: "You're optimized for the wrong scoring environment."
      };
    default:
      return {
        possessive: "their",
        optimizedClosing: "They're optimized for the wrong scoring environment."
      };
  }
}

function gpaParadoxLead(answers: SatPlanAnswers): string {
  const gpa = gpaDisplayLabel(answers.gpa_band) ?? "strong";
  const intelligenceOwner = studentPossessiveLabel(answers);
  return `Given a ${gpa} GPA, it's not ${intelligenceOwner} intelligence that's the issue.`;
}

export function buildInt2GpaParadoxCopy(answers: SatPlanAnswers): Int2GpaParadoxCopy {
  const self = answers.test_taker === "test_taker_self";
  const { possessive, optimizedClosing } = subjectForms(answers.test_taker);

  const headlinePrefix = self
    ? "We help students like you "
    : "We help high-GPA students ";
  const headlineAccent = self ? "raise your SAT score." : "raise their SAT scores.";

  return {
    headlinePrefix,
    headlineAccent,
    quoteParts: [
      { text: `${gpaParadoxLead(answers)} ` },
      {
        text: "It's common for smart students with high GPAs to score lower than expected on the SAT. "
      },
      { text: "The same habits that earn " },
      { text: `${possessive} ` },
      { text: "A's in class quietly cost points on a test scored on pace. " },
      { text: optimizedClosing }
    ],
    schoolCard: {
      contextLabel: "In school",
      rewardHeading: "Rewards taking your time.",
      habits: [
        "Reading/Re-Reading Passages",
        "Showing Work by Hand",
        "Double Checking",
        "Sticking With Hard Problems"
      ]
    },
    satCard: {
      contextLabel: "On the SAT",
      rewardHeading: "Rewards speed.",
      habits: [
        "Skimming Passages",
        "Calculator Shortcuts",
        "Moving on Quickly",
        "Recognizing Patterns"
      ]
    },
    insightParts: [
      { text: "The SAT is timed over " },
      { text: "2hr 14 mins", bold: true, accent: true },
      { text: ", and also tests " },
      { text: "focus, stamina, and speed.", bold: true }
    ],
    tutorName: "Maya Reinhart",
    tutorTitle: "Head tutor · Illuminairy"
  };
}
