import { satProgramOutcomes } from "@/lib/site";

export const scoreReviewLpCopy = {
  momQuote: {
    lines: [
      "Her score was still in the 1200s.",
      "We needed at least a 1400 for the schools she wanted.",
    ],
    body:
      "There was only one test left before early application deadlines. They got her diagnostic and first tutoring session scheduled that same week. Nine weeks later she scored a 1450. It completely changed the colleges she applied to.",
  },
  offer: {
    eyebrow: "Free June SAT Score Review",
    headline: "Early application deadlines are approaching.",
    bullets: [
      "Review your child's score report with an SAT expert",
      "See why they keep missing points on the SAT",
      "Map the fastest path to improve before their next test",
    ],
    button: "Schedule free score review",
    finePrint: "Free · parent only · about 2 minutes to book",
  },
  trustStats: [
    {
      value: `+${satProgramOutcomes.avgPointsGained}`,
      label: "avg points (completers)",
      em: true,
    },
    {
      value: String(satProgramOutcomes.plansBuiltCount),
      label: "families served",
    },
    {
      value: "4.9",
      label: "parent rating",
      star: true,
    },
  ],
  resultsVary: "Results vary.",
} as const;
