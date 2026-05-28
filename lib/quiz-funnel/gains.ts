import { funnelToday } from "@/lib/funnel-today";

export const FUNNEL_TODAY = funnelToday();

export type Q5Key = keyof typeof Q5_TEST_DATES;

export const Q5_TEST_DATES = {
  aug22: new Date("2026-08-22"),
  oct3: new Date("2026-10-03"),
  nov7: new Date("2026-11-07"),
  dec5: new Date("2026-12-05")
} as const;

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

export function promisedGainFromQuizAnswers(
  q4: string | null | undefined,
  q5: string | null | undefined,
  q8: string | null | undefined,
  today = FUNNEL_TODAY
) {
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
