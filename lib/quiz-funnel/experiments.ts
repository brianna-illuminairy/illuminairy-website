/**
 * PostHog experiments for SAT funnel landing pages.
 *
 * Flag `sat-lp-variant` — multivariate 33/33/33:
 *   b3a-problem | b3b-results | b3c-authority
 *
 * Dev override: ?lp=b3a|b3b|b3c (does not write to experiment)
 */

import posthog from "posthog-js";
import { getPostHogKey } from "@/lib/posthog";

export const LP_VARIANT_FLAG = "sat-lp-variant" as const;

export const LP_VARIANTS = [
  "b3a-problem",
  "b3b-results",
  "b3c-authority"
] as const;

export type LpVariant = (typeof LP_VARIANTS)[number];

const DEFAULT_VARIANT: LpVariant = "b3a-problem";

const DEV_OVERRIDE_MAP: Record<string, LpVariant> = {
  b3a: "b3a-problem",
  b3b: "b3b-results",
  b3c: "b3c-authority"
};

export function normalizeLpVariant(raw: string | boolean | undefined): LpVariant {
  if (typeof raw === "string" && LP_VARIANTS.includes(raw as LpVariant)) {
    return raw as LpVariant;
  }
  return DEFAULT_VARIANT;
}

export function devOverrideFromSearch(search: string): LpVariant | null {
  const normalized = search.startsWith("?") ? search.slice(1) : search;
  const params = new URLSearchParams(normalized);
  const lp = params.get("lp")?.toLowerCase();
  if (lp && DEV_OVERRIDE_MAP[lp]) return DEV_OVERRIDE_MAP[lp];
  return null;
}

/** Resolved variant from PostHog flag (or default when unavailable). */
export function resolveLpVariantFromFlag(): LpVariant {
  if (typeof window === "undefined" || !getPostHogKey()) {
    return DEFAULT_VARIANT;
  }
  const raw = posthog.getFeatureFlag(LP_VARIANT_FLAG);
  return normalizeLpVariant(typeof raw === "string" ? raw : undefined);
}

export function trackLpExperimentExposure(
  variant: LpVariant,
  extra?: { flag_timeout?: boolean; sat_lp_layout?: string }
) {
  if (!getPostHogKey()) return;
  posthog.register({ sat_lp_variant: variant });
  posthog.capture("experiment_exposure", {
    experiment: LP_VARIANT_FLAG,
    variant,
    implemented: true,
    ...extra
  });
}
