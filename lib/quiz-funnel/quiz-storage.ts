import {
  clearQuizSnapshotCookie,
  readQuizSnapshotCookieClient,
  writeQuizSnapshotCookie,
  type QuizSnapshot,
} from "@/lib/quiz-funnel/quiz-cookie";
import { canonicalizeQuizStepId } from "@/lib/quiz-funnel/funnel-steps";

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
    const step = localStorage.getItem(QUIZ_LAST_STEP_STORAGE_KEY);
    return step ? canonicalizeQuizStepId(step) : null;
  } catch {
    return null;
  }
}

function writeLocalAnswers(answers: StoredQuizAnswers): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(QUIZ_ANSWERS_STORAGE_KEY, JSON.stringify(answers));
    return true;
  } catch {
    /* ignore quota / private mode */
    return false;
  }
}

function writeLocalLastStep(step: string | null): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (step) {
      localStorage.setItem(QUIZ_LAST_STEP_STORAGE_KEY, canonicalizeQuizStepId(step));
    } else {
      localStorage.removeItem(QUIZ_LAST_STEP_STORAGE_KEY);
    }
    return true;
  } catch {
    /* ignore */
    return false;
  }
}

function writeLocalUpdatedAt(updatedAt: number): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(QUIZ_UPDATED_AT_STORAGE_KEY, String(updatedAt));
    return true;
  } catch {
    /* ignore */
    return false;
  }
}

function localClientSnapshot(): QuizSnapshot {
  return {
    answers: readStoredQuizAnswers(),
    lastStep: readQuizLastStep(),
    updatedAt: snapshotUpdatedAt(),
  };
}

function localSnapshotHasData(snapshot: QuizSnapshot): boolean {
  return Boolean(snapshot.lastStep) || Object.keys(snapshot.answers).length > 0;
}

/**
 * Union intake (cookie / SSR) with localStorage. Local wins on overlapping keys
 * so PII and fields only stored locally are preserved after refresh.
 */
export function mergeQuizSnapshots(
  intake: QuizSnapshot | null | undefined,
  local: QuizSnapshot | null | undefined
): QuizSnapshot | null {
  if (!intake && !local) return null;
  if (!intake) return local ?? null;
  if (!local || !localSnapshotHasData(local)) return intake;

  const mergedAnswers: StoredQuizAnswers = { ...intake.answers };
  for (const [key, val] of Object.entries(local.answers)) {
    if (val === undefined || val === null) continue;
    if (typeof val === "string" && val.length === 0) continue;
    if (Array.isArray(val) && val.length === 0) continue;
    mergedAnswers[key] = val;
  }

  const intakeTime = intake.updatedAt ?? 0;
  const localTime = local.updatedAt ?? 0;
  const mergedLastStep =
    localTime >= intakeTime
      ? local.lastStep ?? intake.lastStep
      : intake.lastStep ?? local.lastStep;
  const lastStep = mergedLastStep
    ? canonicalizeQuizStepId(mergedLastStep)
    : mergedLastStep;

  return {
    answers: mergedAnswers,
    lastStep,
    updatedAt: Math.max(intakeTime, localTime),
  };
}

/** Merge SSR cookie snapshot with client localStorage on mount. */
export function resolveHydratedQuizSnapshot(
  serverSnapshot: QuizSnapshot | null | undefined
): QuizSnapshot | null {
  const local = localClientSnapshot();
  const clientCookie = readQuizSnapshotCookieClient();
  const intake =
    serverSnapshot && (serverSnapshot.lastStep || Object.keys(serverSnapshot.answers).length > 0)
      ? serverSnapshot
      : clientCookie;
  return mergeQuizSnapshots(intake, localSnapshotHasData(local) ? local : null);
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

/** Client — localStorage primary, cookie mirror only if localStorage is blocked. */
export function persistQuizSnapshot(snapshot: QuizSnapshot): void {
  const updatedAt = snapshot.updatedAt > 0 ? snapshot.updatedAt : Date.now();
  const withTime: QuizSnapshot = { ...snapshot, updatedAt };

  const localAnswersOk = writeLocalAnswers(withTime.answers);
  const localLastStepOk = writeLocalLastStep(withTime.lastStep);
  const localUpdatedOk = writeLocalUpdatedAt(updatedAt);
  if (!(localAnswersOk && localLastStepOk && localUpdatedOk)) {
    writeQuizSnapshotCookie(withTime);
  }
}

export function saveQuizLastStep(step: string): void {
  persistQuizSnapshot({
    answers: readStoredQuizAnswers(),
    lastStep: canonicalizeQuizStepId(step),
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
