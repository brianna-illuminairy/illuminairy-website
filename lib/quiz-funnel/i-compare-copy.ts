import { guidedVsSelfStudyMultiplier, satProgramOutcomes } from "@/lib/site";

/** i-compare headline multiplier — guided avg ÷ self-study retake avg (e.g. 4.6×). */
export function iCompareHeadlineMultiplier(): number {
  return guidedVsSelfStudyMultiplier();
}

/** Body copy under the i-compare chart — proof after prep-failure on hit-q7. */
export function iCompareProofBridgeLine(): string {
  const pts = satProgramOutcomes.avgPointsGained;
  return (
    `Our students averaged +${pts} using a custom improvement plan ` +
    `built around the skills hurting their score the most:`
  );
}
