export type Int8MistakeFlowStep = {
  label: string;
  isMastery?: boolean;
};

export type Int8MistakeDrillQuestion = {
  label: string;
  mastered: boolean;
};

export type Int8MistakeDrivenCopy = {
  headline: string;
  introParagraphs: string[];
  sessionIntro: string;
  sessionSteps: string[];
  closingParagraphs: string[];
  flowSteps: Int8MistakeFlowStep[];
  drillTitle: string;
  drillQuestions: Int8MistakeDrillQuestion[];
  graphicAriaLabel: string;
};

const FLOW_STEPS: Int8MistakeFlowStep[] = [
  { label: "Together" },
  { label: "Mistake" },
  { label: "Fix" },
  { label: "Retry" },
  { label: "Solo" },
  { label: "Mastered", isMastery: true }
];

const DRILL_QUESTIONS: Int8MistakeDrillQuestion[] = [
  { label: "Q1", mastered: true },
  { label: "Q2", mastered: true },
  { label: "Q3", mastered: true },
  { label: "Q4", mastered: false },
  { label: "Q5", mastered: false }
];

export function buildInt8MistakeDrivenCopy(): Int8MistakeDrivenCopy {
  return {
    headline: "Real improvement happens inside the mistakes.",
    introParagraphs: [
      "Scores move when students fix misses in real time, with feedback and repetition, not from more lectures."
    ],
    sessionIntro: "One skill per session:",
    sessionSteps: [
      "Examples together, thinking out loud, fix mistakes, repeat until automatic"
    ],
    closingParagraphs: [],
    flowSteps: FLOW_STEPS.map((step) => ({ ...step })),
    drillTitle: "Right Triangles Only",
    drillQuestions: DRILL_QUESTIONS.map((question) => ({ ...question })),
    graphicAriaLabel:
      "Session flow from together through mistake, fix, retry, and solo to mastered. Drill card shows Right Triangles questions gaining checkmarks."
  };
}
