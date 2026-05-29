import { stakesRealisticTarget } from "@/lib/quiz-funnel/stakes-copy";

/** Canonical effort line for Score Path / quiz funnel — no "prep" or vague "guided/structured". */
export const SCORE_PATH_EFFORT_LINE =
  "~5–7 hrs/week · mistake-driven SAT tutoring on their weakest skills";

export type ScorePathCopyPart = { text: string; em?: boolean };

/** v1 → s2 bridge — emotional so-what after the projection chart (parent voice). */
export function v1EmotionalBridgeParts(
  q2?: string,
  targetScore?: number | null
): ScorePathCopyPart[] {
  const { noun, verb } = stakesRealisticTarget(q2);
  const hasTarget = targetScore != null && targetScore > 0;

  const parts: ScorePathCopyPart[] = [
    { text: "After a low SAT score, students start wondering if their " },
    { text: noun, em: true },
    { text: ` ${verb} still realistic. We focus on the ` },
    { text: "highest-impact skill", em: true },
    { text: " first—often worth " },
    { text: "50+ points", em: true },
    { text: "—so they see a quick win and believe " },
  ];

  if (hasTarget) {
    parts.push({ text: `${targetScore}+`, em: true });
    parts.push({ text: " is possible again." });
  } else {
    parts.push({ text: "their " });
    parts.push({ text: "goal score", em: true });
    parts.push({ text: " is possible again." });
  }

  return parts;
}

/** s2 — how we teach each skill (example session). */
export const S2_EXAMPLES_HEADLINE = "We teach each skill through examples.";

export const S2_EXAMPLES_LEAD =
  "We show how to solve it, practice together, then they solve it.";

/** Results · before call — personalize plan (replaces late-funnel +182 stat screen). */
export const S3_PERSONALIZE_HEADLINE = "Next we'll personalize their plan.";

export const S3_PERSONALIZE_LEAD =
  "On a free 15-minute Strategy Call, an SAT advisor reviews their Score Path with you — timeline, target, and schools — and schedules the Skill Diagnostic if you want to move forward.";

export const S3_PERSONALIZE_CTA = "Personalize my plan";

/** s4 · call credibility (no program bullets). */
export const S4_CALL_HEADLINE = "Who you'll talk to on your free Strategy Call";

export const S4_CALL_LINE =
  "Every SAT advisor scored 1450+ on the Digital SAT.";

export const S4_CALL_CTA = "Book your free 15-min Strategy Call";

/** hit-outcome-month-one · score report caption */
export const OUTCOME_SCORE_CAPTION = "Ethan scored +230 pts in 12 weeks";
