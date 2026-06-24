/**
 * Canonical public URLs for the June SAT Score Review funnel.
 * Customer-facing links use `/score-review` — internal folder is `app/quiz-c/`.
 */

import {
  QUIZ_ENTRY_STEP,
  canonicalizeQuizStepId,
  resolveQuizResumeStep,
} from "@/lib/score-review-funnel/funnel-steps";
import { getScoreReviewRouteSteps } from "@/lib/score-review-funnel/quiz-route";
import { readQuizSnapshotClient } from "@/lib/score-review-funnel/quiz-storage";

export { QUIZ_ENTRY_STEP };
export const SCORE_REVIEW_PATH = "/score-review";
export const SCORE_REVIEW_LP_PATH = "/june-score-review";

export type ScoreReviewQuery = Record<string, string | undefined>;

export function scoreReviewHref(
  step: string,
  extra: ScoreReviewQuery = {}
): string {
  const params = new URLSearchParams();
  params.set("step", canonicalizeQuizStepId(step));
  for (const [key, value] of Object.entries(extra)) {
    if (value != null && value !== "") {
      params.set(key, value);
    }
  }
  return `${SCORE_REVIEW_PATH}?${params.toString()}`;
}

export function isScoreReviewPathname(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname === SCORE_REVIEW_PATH || pathname.startsWith(`${SCORE_REVIEW_PATH}/`);
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const;

export function scoreReviewEntryFromLanding(search?: string): string {
  const params = new URLSearchParams();
  let step = QUIZ_ENTRY_STEP;
  if (typeof window !== "undefined") {
    const snap = readQuizSnapshotClient();
    const answers = snap?.answers ?? {};
    const routeSteps = getScoreReviewRouteSteps(answers);
    step = resolveQuizResumeStep(answers, routeSteps, snap?.lastStep ?? null);
  }
  params.set("step", step);
  if (search) {
    const incoming = new URLSearchParams(
      search.startsWith("?") ? search.slice(1) : search
    );
    for (const key of UTM_KEYS) {
      const value = incoming.get(key);
      if (value) params.set(key, value);
    }
  }
  return `${SCORE_REVIEW_PATH}?${params.toString()}`;
}

/** Server-safe LP CTA href — entry step + UTMs. Funnel resumes after hydrate. */
export function scoreReviewLandingCtaHref(search?: string): string {
  const params = new URLSearchParams();
  params.set("step", QUIZ_ENTRY_STEP);
  if (search) {
    const incoming = new URLSearchParams(
      search.startsWith("?") ? search.slice(1) : search
    );
    for (const key of UTM_KEYS) {
      const value = incoming.get(key);
      if (value) params.set(key, value);
    }
  }
  return `${SCORE_REVIEW_PATH}?${params.toString()}`;
}

export function scoreReviewStepHref(
  step: string,
  currentSearch?: string
): string {
  const params = new URLSearchParams(
    currentSearch?.startsWith("?") ? currentSearch.slice(1) : currentSearch ?? ""
  );
  params.set("step", canonicalizeQuizStepId(step));
  return `${SCORE_REVIEW_PATH}?${params.toString()}`;
}
