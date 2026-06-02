import { funnelToday } from "@/lib/funnel-today";

export const FUNNEL_TODAY = funnelToday();

export type Q5Key = keyof typeof Q5_TEST_DATES;

export const Q5_TEST_DATES = {
  aug22: new Date("2026-08-22"),
  sept12: new Date("2026-09-12"),
  oct3: new Date("2026-10-03"),
  nov7: new Date("2026-11-07"),
  dec5: new Date("2026-12-05")
} as const;

/** q5 values with a concrete calendar test date (not tbd). */
export function hasScheduledTestDate(q5: string | null | undefined): q5 is Q5Key {
  return q5 != null && q5 in Q5_TEST_DATES;
}

const BASELINE_SCORE: Record<string, number> = {
  u1000: 1050,
  "1100-1200": 1150,
  "1200-1300": 1250,
  "1300-1400": 1350,
  "1400plus": 1430
};

const TARGET_SCORE: Record<string, number> = {
  "1250": 1250,
  "1300": 1300,
  "1350": 1350,
  "1400": 1400,
  "1450": 1450
};

export function weeksUntilQ5Test(q5: string | null | undefined, today = FUNNEL_TODAY) {
  const d = Q5_TEST_DATES[q5 as Q5Key];
  if (!d) return null;
  return Math.round((d.getTime() - today.getTime()) / (7 * 86400000));
}

export function maxPromisedGainForQ5(q5: string | null | undefined, today = FUNNEL_TODAY) {
  const weeks = weeksUntilQ5Test(q5, today);
  if (weeks == null) return 200;
  return weeks <= 6 ? 150 : 200;
}

export function cappedPromisedGain(
  rawGap: number | null | undefined,
  q5: string | null | undefined,
  today = FUNNEL_TODAY
) {
  if (rawGap == null || rawGap <= 0) return null;
  return Math.min(rawGap, maxPromisedGainForQ5(q5, today));
}

/** Funnel display gain: 150+ if ≤6 weeks to test, 200+ otherwise. */
export function funnelTimelineGain(
  q5: string | null | undefined,
  today = FUNNEL_TODAY
): number | null {
  if (!hasScheduledTestDate(q5)) return null;
  const weeks = weeksUntilQ5Test(q5, today);
  if (weeks == null || weeks <= 0) return null;
  return maxPromisedGainForQ5(q5, today);
}

/** @deprecated Use funnelTimelineGain for funnel copy — 150+ or 200+ only. */
export function promisedGainPoints(
  _rawGap: number | null | undefined,
  q5: string | null | undefined,
  today = FUNNEL_TODAY
): number | null {
  return funnelTimelineGain(q5, today);
}

/** Full program runway — gain potential scales down as test day gets closer. */
export const PROGRAM_PREP_WEEKS = 12;

/**
 * Realistic gain given weeks until test (scales with runway to test day).
 * Used for urgency copy — does not replace cappedPromisedGain elsewhere.
 */
export function timelineScaledGain(
  rawGap: number | null | undefined,
  q5: string | null | undefined,
  today = FUNNEL_TODAY
): number | null {
  if (rawGap == null || rawGap <= 0) return null;
  const weeks = weeksUntilQ5Test(q5, today);
  const ceiling = cappedPromisedGain(rawGap, q5, today);
  if (ceiling == null) return null;
  if (weeks == null || !hasScheduledTestDate(q5)) return ceiling;
  if (weeks <= 0) return 0;

  const referenceWeeks = 12;
  if (weeks >= referenceWeeks) return ceiling;
  return Math.max(0, Math.round(ceiling * (weeks / referenceWeeks)));
}

/** Don't show point/gain math when the next test is fewer than this many weeks away. */
export const MIN_WEEKS_FOR_GAIN_MATH = 4;

export function shouldShowGainMath(
  q5: string | null | undefined,
  today = FUNNEL_TODAY
): boolean {
  if (!hasScheduledTestDate(q5)) return true;
  const weeks = weeksUntilQ5Test(q5, today);
  if (weeks == null) return true;
  return weeks >= MIN_WEEKS_FOR_GAIN_MATH;
}

export type WaitUrgency = {
  weeksUntil: number | null;
  gainNow: number | null;
  gainIfWaitOneWeek: number | null;
  pointsLostIfWaitOneWeek: number | null;
  pointsPerWeekWaiting: number | null;
};

/** Urgency copy — 150+ if ≤6 weeks to test, 200+ otherwise. */
export function waitUrgencyFromQuiz(
  q5: string | null | undefined,
  today = FUNNEL_TODAY
): WaitUrgency {
  const weeksUntil = weeksUntilQ5Test(q5, today);

  if (weeksUntil == null || weeksUntil <= 0 || !hasScheduledTestDate(q5)) {
    return {
      weeksUntil,
      gainNow: null,
      gainIfWaitOneWeek: null,
      pointsLostIfWaitOneWeek: null,
      pointsPerWeekWaiting: null,
    };
  }

  const gainNow = funnelTimelineGain(q5, today);

  if (gainNow == null || gainNow <= 0) {
    return {
      weeksUntil,
      gainNow: null,
      gainIfWaitOneWeek: null,
      pointsLostIfWaitOneWeek: null,
      pointsPerWeekWaiting: null,
    };
  }

  const pointsPerWeekWaiting = Math.min(
    50,
    Math.max(12, Math.round(gainNow / Math.max(1, weeksUntil)))
  );
  const gainIfWaitOneWeek = Math.max(0, gainNow - pointsPerWeekWaiting);

  return {
    weeksUntil,
    gainNow,
    gainIfWaitOneWeek,
    pointsLostIfWaitOneWeek: pointsPerWeekWaiting,
    pointsPerWeekWaiting,
  };
}

export function promisedGainFromQuizAnswers(
  q4: string | null | undefined,
  q5: string | null | undefined,
  q8: string | null | undefined,
  today = FUNNEL_TODAY
) {
  if (!q4 || q4 === "na" || !q8 || q8 === "tbd") return null;
  const lastScore = q4 ? BASELINE_SCORE[q4] : undefined;
  const target = q8 ? TARGET_SCORE[q8] : undefined;
  if (!lastScore || !target) return null;
  const rawGap = Math.max(0, target - lastScore);
  return cappedPromisedGain(rawGap, q5, today);
}

export function showedGpaGapScreen(
  q4: string | null | undefined,
  q9: string | null | undefined
) {
  const highGpa = ["3.0-3.3", "3.3-3.5", "3.5-3.7", "3.7-3.9", "4.0+"].includes(q9 ?? "");
  const lowScore = ["u1000", "1100-1200", "1200-1300", "1300-1400"].includes(q4 ?? "");
  return highGpa && lowScore;
}
