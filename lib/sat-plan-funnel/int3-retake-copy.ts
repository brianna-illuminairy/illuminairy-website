import { satRetakeResearch } from "@/lib/site";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";

const INT3_RETAKE_HEADLINE =
  "A new approach to the SAT, not just another retake.";

type RetakeVoice = {
  tutorParagraph: string;
};

function introAboveChart(testTaker?: string): string {
  const { cohortSizeLabel, avgPointsWithoutNewApproach } = satRetakeResearch;
  const ineffectiveLead =
    testTaker === "test_taker_self"
      ? "That's because most students use videos and practice problems to prepare, which isn't very effective."
      : "That's because most kids use videos and practice problems to prepare, which isn't very effective.";

  return `College Board data from ${cohortSizeLabel} retakers shows the average score goes up by only ~${avgPointsWithoutNewApproach} points when retesting. ${ineffectiveLead}`;
}

function retakeVoice(testTaker?: string): RetakeVoice {
  switch (testTaker) {
    case "test_taker_daughter":
      return {
        tutorParagraph:
          "A tutor changes this, figuring out what your daughter doesn't know, working through an example with her, then having her work through an example live, then reinforcing it with practice problems and reviewing any mistakes."
      };
    case "test_taker_son":
      return {
        tutorParagraph:
          "A tutor changes this, figuring out what your son doesn't know, working through an example with him, then having him work through an example live, then reinforcing it with practice problems and reviewing any mistakes."
      };
    case "test_taker_self":
      return {
        tutorParagraph:
          "A tutor changes this, figuring out what you don't know, working through an example with you, then having you work through an example live, then reinforcing it with practice problems and reviewing any mistakes."
      };
    case "test_taker_other":
    default:
      return {
        tutorParagraph:
          "A tutor changes this, figuring out what they don't know, working through an example with them, then having them work through an example live, then reinforcing it with practice problems and reviewing any mistakes."
      };
  }
}

export type Int3RetakeCopy = {
  headline: string;
  introAboveChart: string;
  paragraphs: string[];
};

export function buildInt3RetakeCopy(answers: SatPlanAnswers): Int3RetakeCopy {
  const voice = retakeVoice(answers.test_taker);

  return {
    headline: INT3_RETAKE_HEADLINE,
    introAboveChart: introAboveChart(answers.test_taker),
    paragraphs: [voice.tutorParagraph]
  };
}
