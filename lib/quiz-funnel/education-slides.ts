/**
 * Conditional education slides — autoprogress insight cards after opt-out answers.
 */

import {
  SCORE_PATH_DEFAULT_START,
  SCORE_PATH_DEFAULT_WEEKS,
} from "@/lib/quiz-funnel/quiz-profile";
import { stakesGoalPhrase } from "@/lib/quiz-funnel/stakes-copy";
import { isQuizSelfTaker, quizSubjectVoice } from "@/lib/quiz-funnel/subject-voice";
import { satFirstMonthOutcomes } from "@/lib/site";
import type { InsightHit, InsightHitPart } from "@/lib/quiz-funnel/insight-hits";

export type EducationSlideHit = InsightHit & {
  /** Optional second paragraph (so-what / next step) */
  followUp?: InsightHitPart[];
};

/** q3 = none — skip q4, illustrative start */
export function educationHitQ3None(qWho?: string): EducationSlideHit {
  const specificLine = isQuizSelfTaker(qWho)
    ? "That's the typical band for a first attempt, not a guess about you. Your SAT Strategy Call and Skill Diagnostic make it specific."
    : "That's the typical band for a first attempt, not a guess about your student. Your SAT Strategy Call and Skill Diagnostic make it specific.";
  return {
    type: "recognition",
    parts: [{ text: "No official SAT yet." }],
    followUpBlocks: [
      [
        { text: "We'll use " },
        { text: `~${SCORE_PATH_DEFAULT_START}`, em: true },
        {
          text: " as a planning starting point until the Skill Diagnostic sets the real baseline.",
        },
      ],
      [{ text: specificLine }],
    ],
  };
}

/** q5 = tbd — default runway */
export function educationHitQ5Tbd(qWho?: string): EducationSlideHit {
  const { possessive } = quizSubjectVoice(qWho);
  return {
    type: "surprise",
    parts: [
      { text: "No test date locked yet. We'll build a " },
      { text: `~${SCORE_PATH_DEFAULT_WEEKS}-week`, em: true },
      { text: " improvement path as a default runway." },
    ],
    followUp: [
      {
        text: `On your SAT Strategy Call, we'll help you pick the best test date for ${possessive} grade and school list.`,
      },
    ],
  };
}

/** q5 = 2027+ — grade timing */
export function educationHitQ5Timing(qWho?: string): EducationSlideHit {
  const { possessive } = quizSubjectVoice(qWho);
  return {
    type: "surprise",
    parts: [
      { text: "Most students take the SAT " },
      { text: "2–3 times", em: true },
      { text: ": spring of junior year, again in summer or fall, and once more senior year if needed." },
    ],
    followUp: [
      {
        text: `Starting earlier gives room to fix recurring skills instead of cramming. Your SAT Strategy Call maps the right first date for ${possessive} timeline.`,
      },
    ],
  };
}

/** q8 = tbd — score competitiveness */
export function educationHitQ8Scores(q2?: string, qWho?: string): EducationSlideHit {
  const goal = stakesGoalPhrase(q2, qWho);
  return {
    type: "surprise",
    parts: [
      { text: "Selective flagships often see submitter SATs in the " },
      { text: "mid-1300s to 1400+", em: true },
      { text: " range." },
    ],
    followUpBlocks: [
      [{ text: "Middle 50% is not a guarantee." }],
      [
        { text: "Merit scholarships often start around " },
        { text: "1400+", em: true },
        { text: `. Once you pick a target, we'll map whether it supports your goal to ${goal}.` },
      ],
    ],
  };
}

/** After q5 — urgency-relief "hope" screen: improvement happens faster than expected. */
export function educationHitOutcomeMonthOne(): EducationSlideHit {
  const o = satFirstMonthOutcomes;
  return {
    type: "outcome",
    parts: [
      { text: "Most score improvements happen faster than parents expect." },
    ],
    followUpBlocks: [
      [
        { text: `${o.hit100PlusPct}% of students who follow their ` },
        { text: "diagnostic-driven plan", em: true },
        { text: " achieve " },
        { text: `${o.minPointsFirstMonth}+ points`, em: true },
        { text: " their first month." },
      ],
      [
        { text: "Our average student invests " },
        { text: o.hoursPerWeekEffortPhrase, em: true },
        { text: " of effort per week." },
      ],
    ],
    showScoreReports: true,
  };
}
