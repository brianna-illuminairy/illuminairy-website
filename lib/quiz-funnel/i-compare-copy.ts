import { guidedVsSelfStudyMultiplier, satProgramOutcomes } from "@/lib/site";
import { quizSubjectVoice } from "@/lib/quiz-funnel/subject-voice";

export const I_COMPARE_CTA = "Finalize my plan";

/** i-compare headline multiplier — guided avg ÷ self-study retake avg (e.g. 4.6×). */
export function iCompareHeadlineMultiplier(): number {
  return guidedVsSelfStudyMultiplier();
}

/** Body copy under the i-compare chart — proof after prep-failure on hit-q7. */
export function iCompareProofBridgeLine(qWho?: string): string {
  const pts = satProgramOutcomes.avgPointsGained;
  const { possessive } = quizSubjectVoice(qWho);
  return (
    `Our students averaged +${pts} using a custom improvement plan ` +
    `built around the skills hurting ${possessive} score the most.`
  );
}
