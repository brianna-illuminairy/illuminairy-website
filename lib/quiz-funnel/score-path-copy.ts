/** Canonical effort line for Score Path / quiz funnel — no "prep" or vague "guided/structured". */
export const SCORE_PATH_EFFORT_LINE =
  "~5–7 hrs/week · mistake-driven SAT tutoring on their weakest skills";

export type ScorePathCopyPart = { text: string; em?: boolean };

/** v1 → s2 bridge — emotional so-what after the projection chart (parent voice). */
export function v1EmotionalBridgeParts(targetScore?: number | null): ScorePathCopyPart[] {
  const targetLabel =
    targetScore != null && targetScore > 0 ? `${targetScore}+` : "their target";

  return [
    {
      text: "Many students who score low on their first SAT stop believing they can reach ",
    },
    { text: targetLabel, em: true },
    {
      text: ". The diagnostic finds ",
    },
    { text: "one skill", em: true },
    { text: " first — often " },
    { text: "50+ points", em: true },
    {
      text: " on its own. That quick win restores belief and gets them putting in the work again.",
    },
  ];
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
