/** Forum-sourced parent phrases — keyed by fear_id for ads/LP. */

import type { FearId } from "@/funnel/lib/campaigns";

export const parentVoiceByFear: Record<
  FearId,
  { fearHook: string; reliever: string }
> = {
  "hours-no-payoff": {
    fearHook:
      "Months on Khan Academy and Bluebook — and the May score still isn't in range for the schools on their list?",
    reliever:
      "More app time isn't the answer — a twelve-week plan with diagnostics and a mentor who assigns the right work is."
  },
  "doors-closing": {
    fearHook: "Worried their May score limits college options?",
    reliever:
      "August can still open doors — with a twelve-week plan, not more solo study."
  },
  "started-late": {
    fearHook: "Feel behind on the SAT? August 22 isn't gone.",
    reliever: "Summer needs a real plan — program starts May 27."
  },
  "gpa-mismatch": {
    fearHook: "Strong GPA, SAT that doesn't match?",
    reliever: "Week-one diagnostics find the gap — teach the test, not their ability."
  },
  nagging: {
    fearHook: "Tired of nagging them to study?",
    reliever:
      "Mentor assigns practice — weekly report to you, without being the SAT police."
  },
  "no-visibility": {
    fearHook: "Flying blind on SAT progress all summer?",
    reliever:
      "Progress report every week — what they did, what improved, what's next."
  },
  "wasted-summer": {
    fearHook: "One summer before senior year chaos — can't waste it.",
    reliever: "Fixed weekly schedule May through August — structure before APs and sports return."
  },
  "summer-repeat": {
    fearHook: "Afraid they'll study all summer and still come up short?",
    reliever: "Diagnostics first, then a targeted plan — not blind hours."
  },
  "target-range": {
    fearHook: "Need a score competitive for Tech, UGA, or Emory?",
    reliever:
      "We'll map an honest target on your consultation — from diagnostics, not ads."
  }
};

export const aspirationHeadlines = {
  doors:
    "Their future is ahead of them — August is where the right SAT score opens doors.",
  georgia:
    "Georgia families aiming at Tech, UGA, and Emory — twelve weeks with GT mentors who scored 1450+.",
  effort:
    "The work ethic is already there. August is about turning effort into a score their list needs."
} as const;
