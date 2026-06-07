/**
 * Canonical public URLs for the parent Plan Builder funnel.
 * Customer-facing links use `/plan` — never `/quiz` (banned product language).
 * Internal folder remains `app/quiz/`; Next.js rewrites `/plan` → `/quiz`.
 */

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
 * Plan Builder entry from LP — canonical `/plan?step=q1` plus UTMs from the landing URL.
 */
export function planBuilderEntryFromLanding(search?: string): string {
  const params = new URLSearchParams();
  params.set("step", "q1");
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
