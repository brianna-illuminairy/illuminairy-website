import {
  profilePatternLine,
  studentsWithProfileTypically
} from "@/lib/sat-plan-funnel/diagnosis-copy";
import { targetBandLabel } from "@/lib/sat-plan-funnel/score-gap";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";

export type Int8MistakeProgressionStep = {
  title: string;
  status: "miss" | "tutor" | "hint" | "solo" | "mastery";
  statusMark: string;
};

export type Int8MistakeDrivenCopy = {
  headline: string;
  introParagraph: string;
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

function introParagraph(answers: SatPlanAnswers): string {
  const mirror = profilePatternLine(answers, { includePrep: true });
  const lead = mirror ? `${mirror} ` : "";

  if (answers.test_taker === "test_taker_self") {
    return `${lead}You don't improve from more lectures — you improve by fixing mistakes until they stick.`;
  }

  return `${lead}More lectures rarely move the score. Fixing mistakes until they stick does.`;
}

function closingParagraph(answers: SatPlanAnswers): string {
  const goal = targetBandLabel(answers.target_score);
  const profileLead = studentsWithProfileTypically(answers);

  if (answers.test_taker === "test_taker_self") {
    return `${profileLead} close gaps one at a time through mistake-driven practice — often 100–250 points when prep targets the right skills for ${goal}.`;
  }

  return `${profileLead} close gaps one at a time through mistake-driven practice — often 100–250 points when prep targets the right skills on the way to ${goal}.`;
}

export function buildInt8MistakeDrivenCopy(
  answers: SatPlanAnswers
): Int8MistakeDrivenCopy {
  return {
    headline: "Improve faster through mistake-driven learning",
    introParagraph: introParagraph(answers),
    closingParagraph: closingParagraph(answers),
    sessionBannerLead: "One session · One skill",
    sessionSkillLabel: "Geometry: Right Triangles",
    progressionSteps: PROGRESSION_STEPS.map((step) => ({ ...step })),
    footerLabel: "Geometry · Mastery",
    footerStatus: "Automatic",
    graphicAriaLabel:
      "One skill session: mistake found, guided correction, supported solve, independent solve, then automatic."
  };
}
