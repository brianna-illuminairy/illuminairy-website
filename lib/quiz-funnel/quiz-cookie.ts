import type { StoredQuizAnswers } from "@/lib/quiz-funnel/quiz-storage";
import { canonicalizeQuizStepId } from "@/lib/quiz-funnel/funnel-steps";

/** Cookie mirror of Plan Builder progress — readable on server (SSR resume). */
export const QUIZ_SNAPSHOT_COOKIE = "qf_snapshot";
const COOKIE_VERSION = 2;
const COOKIE_VERSION_LEGACY = 1;
/** Stay under 4KB browser cookie cap (leave room for name + attributes). */
const MAX_COOKIE_BYTES = 3800;

/** Intake keys only — no PII (contact, kid name, booking). */
const COOKIE_ANSWER_KEYS = [
  "qWho",
  "qScoreLower",
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "qDoubts",
] as const;

export type QuizSnapshot = {
  answers: StoredQuizAnswers;
  lastStep: string | null;
  updatedAt: number;
};

type CookiePayload = {
  v: number;
  s: string | null;
  t?: number;
  a: StoredQuizAnswers;
};

export function trimAnswersForCookie(answers: StoredQuizAnswers): StoredQuizAnswers {
  const trimmed: StoredQuizAnswers = {};
  for (const key of COOKIE_ANSWER_KEYS) {
    const val = answers[key];
    if (val === undefined) continue;
    if (typeof val === "string" && val.length === 0) continue;
    if (Array.isArray(val) && val.length === 0) continue;
    trimmed[key] = val;
  }
  return trimmed;
}

export function hasQuizProgress(snapshot: QuizSnapshot | null | undefined): boolean {
  if (!snapshot) return false;
  if (snapshot.lastStep) return true;
  const a = snapshot.answers;
  return Object.keys(a).some((key) => {
    const val = a[key];
    if (val == null) return false;
    if (typeof val === "string") return val.length > 0;
    if (typeof val === "boolean") return val;
    if (Array.isArray(val)) return val.length > 0;
    return true;
  });
}

function encodePayload(payload: CookiePayload): string {
  return encodeURIComponent(JSON.stringify(payload));
}

function decodePayload(raw: string): CookiePayload | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as CookiePayload;
    const version = parsed?.v;
    if (
      (version !== COOKIE_VERSION && version !== COOKIE_VERSION_LEGACY) ||
      typeof parsed.a !== "object" ||
      parsed.a === null
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function snapshotFromPayload(payload: CookiePayload): QuizSnapshot {
  const rawStep =
    typeof payload.s === "string" && payload.s.length > 0 ? payload.s : null;
  return {
    answers: payload.a,
    lastStep: rawStep ? canonicalizeQuizStepId(rawStep) : null,
    updatedAt: typeof payload.t === "number" && payload.t > 0 ? payload.t : 0,
  };
}

export function payloadFromSnapshot(snapshot: QuizSnapshot): CookiePayload {
  const lastStep = snapshot.lastStep
    ? canonicalizeQuizStepId(snapshot.lastStep)
    : snapshot.lastStep;
  return {
    v: COOKIE_VERSION,
    s: lastStep,
    t: snapshot.updatedAt,
    a: trimAnswersForCookie(snapshot.answers),
  };
}

export function parseQuizSnapshotCookie(raw: string | undefined | null): QuizSnapshot | null {
  if (!raw) return null;
  const payload = decodePayload(raw);
  return payload ? snapshotFromPayload(payload) : null;
}

/** Server Components / Route Handlers — read `cookies().get(...)`. */
export function readQuizSnapshotFromRequestCookies(
  cookieStore: { get: (name: string) => { value: string } | undefined }
): QuizSnapshot | null {
  return parseQuizSnapshotCookie(cookieStore.get(QUIZ_SNAPSHOT_COOKIE)?.value);
}

function cookieWriteString(encoded: string): string {
  return `${QUIZ_SNAPSHOT_COOKIE}=${encoded}; Path=/; Max-Age=7776000; SameSite=Lax`;
}

let cookieWriteFailLogged = false;

/** Client — persist trimmed snapshot to document.cookie. */
export function writeQuizSnapshotCookie(snapshot: QuizSnapshot): boolean {
  if (typeof document === "undefined") return false;
  const encoded = encodePayload(payloadFromSnapshot(snapshot));
  if (encoded.length > MAX_COOKIE_BYTES) {
    if (process.env.NODE_ENV === "development" && !cookieWriteFailLogged) {
      cookieWriteFailLogged = true;
      console.warn(
        `[qf_snapshot] Cookie write skipped: ${encoded.length} bytes (max ${MAX_COOKIE_BYTES}). ` +
          `lastStep=${snapshot.lastStep ?? "none"}`
      );
    }
    return false;
  }
  document.cookie = cookieWriteString(encoded);
  return true;
}

export function clearQuizSnapshotCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${QUIZ_SNAPSHOT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

/** Client — read cookie mirror (matches server on full page load). */
export function readQuizSnapshotCookieClient(): QuizSnapshot | null {
  if (typeof document === "undefined") return null;
  const prefix = `${QUIZ_SNAPSHOT_COOKIE}=`;
  const row = document.cookie.split("; ").find((c) => c.startsWith(prefix));
  if (!row) return null;
  return parseQuizSnapshotCookie(row.slice(prefix.length));
}
