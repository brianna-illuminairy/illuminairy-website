import type { StoredLabQuizAnswers } from "@/lib/quiz-funnel-b/quiz-storage";
import { canonicalizeQuizStepId } from "@/lib/quiz-funnel-b/funnel-steps";

/** Cookie mirror of Plan Builder B progress — readable on server (SSR resume). */
export const QUIZ_SNAPSHOT_COOKIE = "qfb_snapshot";
const COOKIE_VERSION = 1;
const MAX_COOKIE_BYTES = 3800;

/** Intake keys only — no PII (contact, phone verify, booking). */
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
  "qSchoolReferral",
] as const;

export type LabQuizSnapshot = {
  answers: StoredLabQuizAnswers;
  lastStep: string | null;
  updatedAt: number;
};

type CookiePayload = {
  v: number;
  s: string | null;
  t?: number;
  a: StoredLabQuizAnswers;
};

export function trimAnswersForCookie(answers: StoredLabQuizAnswers): StoredLabQuizAnswers {
  const trimmed: StoredLabQuizAnswers = {};
  for (const key of COOKIE_ANSWER_KEYS) {
    const val = answers[key];
    if (val === undefined) continue;
    if (typeof val === "string" && val.length === 0) continue;
    if (Array.isArray(val) && val.length === 0) continue;
    trimmed[key] = val;
  }
  return trimmed;
}

function encodePayload(payload: CookiePayload): string {
  return encodeURIComponent(JSON.stringify(payload));
}

function decodePayload(raw: string): CookiePayload | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as CookiePayload;
    if (parsed?.v !== COOKIE_VERSION || typeof parsed.a !== "object" || parsed.a === null) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function snapshotFromPayload(payload: CookiePayload): LabQuizSnapshot {
  const rawStep =
    typeof payload.s === "string" && payload.s.length > 0 ? payload.s : null;
  return {
    answers: payload.a,
    lastStep: rawStep ? canonicalizeQuizStepId(rawStep) : null,
    updatedAt: typeof payload.t === "number" && payload.t > 0 ? payload.t : 0,
  };
}

export function payloadFromSnapshot(snapshot: LabQuizSnapshot): CookiePayload {
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

export function parseQuizSnapshotCookie(raw: string | undefined | null): LabQuizSnapshot | null {
  if (!raw) return null;
  const payload = decodePayload(raw);
  return payload ? snapshotFromPayload(payload) : null;
}

export function readQuizSnapshotFromRequestCookies(
  cookieStore: { get: (name: string) => { value: string } | undefined }
): LabQuizSnapshot | null {
  return parseQuizSnapshotCookie(cookieStore.get(QUIZ_SNAPSHOT_COOKIE)?.value);
}

function cookieWriteString(encoded: string): string {
  return `${QUIZ_SNAPSHOT_COOKIE}=${encoded}; Path=/; Max-Age=7776000; SameSite=Lax`;
}

let cookieWriteFailLogged = false;

export function writeQuizSnapshotCookie(snapshot: LabQuizSnapshot): boolean {
  if (typeof document === "undefined") return false;
  const encoded = encodePayload(payloadFromSnapshot(snapshot));
  if (encoded.length > MAX_COOKIE_BYTES) {
    if (process.env.NODE_ENV === "development" && !cookieWriteFailLogged) {
      cookieWriteFailLogged = true;
      console.warn(
        `[qfb_snapshot] Cookie write skipped: ${encoded.length} bytes (max ${MAX_COOKIE_BYTES}). ` +
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

export function readQuizSnapshotCookieClient(): LabQuizSnapshot | null {
  if (typeof document === "undefined") return null;
  const prefix = `${QUIZ_SNAPSHOT_COOKIE}=`;
  const row = document.cookie.split("; ").find((c) => c.startsWith(prefix));
  if (!row) return null;
  return parseQuizSnapshotCookie(row.slice(prefix.length));
}

export function hasQuizProgress(snapshot: LabQuizSnapshot | null | undefined): boolean {
  if (!snapshot) return false;
  if (snapshot.lastStep) return true;
  const a = snapshot.answers;
  return Object.keys(a).some((key) => {
    const val = a[key];
    if (val == null) return false;
    if (typeof val === "string") return val.length > 0;
    if (typeof val === "boolean") return val;
    if (Array.isArray(val)) return val.length > 0;
    return false;
  });
}
