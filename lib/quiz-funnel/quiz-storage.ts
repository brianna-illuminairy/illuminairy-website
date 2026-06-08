import {
  clearQuizSnapshotCookie,
  readQuizSnapshotCookieClient,
  writeQuizSnapshotCookie,
  type QuizSnapshot,
} from "@/lib/quiz-funnel/quiz-cookie";

/** localStorage keys for Plan Builder in-progress state (client only). */
export const QUIZ_ANSWERS_STORAGE_KEY = "qf_answers";
export const QUIZ_LAST_STEP_STORAGE_KEY = "qf_last_step";
export const QUIZ_UPDATED_AT_STORAGE_KEY = "qf_updated_at";

export type StoredQuizAnswers = Record<string, string | string[] | boolean | undefined>;

function snapshotUpdatedAt(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(QUIZ_UPDATED_AT_STORAGE_KEY);
    if (!raw) return 0;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

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

function writeLocalAnswers(answers: StoredQuizAnswers): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(QUIZ_ANSWERS_STORAGE_KEY, JSON.stringify(answers));
  } catch {
    /* ignore quota / private mode */
  }
}

function writeLocalLastStep(step: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (step) localStorage.setItem(QUIZ_LAST_STEP_STORAGE_KEY, step);
    else localStorage.removeItem(QUIZ_LAST_STEP_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function writeLocalUpdatedAt(updatedAt: number): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(QUIZ_UPDATED_AT_STORAGE_KEY, String(updatedAt));
  } catch {
    /* ignore */
  }
}

function localClientSnapshot(): QuizSnapshot {
  return {
    answers: readStoredQuizAnswers(),
    lastStep: readQuizLastStep(),
    updatedAt: snapshotUpdatedAt(),
  };
}

function pickNewerSnapshot(a: QuizSnapshot, b: QuizSnapshot): QuizSnapshot {
  const aTime = a.updatedAt ?? 0;
  const bTime = b.updatedAt ?? 0;
  if (aTime > bTime) return a;
  if (bTime > aTime) return b;
  return a;
}

/** Client — read progress from cookie + localStorage (never call during SSR render). */
export function readQuizSnapshotClient(): QuizSnapshot | null {
  const fromCookie = readQuizSnapshotCookieClient();
  const fromLocal = localClientSnapshot();

  const localHasData =
    Boolean(fromLocal.lastStep) || Object.keys(fromLocal.answers).length > 0;

  if (!fromCookie) {
    return localHasData ? fromLocal : null;
  }

  if (!localHasData) {
    return fromCookie;
  }

  return pickNewerSnapshot(fromCookie, fromLocal);
}

/** Client — keep localStorage and cookie in sync for the next server request. */
export function persistQuizSnapshot(snapshot: QuizSnapshot): void {
  const updatedAt = snapshot.updatedAt > 0 ? snapshot.updatedAt : Date.now();
  const withTime: QuizSnapshot = { ...snapshot, updatedAt };

  writeLocalAnswers(withTime.answers);
  writeLocalLastStep(withTime.lastStep);
  writeLocalUpdatedAt(updatedAt);
  writeQuizSnapshotCookie(withTime);
}

export function saveQuizLastStep(step: string): void {
  persistQuizSnapshot({
    answers: readStoredQuizAnswers(),
    lastStep: step,
    updatedAt: Date.now(),
  });
}

export function clearQuizProgress(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(QUIZ_ANSWERS_STORAGE_KEY);
    localStorage.removeItem(QUIZ_LAST_STEP_STORAGE_KEY);
    localStorage.removeItem(QUIZ_UPDATED_AT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  clearQuizSnapshotCookie();
}
