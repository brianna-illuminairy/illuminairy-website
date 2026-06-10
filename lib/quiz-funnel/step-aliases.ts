/**
 * Plan Builder step ID aliases — one canonical ID per screen.
 *
 * Analytics emits canonical `step` only. For historical HogQL, use
 * `quizStepIdsForCounting()` or `hogqlQuizStepCanonical()` — never sum
 * per-alias counts (that double-counts users who appear under both IDs).
 */

/** Canonical step ID → legacy/deep-link aliases that render the same screen. */
export const QUIZ_STEP_ALIAS_GROUPS: Record<string, readonly string[]> = {
  "q1-parent-child": ["q-who"],
  /**
   * Goal achievability rating (pre-name). NOT plan reveal (`v1`).
   * Legacy deep-link IDs `reveal` / `s1` — do not use "reveal" to mean plan reveal in docs or HogQL comments.
   */
  achievability: ["reveal", "s1"],
};

const ALIAS_TO_CANONICAL = new Map<string, string>();

for (const [canonical, aliases] of Object.entries(QUIZ_STEP_ALIAS_GROUPS)) {
  ALIAS_TO_CANONICAL.set(canonical, canonical);
  for (const alias of aliases) {
    ALIAS_TO_CANONICAL.set(alias, canonical);
  }
}

/** Single canonical step ID for routing, storage, and analytics capture. */
export function canonicalizeQuizStepId(step: string): string {
  return ALIAS_TO_CANONICAL.get(step) ?? step;
}

/**
 * All step IDs that represent the same screen — for DISTINCT person counts in HogQL.
 * Pass a canonical ID or any of its aliases.
 */
export function quizStepIdsForCounting(step: string): readonly string[] {
  const canonical = canonicalizeQuizStepId(step);
  const aliases = QUIZ_STEP_ALIAS_GROUPS[canonical];
  if (!aliases) return [canonical];
  return [canonical, ...aliases];
}

/** HogQL expression mapping legacy step IDs to canonical (historical + new events). */
export function hogqlQuizStepCanonical(
  stepProperty = "properties.step"
): string {
  const cases: string[] = [];
  for (const [canonical, aliases] of Object.entries(QUIZ_STEP_ALIAS_GROUPS)) {
    for (const alias of aliases) {
      cases.push(`WHEN ${stepProperty} = '${alias}' THEN '${canonical}'`);
    }
  }
  return `CASE ${cases.join(" ")} ELSE ${stepProperty} END`;
}

/** True when URL or stored step should redirect to the canonical ID. */
export function isQuizStepAlias(step: string): boolean {
  const canonical = ALIAS_TO_CANONICAL.get(step);
  return Boolean(canonical && canonical !== step);
}
