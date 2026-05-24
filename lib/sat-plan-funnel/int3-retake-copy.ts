import { satRetakeResearch } from "@/lib/site";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";
import type { HistoryId } from "@/lib/sat-plan-funnel/history-options";

type RetakeVoice = {
  headline: string;
  subject: string;
  possessive: string;
  object: string;
  isSelf: boolean;
};

function retakeVoice(testTaker?: string): RetakeVoice {
  switch (testTaker) {
    case "test_taker_daughter":
      return {
        headline: "She needs new prep, not just another retake.",
        subject: "she",
        possessive: "her",
        object: "her",
        isSelf: false
      };
    case "test_taker_son":
      return {
        headline: "He needs new prep, not just another retake.",
        subject: "he",
        possessive: "his",
        object: "him",
        isSelf: false
      };
    case "test_taker_self":
      return {
        headline: "You need new prep, not just another retake.",
        subject: "you",
        possessive: "your",
        object: "you",
        isSelf: true
      };
    case "test_taker_other":
      return {
        headline: "They need new prep, not just another retake.",
        subject: "they",
        possessive: "their",
        object: "them",
        isSelf: false
      };
    default:
      return {
        headline: "They need new prep, not just another retake.",
        subject: "they",
        possessive: "their",
        object: "them",
        isSelf: false
      };
  }
}

function timesTakenPhrase(historyId?: string): string {
  if (historyId === "history_three_plus") return "three or more times";
  return "twice";
}

function isSingularThey(voice: RetakeVoice): boolean {
  return voice.subject === "they";
}

function haveTaken(voice: RetakeVoice): string {
  if (voice.isSelf) return "you've";
  if (isSingularThey(voice)) return "they've";
  return `${voice.subject} has`;
}

function alreadyKnow(voice: RetakeVoice): string {
  if (voice.isSelf) return "you already know";
  if (isSingularThey(voice)) return "they already know";
  return `${voice.subject} already knows`;
}

function studyTimeSpreads(voice: RetakeVoice): string {
  if (voice.isSelf) return "your study time spreads too wide";
  return `${voice.possessive} study time spreads too wide`;
}

function drillingWeakArea(voice: RetakeVoice): string {
  if (voice.isSelf) {
    return "you keep drilling a weak area you can't teach yourself";
  }
  if (voice.subject === "she") {
    return "she keeps drilling a weak area she can't teach herself";
  }
  if (voice.subject === "he") {
    return "he keeps drilling a weak area he can't teach himself";
  }
  return "they keep drilling a weak area they can't teach themselves";
}

/** Stat + same-prep cycle; one block to fit 390×844 without scroll. */
function retakeRealityBlock(voice: RetakeVoice, timesTaken: string): string {
  const { cohortSizeLabel, retakersScoreLowerPct } = satRetakeResearch;
  const taken = haveTaken(voice);
  const knows = alreadyKnow(voice);

  const focusGap = voice.isSelf
    ? "you may not know what to focus on"
    : isSingularThey(voice)
      ? "they may not know what to focus on"
      : `${voice.subject} may not know what to focus on`;

  return `College Board data from ${cohortSizeLabel} retakers: ${retakersScoreLowerPct}% score lower when nothing changes. If ${taken} taken the SAT ${timesTaken} with little change, it's usually more practice tests and videos. That only helps when ${knows} the content and pacing. When there's a gap, ${focusGap}, so ${studyTimeSpreads(voice)}, or ${drillingWeakArea(voice)}.`;
}

function keepMissing(voice: RetakeVoice): string {
  if (voice.isSelf) return "you keep missing";
  if (isSingularThey(voice)) return "they keep missing";
  return `${voice.subject} keeps missing`;
}

/** Videos + tutor pivot; second block only. */
function tutorPivotBlock(voice: RetakeVoice): string {
  const missing = keepMissing(voice);

  if (voice.isSelf) {
    return `What changes is a tutor who sees what ${missing}, walks you through stuck questions, and has you work problems until you can do them alone.`;
  }

  return `What changes is a tutor who sees what ${missing}, walks ${voice.object} through stuck questions, and has ${voice.object} work problems until ${voice.subject} can do them alone.`;
}

export type Int3RetakeCopy = {
  headline: string;
  paragraphs: string[];
};

export function buildInt3RetakeCopy(answers: SatPlanAnswers): Int3RetakeCopy {
  const voice = retakeVoice(answers.test_taker);
  const timesTaken = timesTakenPhrase(
    answers.test_history as HistoryId | undefined
  );

  return {
    headline: voice.headline,
    paragraphs: [retakeRealityBlock(voice, timesTaken), tutorPivotBlock(voice)]
  };
}
