import { FOCUS_SKILL_COUNT } from "@/lib/sat-skills-copy";
import { satProgramOutcomes } from "@/lib/site";

/** Body copy under the i-compare chart — proof only; keep plain. */
export function iCompareProofBridgeLine(): string {
  const pts = satProgramOutcomes.avgPointsGained;
  return (
    `Our students averaged +${pts} on their next SAT. ` +
    `We start with a diagnostic that finds the ${FOCUS_SKILL_COUNT}–6 skills hurting their score most — then tutors work those first.`
  );
}
