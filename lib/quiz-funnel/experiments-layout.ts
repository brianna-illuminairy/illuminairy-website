/**
 * PostHog experiment: LP layout density (full vs compact).
 *
 * Flag `sat-lp-layout` — suggested 50/50:
 *   full (control) | compact (treatment)
 *
 * Dev override: ?lp_layout=full|compact (does not write to experiment)
 */

import posthog from "posthog-js";
import { getPostHogKey } from "@/lib/posthog";

export const LP_LAYOUT_FLAG = "sat-lp-layout" as const;

export const LP_LAYOUTS = ["full", "compact"] as const;

export type LpLayout = (typeof LP_LAYOUTS)[number];

/** Cold DR default: hero-only LP. Full scroll only via ?lp_layout=full (QA). */
const DEFAULT_LAYOUT: LpLayout = "compact";

const DEV_OVERRIDE_MAP: Record<string, LpLayout> = {
  full: "full",
  compact: "compact"
};

export function normalizeLpLayout(raw: string | boolean | undefined): LpLayout {
  if (typeof raw === "string" && LP_LAYOUTS.includes(raw as LpLayout)) {
    return raw as LpLayout;
  }
  return DEFAULT_LAYOUT;
}

export function devLayoutOverrideFromSearch(search: string): LpLayout | null {
  const normalized = search.startsWith("?") ? search.slice(1) : search;
  const params = new URLSearchParams(normalized);
  const layout = params.get("lp_layout")?.toLowerCase();
  if (layout && DEV_OVERRIDE_MAP[layout]) return DEV_OVERRIDE_MAP[layout];
  return null;
}

/** Resolved layout from PostHog flag (or default when unavailable). */
export function resolveLpLayoutFromFlag(): LpLayout {
  if (typeof window === "undefined" || !getPostHogKey()) {
    return DEFAULT_LAYOUT;
  }
  const raw = posthog.getFeatureFlag(LP_LAYOUT_FLAG);
  return normalizeLpLayout(typeof raw === "string" ? raw : undefined);
}

export function trackLpLayoutExperimentExposure(
  layout: LpLayout,
  extra?: { flag_timeout?: boolean }
) {
  if (!getPostHogKey()) return;
  posthog.register({ sat_lp_layout: layout });
  posthog.capture("experiment_exposure", {
    experiment: LP_LAYOUT_FLAG,
    variant: layout,
    sat_lp_layout: layout,
    implemented: true,
    ...extra
  });
}
