/**
 * Quick dopamine hits — stat → why it matters → what we do.
 */

import { prepFailureInsight } from "@/lib/quiz-funnel/prep-failure-copy";
import {
  FOCUS_SKILL_COUNT,
  KHAN_SAT_MATH_SKILL_COUNT,
  KHAN_SAT_SKILL_COUNT_LABEL,
  KHAN_SAT_YOUTUBE_VIDEO_COUNT,
} from "@/lib/sat-skills-copy";

export type InsightHitType = "surprise" | "recognition" | "mirror" | "progress" | "outcome";

export type InsightHitPart = { text: string; em?: boolean };

export type InsightHitImage = {
  src: string;
  alt: string;
};

export type InsightHit = {
  type: InsightHitType;
  parts: InsightHitPart[];
  followUp?: InsightHitPart[];
  /** Optional hero visual (e.g. Khan math haystack) */
  image?: InsightHitImage;
  /** Fixed auto-advance duration when set (ms) */
  autoAdvanceMs?: number;
};

export const INSIGHT_HIT_EYEBROW: Record<InsightHitType, string> = {
  surprise: "Did you know",
  recognition: "Sound familiar?",
  mirror: "What we noticed",
  progress: "Building your plan",
  outcome: "What we see in month one",
};

/** After q4 — recognition when parent flagged GPA/SAT mismatch (q1). */
export function insightHitAfterQ4(q1?: string): InsightHit | null {
  if (q1 !== "gpa-sat") return null;
  return {
    type: "recognition",
    parts: [
      { text: "They passed Algebra in school — but SAT algebra is " },
      { text: "multiple-choice under a clock", em: true },
      { text: "." },
    ],
    followUp: [
      {
        text: "The Skill Diagnostic finds where school math and test-day math diverge — then we teach those skills first.",
      },
    ],
  };
}

/** After q6 — closed-loop stat tied to section emphasis. */
export function insightHitAfterQ6(q6: string[] = []): InsightHit {
  const hasMath = q6.includes("math");
  const hasReading = q6.includes("reading");

  if (hasMath && !hasReading) {
    return {
      type: "surprise",
      parts: [
        { text: "Most students run out of time on math before finishing — and " },
        { text: "word problems", em: true },
        { text: " are where those lost points usually show up." },
      ],
      followUp: [
        {
          text: "We rank the word-problem types they miss most, then build pacing and translation into Skill 1 tutoring.",
        },
      ],
    };
  }
  if (hasReading && !hasMath) {
    return {
      type: "surprise",
      parts: [
        { text: "Most missed reading points come from " },
        { text: "inference under time pressure", em: true },
        { text: " — not vocabulary lists." },
      ],
      followUp: [
        {
          text: "The diagnostic ranks inference and pacing gaps first — then a tutor works their real misses.",
        },
      ],
    };
  }
  if (hasMath && hasReading) {
    return {
      type: "surprise",
      parts: [
        { text: "Khan's SAT prep alone: " },
        { text: `${KHAN_SAT_MATH_SKILL_COUNT} math skills`, em: true },
        { text: " and " },
        { text: `${KHAN_SAT_YOUTUBE_VIDEO_COUNT} videos`, em: true },
        { text: ". Most score movement comes from " },
        { text: `${FOCUS_SKILL_COUNT}–6`, em: true },
        { text: " recurring misses — not a pass through everything." },
      ],
      followUp: [
        {
          text: "The Skill Diagnostic ranks those 5–6 for your student first.",
        },
      ],
    };
  }
  return {
    type: "surprise",
    parts: [
      { text: "The SAT covers " },
      { text: `${KHAN_SAT_SKILL_COUNT_LABEL} skill areas`, em: true },
      { text: ` — but most score movement comes from ${FOCUS_SKILL_COUNT}–6 recurring misses.` },
    ],
    followUp: [
      {
        text: "The Skill Diagnostic names those skills — then the weekly plan focuses there first.",
      },
    ],
  };
}

/** After q7 — q7 × q6 prep failure (see prep-failure-copy.ts). */
export function insightHitAfterQ7(q7: unknown, q6: unknown = []): InsightHit {
  return prepFailureInsight(q7, q6);
}
