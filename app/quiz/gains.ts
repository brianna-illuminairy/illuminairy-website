export {
  FUNNEL_TODAY,
  Q5_TEST_DATES,
  weeksUntilQ5Test,
  maxPromisedGainForQ5,
  cappedPromisedGain,
  promisedGainFromQuizAnswers,
  showedGpaGapScreen,
  type Q5Key
} from "@/lib/quiz-funnel/gains";

import { maxPromisedGainForQ5 } from "@/lib/quiz-funnel/gains";

/** @deprecated alias — use maxPromisedGainForQ5 */
export function gainTargetForQ5(q5: string | null | undefined, today?: Date) {
  return maxPromisedGainForQ5(q5, today);
}

/** “Students with similar profiles averaged +low–high pts” band. */
export function proofGainRange(
  promisedGain: number | null | undefined,
  q5: string | null | undefined,
  today?: Date
) {
  const cap = maxPromisedGainForQ5(q5, today);
  const anchor = promisedGain ?? cap;
  const low = Math.max(80, anchor - 30);
  const high = Math.min(cap + 40, anchor + 40);
  return { low, high };
}
