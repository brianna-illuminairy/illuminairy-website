import {
  basedOnWhatYouShared,
  profilePatternLine,
  wrongMirrorSnippet
} from "@/lib/sat-plan-funnel/diagnosis-copy";
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

function patternLine(testTaker?: string): string {
  switch (testTaker) {
    case "test_taker_daughter":
      return "It's not her. It's a known pattern.";
    case "test_taker_son":
      return "It's not him. It's a known pattern.";
    case "test_taker_self":
      return "It's not you. It's a known pattern.";
    default:
      return "It's not them. It's a known pattern.";
  }
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

export function buildInt2GpaParadoxCopy(answers: SatPlanAnswers): Int2GpaParadoxCopy {
  const self = answers.test_taker === "test_taker_self";
  const { possessive, optimizedClosing } = subjectForms(answers.test_taker);
  const mirror =
    profilePatternLine(answers, { includePrep: true, includeScoreBand: true }) ??
    basedOnWhatYouShared(answers.test_taker);
  const wrongBit = wrongMirrorSnippet(answers.wrong_reasons);

  const headlinePrefix = self
    ? "We help students like you "
    : "We help high-GPA students ";
  const headlineAccent = self ? "raise your SAT score." : "raise their SAT scores.";

  const quoteLead: Int2CopyPart[] = [{ text: `${mirror}. ` }];
  if (wrongBit) {
    quoteLead.push({
      text: `Often ${wrongBit}. `,
      italic: true
    });
  }
  quoteLead.push({ text: `${patternLine(answers.test_taker)} ` });

  return {
    headlinePrefix,
    headlineAccent,
    quoteParts: [
      ...quoteLead,
      { text: "The " },
      { text: "same habits", italic: true },
      { text: ` that earn ${possessive} A's in class ` },
      { text: "quietly cost points", bold: true, accent: true },
      { text: " on a test scored on pace. " },
      { text: optimizedClosing },
    ],
    schoolCard: {
      contextLabel: "In school",
      rewardHeading: "Rewards depth.",
      habits: [
        "Persistence",
        "Revision & precision",
        "Showing your work",
        "Long-term effort",
      ],
    },
    satCard: {
      contextLabel: "On the SAT",
      rewardHeading: "Rewards speed.",
      habits: [
        "Pattern recognition",
        "Pacing under pressure",
        "Calculator-first math",
        "Cognitive endurance",
      ],
    },
    insightParts: [
      { text: "It's not a knowledge test.", bold: true },
      { text: " It's a " },
      { text: "speed & stamina test", bold: true, accent: true },
      { text: ", scored on a 2 hr 14 min clock. " },
      { text: "A lower SAT score usually has more to do with " },
      { text: "pacing and test strategy than intelligence.", bold: true },
      { text: " The good news: " },
      { text: "those skills are trainable.", bold: true, accent: true },
      { text: " With the right plan, fast." },
    ],
    tutorName: "Maya Reinhart",
    tutorTitle: "Head tutor · Illuminairy",
  };
}
