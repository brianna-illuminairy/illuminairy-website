/**
 * Canonical public URLs for the parent Plan Builder funnel.
 * Customer-facing links use `/plan` — never `/quiz` (banned product language).
 * Internal folder remains `app/quiz/`; Next.js rewrites `/plan` → `/quiz`.
 */

import {
  QUIZ_ENTRY_STEP,
  resolveQuizResumeStep,
} from "@/lib/quiz-funnel/funnel-steps";
import { getQuizRouteSteps } from "@/lib/quiz-funnel/quiz-route";
import { readQuizSnapshotClient } from "@/lib/quiz-funnel/quiz-storage";

export { QUIZ_ENTRY_STEP };
export const PLAN_BUILDER_PATH = "/plan";

/** Meta ad destination — same LP as `/`, distinct path for reporting. */
export const SAT_PLAN_BUILDER_LP_PATH = "/sat-plan-builder";

/** Paths that render the SAT parent landing page (hero + trust bar). */
export const SAT_PARENT_LP_PATHS = ["/", SAT_PLAN_BUILDER_LP_PATH] as const;

export function isSatParentLandingPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return (SAT_PARENT_LP_PATHS as readonly string[]).includes(pathname);
}

export type PlanBuilderQuery = Record<string, string | undefined>;

/** Build `/plan?step=…&utm_*=…` for ads, email, and in-app navigation. */
export function planBuilderHref(
  step: string,
  extra: PlanBuilderQuery = {}
): string {
  const params = new URLSearchParams();
  params.set("step", step);
  for (const [key, value] of Object.entries(extra)) {
    if (value != null && value !== "") {
      params.set(key, value);
    }
  }
  return `${PLAN_BUILDER_PATH}?${params.toString()}`;
}

/** True when pathname is Plan Builder (canonical or legacy redirect source). */
export function isPlanBuilderPathname(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname === PLAN_BUILDER_PATH || pathname.startsWith(`${PLAN_BUILDER_PATH}/`);
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid"
] as const;

/**
 * Plan Builder entry from LP — `/plan?step=…` plus UTMs from the landing URL.
 * Resumes in-progress sessions (localStorage) instead of always resetting to the entry step.
 */
export function planBuilderEntryFromLanding(search?: string): string {
  const params = new URLSearchParams();
  let step = QUIZ_ENTRY_STEP;
  if (typeof window !== "undefined") {
    const snap = readQuizSnapshotClient();
    const answers = snap?.answers ?? {};
    const routeSteps = getQuizRouteSteps(answers);
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
  return `${PLAN_BUILDER_PATH}?${params.toString()}`;
}

/** In-funnel navigation — keep UTMs and other query params on `/plan`. */
export function planBuilderStepHref(
  step: string,
  currentSearch?: string
): string {
  const params = new URLSearchParams(
    currentSearch?.startsWith("?") ? currentSearch.slice(1) : currentSearch ?? ""
  );
  params.set("step", step);
  return `${PLAN_BUILDER_PATH}?${params.toString()}`;
}
