/**
 * Conditional education slides — autoprogress insight cards after opt-out answers.
 */

import {
  SCORE_PATH_DEFAULT_START,
  SCORE_PATH_DEFAULT_WEEKS,
} from "@/lib/quiz-funnel/quiz-profile";
import { stakesGoalPhrase } from "@/lib/quiz-funnel/stakes-copy";
import { illuminairyFirstMonthOutcomeParts } from "@/lib/site";
import type { InsightHit, InsightHitPart } from "@/lib/quiz-funnel/insight-hits";

export type EducationSlideHit = InsightHit & {
  /** Optional second paragraph (so-what / next step) */
  followUp?: InsightHitPart[];
};

/** q3 = none — skip q4, illustrative start */
export function educationHitQ3None(): EducationSlideHit {
  return {
    type: "recognition",
    parts: [
      { text: "No official SAT yet — we'll use " },
      { text: `~${SCORE_PATH_DEFAULT_START}`, em: true },
      { text: " as a planning starting point until the Skill Diagnostic sets the real baseline." },
    ],
    followUp: [
      {
        text: "That's the typical band for a first attempt — not a guess about your student. The Strategy Call and diagnostic make it specific.",
      },
    ],
  };
}

/** q5 = tbd — default runway */
export function educationHitQ5Tbd(): EducationSlideHit {
  return {
    type: "surprise",
    parts: [
      { text: "No test date locked yet — we'll build a " },
      { text: `~${SCORE_PATH_DEFAULT_WEEKS}-week`, em: true },
      { text: " Score Path as a default runway." },
    ],
    followUp: [
      {
        text: "On your Strategy Call, we'll help you pick the best test date for their grade and school list.",
      },
    ],
  };
}

/** q5 = 2027+ — grade timing */
export function educationHitQ5Timing(): EducationSlideHit {
  return {
    type: "surprise",
    parts: [
      { text: "Most students take the SAT " },
      { text: "2–3 times", em: true },
      { text: " — spring of junior year, again in summer or fall, and once more senior year if needed." },
    ],
    followUp: [
      {
        text: "Starting earlier gives room to fix recurring skills instead of cramming. Your Strategy Call maps the right first date for their timeline.",
      },
    ],
  };
}

/** q8 = tbd — score competitiveness */
export function educationHitQ8Scores(q2?: string): EducationSlideHit {
  const goal = stakesGoalPhrase(q2);
  return {
    type: "surprise",
    parts: [
      { text: "Selective flagships often see submitter SATs in the " },
      { text: "mid-1300s to 1400+", em: true },
      { text: " range — middle 50% is not a guarantee." },
    ],
    followUp: [
      { text: "Merit scholarships often start around " },
      { text: "1400+", em: true },
      { text: `. Once you pick a target, we'll map whether it supports your goal to ${goal}.` },
    ],
  };
}

/** After i-steps — first-month outcome */
export function educationHitOutcomeMonthOne(): EducationSlideHit {
  return {
    type: "outcome",
    parts: illuminairyFirstMonthOutcomeParts(),
  };
}
