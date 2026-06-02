/**
 * Canonical public URLs for the parent Plan Builder funnel.
 * Customer-facing links use `/plan` — never `/quiz` (banned product language).
 * Internal folder remains `app/quiz/`; Next.js rewrites `/plan` → `/quiz`.
 */

export const PLAN_BUILDER_PATH = "/plan";

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
