export type Int8DiagnosticTopic = {
  label: string;
  highlighted?: boolean;
  pointsLost?: number;
};

export type Int8DiagnosticDrivenCopy = {
  headlineLead: string;
  headlineAccent: string;
  paragraphs: string[];
  topicMap: Int8DiagnosticTopic[];
  planTitle: string;
  planItems: string[];
  scoreProgression: number[];
  graphicAriaLabel: string;
};

const SAT_SKILL_AREA_COUNT = 28;

const TOPIC_MAP: Int8DiagnosticTopic[] = [
  { label: "Functions", highlighted: true, pointsLost: 40 },
  { label: "Boundaries", highlighted: true, pointsLost: 30 },
  { label: "Ratios", highlighted: true, pointsLost: 20 },
  { label: "Right Triangles" },
  { label: "Vocabulary" },
  { label: "Probability" },
  { label: "Transitions" }
];

const PLAN_ITEMS = ["Functions", "Boundaries", "Ratios", "Probability"];

const SCORE_PROGRESSION = [1100, 1240, 1360];

function diagnosticIntroCopy(testTaker?: string): string {
  switch (testTaker) {
    case "test_taker_son":
      return `The digital SAT has ${SAT_SKILL_AREA_COUNT} distinct skill areas. Your son needs to figure out which ones to focus on to get his score up the fastest.`;
    case "test_taker_daughter":
      return `The digital SAT has ${SAT_SKILL_AREA_COUNT} distinct skill areas. Your daughter needs to figure out which ones to focus on to get her score up the fastest.`;
    case "test_taker_self":
      return `The digital SAT has ${SAT_SKILL_AREA_COUNT} distinct skill areas. You need to figure out which ones to focus on to get your score up the fastest.`;
    case "test_taker_other":
    default:
      return `The digital SAT has ${SAT_SKILL_AREA_COUNT} distinct skill areas. They need to figure out which ones to focus on to get their score up the fastest.`;
  }
}

export function buildInt8DiagnosticDrivenCopy(testTaker?: string): Int8DiagnosticDrivenCopy {
  return {
    headlineLead: "Here's what works better.",
    headlineAccent: "We focus on what moves the score fastest.",
    paragraphs: [
      diagnosticIntroCopy(testTaker),
      "We start with a full diagnostic to identify the exact question types costing the most points.",
      "Then we rank weaknesses by score impact and build a targeted study plan around them.",
      "Instead of reviewing everything broadly, students focus first on the skills most likely to raise their score quickly."
    ],
    topicMap: TOPIC_MAP.map((topic) => ({ ...topic })),
    planTitle: "Personalized Score Plan",
    planItems: [...PLAN_ITEMS],
    scoreProgression: [...SCORE_PROGRESSION],
    graphicAriaLabel:
      "Illustrative SAT topic map on the left with Functions, Boundaries, and Ratios highlighted as top point losses. Personalized score plan on the right prioritizing those topics plus Probability. Example score progression from 1100 to 1240 to 1360."
  };
}
