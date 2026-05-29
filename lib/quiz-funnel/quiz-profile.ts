import {
  cappedPromisedGain,
  hasScheduledTestDate,
  type Q5Key
} from "@/lib/quiz-funnel/gains";

/** q4 opt-out — no official SAT score yet */
export const Q4_NO_SCORE = "na";

/** When q4 = na — illustrative start (~average / slightly above). Labeled inferred, not official. */
export const SCORE_PATH_DEFAULT_START = 1100;
export const SCORE_PATH_DEFAULT_START_BAND = "1100–1200";

/** When q5 has no calendar date — typical prep runway + rounded illustrative gain. */
export const SCORE_PATH_DEFAULT_WEEKS = 16;
export const SCORE_PATH_DEFAULT_GAIN = 250;

export const Q4_BAND_TO_SCORE: Record<string, number> = {
  u1000: 1050,
  "1100-1200": 1150,
  "1200-1300": 1250,
  "1300-1400": 1350,
  "1400plus": 1430
};

export const Q8_TARGET_SCORE: Record<string, number> = {
  "1250": 1250,
  "1300": 1300,
  "1350": 1350,
  "1400": 1400,
  "1450": 1450
};

export const Q5_DATE_NUMERIC: Partial<Record<Q5Key | "2027" | "tbd", string>> = {
  aug22: "8/22",
  oct3: "10/3",
  nov7: "11/7",
  dec5: "12/5",
  "2027": "Spring 2027",
  tbd: "TBD"
};

export function hasTakenOfficialSat(q3?: string | null) {
  return ["sat-1", "sat-2", "sat-3+"].includes(q3 ?? "");
}

export function isFirstTimeOrPsatOnly(q3?: string | null) {
  return q3 === "none" || q3 === "psat-only";
}

export function hasKnownStartingScore(q4?: string | null) {
  return !!q4 && q4 !== Q4_NO_SCORE && q4 in Q4_BAND_TO_SCORE;
}

export function hasTargetScore(q8?: string | null) {
  return !!q8 && q8 !== "tbd";
}

export { hasScheduledTestDate };

export function quizRawScoreGap(
  q4?: string | null,
  q8?: string | null
): number | null {
  if (!hasKnownStartingScore(q4) || !hasTargetScore(q8)) return null;
  const lastScore = Q4_BAND_TO_SCORE[q4!];
  const target = Q8_TARGET_SCORE[q8!];
  return Math.max(0, target - lastScore);
}

export function quizPromisedGain(
  q4?: string | null,
  q5?: string | null,
  q8?: string | null,
  today?: Date
): number | null {
  const rawGap = quizRawScoreGap(q4, q8);
  if (rawGap == null) return null;
  return cappedPromisedGain(rawGap, q5, today);
}

export function q5DisplayLabel(q5?: string | null): string | null {
  if (!q5) return null;
  if (q5 === "tbd") return "Not sure yet";
  if (q5 === "2027") return "Spring 2027 or later";
  const numeric = Q5_DATE_NUMERIC[q5 as Q5Key];
  return numeric ? `${numeric} SAT` : null;
}
