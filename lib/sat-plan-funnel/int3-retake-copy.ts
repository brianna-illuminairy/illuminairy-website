import { satRetakeResearch } from "@/lib/site";
import { basedOnWhatYouShared } from "@/lib/sat-plan-funnel/diagnosis-copy";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";

const INT3_RETAKE_HEADLINE =
  "A new approach to the SAT, not just another retake.";

type RetakeVoice = {
  tutorParagraph: string;
};

function introAboveChart(answers: SatPlanAnswers): string {
  const { cohortSizeLabel, avgPointsWithoutNewApproach } = satRetakeResearch;
  const mirror = basedOnWhatYouShared(answers.test_taker);
  const historyNote =
    answers.test_history === "history_three_plus"
      ? "After multiple retakes without changing approach, "
      : "Retaking without changing approach, ";

  const ineffectiveLead =
    answers.test_taker === "test_taker_self"
      ? "the same videos-and-practice loop usually is not enough."
      : "the same videos-and-practice loop usually is not enough for them.";

  return `${mirror} — ${historyNote}College Board data from ${cohortSizeLabel} retakers shows the average score goes up by only ~${avgPointsWithoutNewApproach} points. ${ineffectiveLead}`;
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
    introAboveChart: introAboveChart(answers),
    paragraphs: [voice.tutorParagraph]
  };
}
