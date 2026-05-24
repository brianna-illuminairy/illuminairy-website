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

export function buildInt8MistakeDrivenCopy(): Int8MistakeDrivenCopy {
  return {
    headline: "Improve faster through mistake-driven learning",
    introParagraph:
      "Students don't improve from more lectures. They improve by fixing mistakes until mastery.",
    closingParagraph:
      "This is how students who had plateaued in the 1100s or 1200s get their score up 100-250 points.",
    sessionBannerLead: "One session · One skill",
    sessionSkillLabel: "Geometry: Right Triangles",
    progressionSteps: PROGRESSION_STEPS.map((step) => ({ ...step })),
    footerLabel: "Geometry · Mastery",
    footerStatus: "Automatic",
    graphicAriaLabel:
      "One skill session: mistake found, guided correction, supported solve, independent solve, then automatic."
  };
}
