/**
 * Canonical public URLs for the Plan Builder B lab funnel.
 * Customer-facing links use `/plan-b` — internal folder will be `app/quiz-b/`.
 * Next.js rewrites `/plan-b` → `/quiz-b`.
 */

import {
  QUIZ_ENTRY_STEP,
  canonicalizeQuizStepId,
  resolveQuizResumeStep,
} from "@/lib/quiz-funnel-b/funnel-steps";
import { getLabQuizRouteSteps } from "@/lib/quiz-funnel-b/quiz-route";
import { readQuizSnapshotClient } from "@/lib/quiz-funnel-b/quiz-storage";

export { QUIZ_ENTRY_STEP };
export const PLAN_BUILDER_B_PATH = "/plan-b";

/** Meta / QA entry for Plan Builder B lab — same hero hooks as `/sat-plan-builder`, routes CTA to `/plan-b`. */
export const SAT_FREE_LESSON_LP_PATH = "/sat-free-lesson";

export const PLAN_BUILDER_B_QUERY_PARAM = "pb";
export const PLAN_BUILDER_B_QUERY_VALUE = "b";

/** Live Meta creative slug — ad3 tutor HD relaunch → Plan Builder B lab funnel. */
export const AD3_TUTOR_HD_UTM_CONTENT = "ad3_before_tutoring_hd1080";

export type PlanBuilderBQuery = Record<string, string | undefined>;

function parseSearchParams(search: string): URLSearchParams {
  return new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
}

/** True when LP CTA should enter `/plan-b` (lab funnel), not `/plan`. */
export function isPlanBuilderBLabFromSearch(search: string): boolean {
  return parseSearchParams(search).get(PLAN_BUILDER_B_QUERY_PARAM) === PLAN_BUILDER_B_QUERY_VALUE;
}

/**
 * Ad3 tutor HD (`utm_content=ad3_before_tutoring_hd1080` or `hook=tutor&version=hd1080`)
 * is the live lab entry: tutor message-match LP → `/plan-b`.
 */
export function isPlanBuilderBAd3TutorHdFromSearch(search: string): boolean {
  const params = parseSearchParams(search);
  const content = params.get("utm_content")?.toLowerCase().trim();
  if (content === AD3_TUTOR_HD_UTM_CONTENT) return true;
  return params.get("hook") === "tutor" && params.get("version") === "hd1080";
}

/** LP handoff target: Plan Builder B lab vs original `/plan`. */
export function shouldRouteLandingCtaToPlanBuilderB(search: string): boolean {
  return isPlanBuilderBLabFromSearch(search) || isPlanBuilderBAd3TutorHdFromSearch(search);
}

/** Build `/plan-b?step=…&utm_*=…` for ads, email, and in-app navigation. */
export function planBuilderBHref(
  step: string,
  extra: PlanBuilderBQuery = {}
): string {
  const params = new URLSearchParams();
  params.set("step", canonicalizeQuizStepId(step));
  for (const [key, value] of Object.entries(extra)) {
    if (value != null && value !== "") {
      params.set(key, value);
    }
  }
  return `${PLAN_BUILDER_B_PATH}?${params.toString()}`;
}

/** True when pathname is Plan Builder B (canonical or legacy redirect source). */
export function isPlanBuilderBPathname(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname === PLAN_BUILDER_B_PATH || pathname.startsWith(`${PLAN_BUILDER_B_PATH}/`);
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

/** Query keys preserved from LP → `/plan-b` (UTMs + hook + lab flag + creative version). */
const LAB_ENTRY_QUERY_KEYS = [
  ...UTM_KEYS,
  "hook",
  "version",
  PLAN_BUILDER_B_QUERY_PARAM,
] as const;

/**
 * Plan Builder B entry from LP — `/plan-b?step=…` plus UTMs from the landing URL.
 * Resumes in-progress sessions (localStorage) instead of always resetting to the entry step.
 */
export function planBuilderBEntryFromLanding(search?: string): string {
  const params = new URLSearchParams();
  let step = QUIZ_ENTRY_STEP;
  if (typeof window !== "undefined") {
    const snap = readQuizSnapshotClient();
    const answers = snap?.answers ?? {};
    const routeSteps = getLabQuizRouteSteps(answers);
    step = resolveQuizResumeStep(answers, routeSteps, snap?.lastStep ?? null);
  }
  params.set("step", step);
  if (search) {
    const incoming = new URLSearchParams(
      search.startsWith("?") ? search.slice(1) : search
    );
    for (const key of LAB_ENTRY_QUERY_KEYS) {
      const value = incoming.get(key);
      if (value) params.set(key, value);
    }
  }
  if (!params.get(PLAN_BUILDER_B_QUERY_PARAM)) {
    params.set(PLAN_BUILDER_B_QUERY_PARAM, PLAN_BUILDER_B_QUERY_VALUE);
  }
  return `${PLAN_BUILDER_B_PATH}?${params.toString()}`;
}

/** In-funnel navigation — keep UTMs and other query params on `/plan-b`. */
export function planBuilderBStepHref(
  step: string,
  currentSearch?: string
): string {
  const params = new URLSearchParams(
    currentSearch?.startsWith("?") ? currentSearch.slice(1) : currentSearch ?? ""
  );
  params.set("step", canonicalizeQuizStepId(step));
  return `${PLAN_BUILDER_B_PATH}?${params.toString()}`;
}
