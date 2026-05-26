import { satProgramOutcomes } from "@/lib/site";
import {
  conservativeScoreGap,
  scoreGapChartPoints,
  targetBandLabel
} from "@/lib/sat-plan-funnel/score-gap";
import { resolveTimelineFromTestDate } from "@/lib/sat-plan-funnel/sat-test-dates";
import { studentVoice } from "@/lib/sat-plan-funnel/student-voice";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";

export type Ch3SocialCopy = {
  headline: string;
  paragraphs: string[];
  credential: string;
};

export type Ch3MethodCopy = {
  headline: string;
  bullets: { title: string; body: string }[];
};

export type Ch3PreviewCopy = {
  headline: string;
  phases: { title: string; body: string }[];
};

export type Ch3PathCopy = {
  headline: string;
  runwayLine: string;
  tutoringLine: string;
  chart: {
    current: number;
    target: number;
    gapPts: number;
    currentLabel: string;
    targetLabel: string;
  };
};

export function buildCh3SocialCopy(answers: SatPlanAnswers): Ch3SocialCopy {
  const voice = studentVoice(answers);
  const headline = voice.isSelf
    ? "Students in your situation are who we built this for."
    : `Students like ${voice.name} are who we work with.`;

  const paragraphs = [
    voice.isSelf
      ? "Parents and students come to us when strong grades and a stuck SAT score don't add up — and they want a plan that targets misses, not another generic workbook."
      : "Parents come to us when strong grades and a stuck SAT score don't add up — and they want a plan that targets misses, not another generic workbook.",
    `We've built ${satProgramOutcomes.plansBuiltCount}+ personalized SAT plans for families aiming at competitive schools.`
  ];

  return {
    headline,
    paragraphs,
    credential:
      "Our tutors are Georgia Tech and Duke graduates who scored 1450+ on the current Digital SAT."
  };
}

export function buildCh3MethodCopy(answers: SatPlanAnswers): Ch3MethodCopy {
  const voice = studentVoice(answers);
  const name = voice.isSelf ? "you" : voice.name;

  return {
    headline: voice.isSelf ? "How we work with you:" : `How we work with students like ${voice.name}:`,
    bullets: [
      {
        title: "Find the biggest problem first.",
        body: `The diagnostic shows which question types cost ${name} the most points. We start there — not everywhere.`
      },
      {
        title: "One thing at a time until it's mastered.",
        body: `We don't spread practice across twenty question types and hope something sticks. We close one weakness, then move to the next.`
      },
      {
        title: "Work through problems together — live.",
        body: `Sessions aren't lectures. ${voice.isSelf ? "You" : voice.name} solves in real time, thinks out loud, and gets feedback on reasoning as it happens.`
      },
      {
        title: "Track everything.",
        body: voice.isSelf
          ? "You get a weekly progress note: estimated score trend, what we covered, and what's next."
          : "Every Sunday you get a progress note: estimated score trend, what we covered, and what's next."
      }
    ]
  };
}

export function buildCh3PreviewCopy(answers: SatPlanAnswers): Ch3PreviewCopy {
  const voice = studentVoice(answers);
  const possessive = studentVoice(answers).possessive;
  const label = answers.student_first_name?.trim()
    ? `${answers.student_first_name.trim()}'s plan`
    : voice.isSelf
      ? "Your plan"
      : `${possessive} plan`;

  const testLabel =
    resolveTimelineFromTestDate(answers.test_date).dateLabel ?? "test day";

  return {
    headline: label,
    phases: [
      {
        title: "Week 1: Diagnostic + review",
        body: `Full-length timed diagnostic under test-day conditions, then a line-by-line review and a ranked list of ${voice.isSelf ? "your" : voice.possessive} highest-impact question types.`
      },
      {
        title: "Weeks 2–5: Highest-impact weaknesses",
        body: `Twice-weekly sessions on the misses that cost the most points, daily practice on the same areas, and a timed practice test around week 5.`
      },
      {
        title: "Weeks 6–9: Building the score",
        body: "Continue down the weakness list, add timed sections, and run another full practice test with mistake analysis."
      },
      {
        title: "Weeks 10–12+: Test readiness",
        body: `Timed work under real conditions and a final pass on remaining gaps before ${testLabel}.`
      }
    ]
  };
}

export function buildCh3PathCopy(answers: SatPlanAnswers): Ch3PathCopy {
  const voice = studentVoice(answers);
  const meta = resolveTimelineFromTestDate(answers.test_date);
  const gapPts = conservativeScoreGap(answers.target_score, answers.recent_score);
  const chart = scoreGapChartPoints(answers.target_score, answers.recent_score);
  const band = targetBandLabel(answers.target_score);

  const headline = voice.isSelf
    ? `Your path to ${band}.`
    : `${voice.name}'s path to ${band}.`;

  let runwayLine: string;
  if (meta.weeks && answers.test_date !== "test_date_not_planning") {
    runwayLine = `The ${meta.dateLabel} SAT is ${meta.weeks} weeks away — about ${meta.hoursPerWeek} focused hours per week on ${voice.possessive} gaps.`;
  } else {
    runwayLine = `A guided plan runs about ${meta.hoursPerWeek ?? 7} focused hours per week on ${voice.possessive} gaps — not random review.`;
  }

  const tutoringLine = voice.isSelf
    ? "Weekly 1-on-1 tutoring through your test date — built around your diagnostic, not a one-size class."
    : `Weekly 1-on-1 tutoring through ${voice.possessive} test date — built around ${voice.possessive} diagnostic, not a one-size class.`;

  return {
    headline,
    runwayLine,
    tutoringLine,
    chart: {
      current: chart.current,
      target: chart.target,
      gapPts: chart.gapPts,
      currentLabel: "Now",
      targetLabel: "Goal"
    }
  };
}
