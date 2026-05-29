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
      text: ". Confidence slips — and some start aiming smaller than they used to. We don't ask them to fix the whole test at once. The diagnostic finds ",
    },
    { text: "one skill", em: true },
    { text: " first — often " },
    { text: "50+ points", em: true },
    {
      text: " on its own. That quick win restores belief and gets them putting in the work again.",
    },
  ];
}

/** s2 opener — picks up from Skill 1 on the projection chart. */
export const S2_MISTAKE_DRIVEN_LEAD =
  "We start with their highest-impact gap. A tutor finds the mistake on a real SAT question, fixes it together, then has them practice until they can get it right alone.";

export const S2_MISTAKE_DRIVEN_RESEARCH =
  "Fixing recurring mistake types beats re-watching the same lessons for everyone — students remember more when they retrieve and correct errors, not passively review.";
