/**
 * Canonical funnel identity — the one place that decides which funnel an event
 * belongs to.
 *
 * Both funnels emit the same event names (`quiz_started`, `quiz_step_view`,
 * `parent_confirmed`, `quiz_schedule_view`, `quiz_lead_submitted`), so an event
 * name alone can never tell them apart. Components used to pass their own tag,
 * under three different keys (`funnel`, `funnel_id`, and nothing at all), which
 * made every cross-funnel metric wrong. Resolve from the request path instead:
 * a component cannot forget to send the path.
 */

export const FUNNEL_IDS = {
  /** `/plan` — Strategy Call. */
  strategyCall: "sat_quiz",
  /** `/plan-b` + its `/sat-plan-builder` landing page — free lesson. */
  freeLesson: "plan_builder_b",
  /** `/score-review`. */
  scoreReview: "score_review",
} as const;

export type FunnelId = (typeof FUNNEL_IDS)[keyof typeof FUNNEL_IDS];

/** Legacy tags that reached the database before this module existed. */
const LEGACY_ALIASES: Record<string, FunnelId> = {
  sat_quiz: FUNNEL_IDS.strategyCall,
  plan_builder_b: FUNNEL_IDS.freeLesson,
  sat_quiz_b: FUNNEL_IDS.freeLesson,
  score_review: FUNNEL_IDS.scoreReview,
};

function matches(path: string, base: string): boolean {
  return path === base || path.startsWith(`${base}/`);
}

/**
 * Null for pages that are not one of the funnels (the homepage, portals, admin).
 * Null means "not a funnel event", never "unknown funnel".
 */
export function funnelIdForPath(
  path: string | null | undefined
): FunnelId | null {
  if (!path) return null;
  const clean = path.split("?")[0].replace(/\/+$/, "") || "/";

  if (matches(clean, "/plan-b") || matches(clean, "/quiz-b")) {
    return FUNNEL_IDS.freeLesson;
  }
  if (clean === "/sat-plan-builder" || clean === "/sat-free-lesson") {
    return FUNNEL_IDS.freeLesson;
  }
  if (matches(clean, "/plan") || matches(clean, "/quiz")) {
    return FUNNEL_IDS.strategyCall;
  }
  if (
    matches(clean, "/score-review") ||
    matches(clean, "/june-score-review") ||
    matches(clean, "/plan-c") ||
    matches(clean, "/quiz-c")
  ) {
    return FUNNEL_IDS.scoreReview;
  }
  return null;
}

/** Fallback for server events with no path, e.g. a Calendly webhook booking. */
export function normalizeLegacyFunnelId(value: unknown): FunnelId | null {
  if (typeof value !== "string") return null;
  return LEGACY_ALIASES[value.trim()] ?? null;
}

/** Path first, then whatever tag the caller happened to send. */
export function resolveFunnelId(input: {
  path?: string | null;
  payload?: Record<string, unknown> | null;
}): FunnelId | null {
  const fromPath = funnelIdForPath(input.path);
  if (fromPath) return fromPath;
  const payload = input.payload ?? {};
  return (
    normalizeLegacyFunnelId(payload.funnel_id) ??
    normalizeLegacyFunnelId(payload.funnel)
  );
}
