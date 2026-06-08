/** localStorage keys for Plan Builder in-progress state (client only). */
export const QUIZ_ANSWERS_STORAGE_KEY = "qf_answers";
export const QUIZ_LAST_STEP_STORAGE_KEY = "qf_last_step";

export type StoredQuizAnswers = Record<string, string | string[] | boolean | undefined>;

export function readStoredQuizAnswers(): StoredQuizAnswers {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(QUIZ_ANSWERS_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as StoredQuizAnswers) : {};
  } catch {
    return {};
  }
}

export function readQuizLastStep(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(QUIZ_LAST_STEP_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveQuizLastStep(step: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(QUIZ_LAST_STEP_STORAGE_KEY, step);
  } catch {
    /* ignore quota / private mode */
  }
}
