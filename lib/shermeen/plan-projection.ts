/** Phase 1 score projection — illustrative check-ins, not a score guarantee. */

export const SHERMEEN_PHASE1_START_SCORE = 1125;
export const SHERMEEN_PHASE1_TARGET_LOW = 1250;
export const SHERMEEN_PHASE1_TARGET_HIGH = 1300;

export const SHERMEEN_PLAN_CHART_POINTS = [
  { x: 60, weekLabel: "START", score: 1125, scoreLabel: "1125" },
  { x: 215, weekLabel: "WK 5 · PT", score: 1180, scoreLabel: "1180" },
  { x: 400, weekLabel: "WK 9 · PT", score: 1225, scoreLabel: "1225" },
  { x: 560, weekLabel: "WK 11 · PT", score: 1255, scoreLabel: "1255" },
  { x: 680, weekLabel: "WK 12", score: 1280, scoreLabel: "1280" },
] as const;

export const SHERMEEN_PLAN_PACE_PILLS = [
  { label: "Effortless", pace: "+8/wk", score: 1220, active: false },
  { label: "Realistic", pace: "+10/wk", score: 1245, active: false },
  { label: "This plan", pace: "+12/wk", score: 1270, active: true },
  { label: "Aggressive", pace: "+15/wk", score: 1305, active: false },
] as const;

export const SHERMEEN_PLAN_REALISTIC_COPY =
  "Shermeen is building SAT question types and methods from scratch across many skills, not tightening a narrow set of gaps. Phase 1 is foundation work. With 2 tutoring sessions per week and consistent homework, a realistic landing for this 12-week phase is 1250 to 1300 on a full-length timed practice test. That is the goal for Phase 1, not her final SAT score. Phase 2 and later phases map from what Phase 1 shows.";

export const SHERMEEN_PLAN_CHECKPOINT_COPY =
  "After the Week 5 full-length practice test, if she is at about 1180 or higher, she is on track for the 1250 to 1300 Phase 1 range. If she is short, we find out why and adjust before the gap grows. Weeks 9 and 11 practice tests are the next check-ins before the Week 12 review.";

export const SHERMEEN_PLAN_CHART_CAPTION =
  "Each score above is where she should be at that check-in. We compare her real practice-test score to it to see if she is on track or if the plan needs adjusting.";

export function scoreToChartY(score: number, minScore = 1125, maxScore = 1300): number {
  const bottom = 280;
  const top = 56;
  const span = maxScore - minScore;
  return bottom - ((score - minScore) / span) * (bottom - top);
}
