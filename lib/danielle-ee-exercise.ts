export type {
  CombineSimplifyProblem,
  EePattern,
  EeTier,
  FoilBuilderProblem,
  FoilRole,
  MissingValueProblem,
  PatternSortItem
} from "@/lib/danielle-ee-exercise-data";

export {
  COMBINE_SIMPLIFY_PROBLEMS,
  FOIL_BUILDER_PROBLEMS,
  MISSING_VALUE_PROBLEMS,
  PATTERN_SORT_ITEMS
} from "@/lib/danielle-ee-exercise-data";

import type { EePattern, EeTier, FoilBuilderProblem, FoilRole } from "@/lib/danielle-ee-exercise-data";

export const EE_PATTERN_META: Record<
  EePattern,
  { label: string; hint: string }
> = {
  dos: {
    label: "Difference of squares",
    hint: "Two perfect squares with a minus between them"
  },
  "ps-pos": {
    label: "Perfect square · positive",
    hint: "Middle term is +2ab"
  },
  "ps-neg": {
    label: "Perfect square · negative",
    hint: "Middle term is −2ab"
  },
  trinomial: {
    label: "Basic trinomial",
    hint: "Factor as (x + m)(x + n), not a special identity"
  }
};

export const EE_TIER_LABELS: Record<EeTier, string> = {
  1: "Warm-up",
  2: "Medium",
  3: "Hard",
  4: "Stretch"
};

export type EeSectionId = "pattern" | "foil" | "combine" | "missing";

export type EeLevelStatus = "fail" | "pass" | "master";

export type EeSectionTarget = {
  levelName: string;
  passCorrect: number;
  masterCorrect: number;
  total: number;
  passLabel: string;
  masterLabel: string;
};

export const EE_LEVEL_TITLE = "Equivalent expressions · Level 1";

export const EE_LEVEL_CLEAR_COPY =
  "Level 1 cleared. You can move to Equivalent Expressions 3 and the quiz in the Homework Portal.";

export const EE_SECTION_ORDER: EeSectionId[] = ["pattern", "foil", "combine", "missing"];

export const EE_SECTION_TARGETS: Record<EeSectionId, EeSectionTarget> = {
  pattern: {
    levelName: "Pattern spotter",
    passCorrect: 17,
    masterCorrect: 19,
    total: 20,
    passLabel: "Pass: 17 of 20 (3 misses max)",
    masterLabel: "Master: 19 of 20 (1 miss max)"
  },
  foil: {
    levelName: "FOIL builder",
    passCorrect: 72,
    masterCorrect: 76,
    total: 80,
    passLabel: "Pass: 72 of 80 steps (90%)",
    masterLabel: "Master: 76 of 80 steps (95%)"
  },
  combine: {
    levelName: "Combine & simplify",
    passCorrect: 17,
    masterCorrect: 19,
    total: 20,
    passLabel: "Pass: 17 of 20 (3 misses max)",
    masterLabel: "Master: 19 of 20 (1 miss max)"
  },
  missing: {
    levelName: "Missing values",
    passCorrect: 17,
    masterCorrect: 19,
    total: 20,
    passLabel: "Pass: 17 of 20 (3 misses max)",
    masterLabel: "Master: 19 of 20 (1 miss max)"
  }
};

const STATUS_RANK: Record<EeLevelStatus, number> = {
  fail: 0,
  pass: 1,
  master: 2
};

export function getSectionLevelStatus(correct: number, section: EeSectionId): EeLevelStatus {
  const target = EE_SECTION_TARGETS[section];
  if (correct >= target.masterCorrect) return "master";
  if (correct >= target.passCorrect) return "pass";
  return "fail";
}

export function sectionLevelLabel(status: EeLevelStatus) {
  if (status === "master") return "Mastered";
  if (status === "pass") return "Passed";
  return "Not passed";
}

function sectionPassed(best: Partial<Record<EeSectionId, { correct: number }>>, section: EeSectionId) {
  const score = best[section];
  return score ? getSectionLevelStatus(score.correct, section) !== "fail" : false;
}

export function isSectionUnlocked(
  section: EeSectionId,
  best: Partial<Record<EeSectionId, { correct: number }>>
) {
  if (section === "pattern") return true;
  if (section === "foil") return sectionPassed(best, "pattern");
  if (section === "combine") return sectionPassed(best, "foil");
  return sectionPassed(best, "combine");
}

export function unlockRequirement(section: EeSectionId) {
  if (section === "foil") return "Pass Pattern spotter (17 of 20) to unlock.";
  if (section === "combine") return "Pass FOIL builder (72 of 80 steps) to unlock.";
  if (section === "missing") return "Pass Combine & simplify (17 of 20) to unlock.";
  return "";
}

export function countLevelsPassed(best: Partial<Record<EeSectionId, { correct: number }>>) {
  let count = 0;
  for (const section of EE_SECTION_ORDER) {
    if (sectionPassed(best, section)) count++;
  }
  return count;
}

export function allLevelsPassed(best: Partial<Record<EeSectionId, { correct: number }>>) {
  return countLevelsPassed(best) === EE_SECTION_ORDER.length;
}

export function allLevelsMastered(best: Partial<Record<EeSectionId, { correct: number }>>) {
  return EE_SECTION_ORDER.every((section) => {
    const score = best[section];
    return score && getSectionLevelStatus(score.correct, section) === "master";
  });
}

export type EeSectionBestScore = {
  correct: number;
  total: number;
  status: EeLevelStatus;
};

export function mergeSectionBest(
  section: EeSectionId,
  prev: EeSectionBestScore | undefined,
  correct: number,
  total: number
): EeSectionBestScore {
  const status = getSectionLevelStatus(correct, section);
  const next: EeSectionBestScore = { correct, total, status };
  if (!prev) return next;
  if (STATUS_RANK[next.status] > STATUS_RANK[prev.status]) return next;
  if (STATUS_RANK[next.status] === STATUS_RANK[prev.status] && next.correct > prev.correct) {
    return next;
  }
  return prev;
}

export const EE_EXERCISE_STORAGE_KEY = "danielle-ee-exercise-progress-v2";

export type EeExerciseProgress = Partial<Record<EeSectionId, EeSectionBestScore>>;

export function readEeExerciseProgress(): EeExerciseProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(EE_EXERCISE_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as EeExerciseProgress;
  } catch {
    return {};
  }
}

export function writeEeExerciseProgress(progress: EeExerciseProgress) {
  window.localStorage.setItem(EE_EXERCISE_STORAGE_KEY, JSON.stringify(progress));
}

/** @deprecated Use getSectionLevelStatus + EE_SECTION_TARGETS */
export const EE_EXERCISE_GOAL_ACCURACY = 0.9;

export const FOIL_ROLE_PROMPTS: Record<FoilRole, string> = {
  F: "Which piece is F (First)?",
  O: "Which piece is O (Outer)?",
  I: "Which piece is I (Inner)?",
  L: "Which piece is L (Last)?"
};

export const FOIL_ROLE_ORDER: FoilRole[] = ["F", "O", "I", "L"];

export function orderExerciseDeck<T extends { tier: EeTier }>(items: T[]): T[] {
  return items.slice().sort((a, b) => a.tier - b.tier);
}

export function shuffleItems<T>(items: T[]): T[] {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function sectionAccuracy(correct: number, total: number) {
  if (total === 0) return 0;
  return correct / total;
}

export function meetsExerciseGoal(correct: number, section: EeSectionId) {
  return getSectionLevelStatus(correct, section) !== "fail";
}

export function foilChoiceOptions(problem: FoilBuilderProblem, role: FoilRole) {
  const correct = problem.steps[role].term;
  const pool = new Set<string>([correct, ...Object.values(problem.steps).map((s) => s.term)]);
  for (const d of problem.distractors) pool.add(d);
  const options = shuffleItems(Array.from(pool)).slice(0, 4);
  if (!options.includes(correct)) {
    options[0] = correct;
    return shuffleItems(options);
  }
  return options;
}
