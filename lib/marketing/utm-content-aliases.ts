/**
 * Canonical utm_content slugs for live Meta creatives.
 *
 * Analytics emits canonical `utm_content` only. For historical HogQL, use
 * `utmContentIdsForCounting()` or `hogqlUtmContentCanonical()` — never sum
 * per-alias counts (double-counts users who appear under both slugs).
 *
 * SSOT for live ad slugs: `META_LIVE_CREATIVES` in meta-live-creatives.ts.
 */

/** Canonical utm_content → legacy / renamed slugs for the same creative. */
export const UTM_CONTENT_ALIAS_GROUPS: Record<string, readonly string[]> = {
  /** ad1_concerned_mom — Icon script 5 / good-grades-low-SAT angle */
  script_5: ["concerned_mom_good_grades_low_sat", "concerned_mom"]
};

const ALIAS_TO_CANONICAL = new Map<string, string>();

for (const [canonical, aliases] of Object.entries(UTM_CONTENT_ALIAS_GROUPS)) {
  ALIAS_TO_CANONICAL.set(canonical, canonical);
  for (const alias of aliases) {
    ALIAS_TO_CANONICAL.set(alias, canonical);
  }
}

/** Single canonical utm_content for capture, storage, and PostHog props. */
export function canonicalizeUtmContent(content: string): string {
  const normalized = content.trim().toLowerCase();
  if (!normalized) return normalized;
  return ALIAS_TO_CANONICAL.get(normalized) ?? normalized;
}

/**
 * All utm_content values that represent the same creative — for DISTINCT counts in HogQL.
 * Pass a canonical slug or any of its aliases.
 */
export function utmContentIdsForCounting(content: string): readonly string[] {
  const canonical = canonicalizeUtmContent(content);
  const aliases = UTM_CONTENT_ALIAS_GROUPS[canonical];
  if (!aliases) return [canonical];
  return [canonical, ...aliases];
}

/** HogQL expression mapping legacy utm_content to canonical (historical + new events). */
export function hogqlUtmContentCanonical(
  contentProperty = "properties.utm_content"
): string {
  const cases: string[] = [];
  for (const [canonical, aliases] of Object.entries(UTM_CONTENT_ALIAS_GROUPS)) {
    for (const alias of aliases) {
      cases.push(`WHEN ${contentProperty} = '${alias}' THEN '${canonical}'`);
    }
  }
  return `CASE ${cases.join(" ")} ELSE ${contentProperty} END`;
}

/** True when the slug is a legacy alias (not the canonical value). */
export function isUtmContentAlias(content: string): boolean {
  const normalized = content.trim().toLowerCase();
  const canonical = ALIAS_TO_CANONICAL.get(normalized);
  return Boolean(canonical && canonical !== normalized);
}
