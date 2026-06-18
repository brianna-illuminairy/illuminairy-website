/**
 * First-pass pacing caps for Skye pre-diagnostic lesson.
 * Derived from module timing: RW 32 min / 27 Q, Math 35 min / 22 Q.
 * Caps sit at or just under the per-question average so review time stays available.
 */

export const FIRST_PASS_PACE = {
  rw: {
    moduleMinutes: 32,
    questionsPerModule: 27,
    capSeconds: 75,
    capLabel: "about 1 minute",
    capDetail: "75 seconds on your first pass"
  },
  math: {
    moduleMinutes: 35,
    questionsPerModule: 22,
    capSeconds: 90,
    capLabel: "about 1½ minutes",
    capDetail: "90 seconds on your first pass"
  }
} as const;

export function rwAverageSecondsPerQuestion() {
  return Math.round((FIRST_PASS_PACE.rw.moduleMinutes * 60) / FIRST_PASS_PACE.rw.questionsPerModule);
}

export function mathAverageSecondsPerQuestion() {
  return Math.round((FIRST_PASS_PACE.math.moduleMinutes * 60) / FIRST_PASS_PACE.math.questionsPerModule);
}
