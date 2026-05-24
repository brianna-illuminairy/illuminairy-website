import { satGpaSatResearch } from "@/lib/site";
import { GPA_OPTIONS } from "@/lib/sat-plan-funnel/gpa-options";
import { isHighGpaLowSat } from "@/lib/sat-plan-funnel/score-gap";
import { SCORE_OPTIONS } from "@/lib/sat-plan-funnel/score-options";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";

export type Int2GpaParadoxCopy = {
  eyebrow: string;
  headline: string;
  paragraphs: string[];
  footnote?: string;
  gpaLabel: string;
  scoreLabel: string;
};

type Voice = {
  subject: string;
  possessive: string;
};

function voice(testTaker?: string): Voice {
  switch (testTaker) {
    case "test_taker_daughter":
      return { subject: "she", possessive: "her" };
    case "test_taker_son":
      return { subject: "he", possessive: "his" };
    case "test_taker_self":
      return { subject: "you", possessive: "your" };
    case "test_taker_other":
    default:
      return { subject: "they", possessive: "their" };
  }
}

function gpaLabel(gpaBand?: string): string {
  const row = GPA_OPTIONS.find((opt) => opt.id === gpaBand);
  return row?.label ?? "strong";
}

function scoreLabel(recentScore?: string): string {
  const row = SCORE_OPTIONS.find((opt) => opt.id === recentScore);
  return row?.label ?? "recent";
}

function smartOppositeLine(v: Voice): string {
  if (v.subject === "you") {
    return "It doesn't mean you aren't smart. It usually means the opposite.";
  }
  return `It doesn't mean ${v.subject} isn't smart. It usually means the opposite.`;
}

function schoolVsSatLine(): string {
  return "School rewards depth, persistence, and revision. The SAT rewards speed, pattern recognition, and decision-making under time pressure. Those are different skill sets.";
}

function perfectionismLine(v: Voice): string {
  if (v.subject === "you") {
    return "Perfectionism often helps in school. On the SAT, wanting every answer exactly right is not weakness. It costs time when you only get about 75 seconds per question, and a few extra seconds per problem can mean never reaching the last few.";
  }
  return `Perfectionism often helps in school. On the SAT, wanting every answer exactly right is not weakness. It costs time when ${v.subject} only gets about 75 seconds per question, and a few extra seconds per problem can mean never reaching the last few.`;
}

function solvableLine(v: Voice): string {
  if (v.subject === "you") {
    return "This profile is common, and solvable when prep targets pacing, perfectionism habits, and the specific gaps that show up on score reports.";
  }
  return `This profile is common, and solvable when prep targets pacing, perfectionism habits, and the specific gaps that show up on ${v.possessive} score reports.`;
}

export function buildInt2GpaParadoxCopy(answers: SatPlanAnswers): Int2GpaParadoxCopy {
  const v = voice(answers.test_taker);
  const gpa = gpaLabel(answers.gpa_band);
  const score = scoreLabel(answers.recent_score);
  const fullGap = isHighGpaLowSat(answers.gpa_band, answers.recent_score);

  const eyebrow = "Why smart kids score low on the SAT";

  if (fullGap) {
    const headline = `A ${gpa} GPA with a ${score} SAT. We see this all the time.`;

    return {
      eyebrow,
      headline,
      gpaLabel: gpa,
      scoreLabel: score,
      paragraphs: [
        smartOppositeLine(v),
        schoolVsSatLine(),
        perfectionismLine(v),
        solvableLine(v)
      ],
      footnote: satGpaSatResearch.footnote
    };
  }

  const headline =
    v.subject === "you"
      ? `A ${gpa} GPA with a ${score} SAT score. We see this pattern often.`
      : `A ${gpa} GPA with a ${score} SAT. We see this pattern often.`;

  const paragraphs = [
    smartOppositeLine(v),
    schoolVsSatLine(),
    perfectionismLine(v),
    v.subject === "you"
      ? "The gap is a skills gap, not a character flaw. It is fixable when prep targets what the test actually measures."
      : `The gap is a skills gap, not a character flaw. It is fixable when prep targets what ${v.subject} misses on test day.`
  ];

  return {
    eyebrow,
    headline,
    gpaLabel: gpa,
    scoreLabel: score,
    paragraphs,
    footnote: satGpaSatResearch.footnote
  };
}
