import { DIFFICULTY_READOUT } from "@/lib/shermeen/diagnostic-report-data";

const rwReadout = DIFFICULTY_READOUT[0];
const mathReadout = DIFFICULTY_READOUT[1];

/** Per-skill homework bar before advancing to the next ranked skill. */
export const SHERMEEN_SKILL_BLOCK_TARGETS = {
  easy: 90,
  medium: 85,
} as const;

/** Section-level targets on a full-length practice test by end of Phase 1. */
export const SHERMEEN_PHASE1_SECTION_TARGETS = {
  rw: { easy: 90, medium: 85 },
  math: { easy: 90, medium: 85 },
} as const;

export const SHERMEEN_PHASE1_PRACTICE_VOLUME = {
  weeklyMin: 60,
  weeklyMax: 100,
  totalMin: 700,
  totalMax: 1200,
} as const;

export const SHERMEEN_PLAN_PRACTICE_VOLUME_COPY = `Shermeen completes ${SHERMEEN_PHASE1_PRACTICE_VOLUME.weeklyMin}–${SHERMEEN_PHASE1_PRACTICE_VOLUME.weeklyMax} questions per week between tutoring sessions and homework (about ${SHERMEEN_PHASE1_PRACTICE_VOLUME.totalMin}–${SHERMEEN_PHASE1_PRACTICE_VOLUME.totalMax} total questions across all 12 weeks of Phase 1). That volume is what makes the question-type and method work stick.`;

function phase1AccuracyObjectiveCopy(): string {
  const { easy, medium } = SHERMEEN_SKILL_BLOCK_TARGETS;
  return `On full-length practice tests by the end of Phase 1, she hits ${easy}% accuracy on easy questions and ${medium}% on medium questions in both Reading and Writing and Math (up from ${rwReadout.easy}% / ${rwReadout.medium}% on Reading and Writing and ${mathReadout.easy}% / ${mathReadout.medium}% on Math on the June 23 diagnostic).`;
}

export const SHERMEEN_PHASE1_LEARNING_OBJECTIVES = [
  "She recognizes every question type on her ranked skill list and can name it out loud before she starts solving.",
  "For each type, she names the method she will use (not just the topic) and starts with that method instead of reading every answer choice first.",
  phase1AccuracyObjectiveCopy(),
  "She can review what she got wrong, explain why her answer was wrong, and spot the same kind of error on the next problem without waiting for a tutor to point it out.",
  "She has memorized at least 3–4 formulas that are not fully spelled out on the SAT reference sheet (for example radians to degrees, arc length, and the factor theorem) and can apply them from memory on homework and practice tests.",
] as const;

export const SHERMEEN_PLAN_ACCURACY_FOCUS =
  "Phase 1 focuses on easy and medium questions. Shermeen missed most of her diagnostic points on those tiers, especially easy Reading and Writing and medium Math. Each week we teach one question type at a time until timed homework clears the skill-block bar, then move to the next ranked skill. Hard questions stay mostly for Phase 2 once the methods are automatic on easier tiers.";

export const SHERMEEN_PLAN_ACCURACY_SKILL_NOTE = `Each skill block before we advance: ${SHERMEEN_SKILL_BLOCK_TARGETS.easy}% on easy practice sets, ${SHERMEEN_SKILL_BLOCK_TARGETS.medium}% on medium practice sets (timed homework).`;

export const SHERMEEN_PLAN_ACCURACY_SECTION_NOTE =
  "Today is from her June 23 diagnostic. Phase 1 section targets are what we want on full-length practice tests by Week 11. Reading and Writing easy accuracy (38% today) is the biggest lift. Math medium (50% today) is the main Math gap.";

export const SHERMEEN_PLAN_ACCURACY_ROWS = [
  {
    level: "Easy",
    rwToday: rwReadout.easy,
    rwTarget: SHERMEEN_PHASE1_SECTION_TARGETS.rw.easy,
    mathToday: mathReadout.easy,
    mathTarget: SHERMEEN_PHASE1_SECTION_TARGETS.math.easy,
  },
  {
    level: "Medium",
    rwToday: rwReadout.medium,
    rwTarget: SHERMEEN_PHASE1_SECTION_TARGETS.rw.medium,
    mathToday: mathReadout.medium,
    mathTarget: SHERMEEN_PHASE1_SECTION_TARGETS.math.medium,
  },
] as const;

export function formatAccuracyDelta(today: number, target: number): string {
  const delta = target - today;
  if (delta <= 0) return "On track";
  return `+${delta} pp`;
}
