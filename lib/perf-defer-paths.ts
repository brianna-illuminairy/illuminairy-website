import {
  isPlanBuilderBPathname,
  PLAN_BUILDER_B_PATH,
} from "@/lib/plan-builder-b-routes";
import { QUIZ_ENTRY_STEP } from "@/lib/quiz-funnel-b/funnel-steps";

export { isPlanBuilderBPathname, PLAN_BUILDER_B_PATH, QUIZ_ENTRY_STEP };

const AD_LANDING_PATHS = ["/sat-plan-builder", "/sat-free-lesson"] as const;

/** Ad LP + Plan B funnel: defer third-party marketing scripts until engagement or LCP. */
export function isMarketingDeferPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  if ((AD_LANDING_PATHS as readonly string[]).includes(pathname)) return true;
  return isPlanBuilderBPathname(pathname);
}

const KLAVIYO_PLAN_B_STEPS = new Set([
  "b-email",
  "b-parent-name",
  "b-phone",
  "b-claim",
  "b-book",
  "booked",
]);

/** Klaviyo loads on contact steps only — not on ad LP or early Plan B steps. */
export function shouldLoadKlaviyoNow(
  pathname: string | null | undefined,
  step: string | null | undefined
): boolean {
  if (!pathname) return true;
  if ((AD_LANDING_PATHS as readonly string[]).includes(pathname)) return false;
  if (isPlanBuilderBPathname(pathname)) {
    return KLAVIYO_PLAN_B_STEPS.has(step ?? "");
  }
  return true;
}

export function isPlanBuilderBEntryStep(
  pathname: string | null | undefined,
  step: string | null | undefined
): boolean {
  if (!isPlanBuilderBPathname(pathname)) return false;
  const s = step ?? "";
  return s === "" || s === QUIZ_ENTRY_STEP;
}
