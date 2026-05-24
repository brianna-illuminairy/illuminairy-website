import {
  resolveTimelineFromTestDate,
  type TimelineMeta
} from "@/lib/sat-plan-funnel/sat-test-dates";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";

export type Int6TimelineCopy = {
  headline: string;
  paragraphs: string[];
  footnote: string | null;
};

function voice(testTaker?: string) {
  switch (testTaker) {
    case "test_taker_daughter":
      return { possessive: "her" };
    case "test_taker_son":
      return { possessive: "his" };
    case "test_taker_self":
      return { possessive: "your" };
    case "test_taker_other":
      return { possessive: "their" };
    default:
      return { possessive: "their" };
  }
}

function examHeadline(meta: TimelineMeta): string {
  return `${meta.weeks} weeks — ${meta.days} days — until ${meta.dateLabel}.`;
}

export function buildInt6TimelineCopy(answers: SatPlanAnswers): Int6TimelineCopy {
  const { possessive } = voice(answers.test_taker);
  const meta = resolveTimelineFromTestDate(answers.test_date);

  if (meta.mode === "not_planning") {
    return {
      headline: "If you decide to test later, the clock still matters.",
      paragraphs: [
        `Even without a date on the calendar, a guided plan still runs about ${meta.hoursPerWeek} hrs/week on ${possessive} gaps — not random review.`,
        "When you're ready to pick a test date, we'll map weeks to focused hours."
      ],
      footnote: null
    };
  }

  if (meta.mode === "not_sure") {
    return {
      headline: "Once you pick a test date, we'll map weeks to hours.",
      paragraphs: [
        `For a typical 12-week runway, a guided plan runs about ${meta.hoursPerWeek} hrs/week on ${possessive} gaps — not random review.`,
        "Lock in a date when you're ready — the timeline drives how many focused hours fit before test day."
      ],
      footnote: "Based on ~80 hours of guided prep cited by College Board research."
    };
  }

  return {
    headline: examHeadline(meta),
    paragraphs: [
      `For a runway like that, a guided plan typically runs ${meta.hoursPerWeek} hrs/week on ${possessive} gaps — not random review.`
    ],
    footnote: "Based on ~80 hours of guided prep cited by College Board research."
  };
}
