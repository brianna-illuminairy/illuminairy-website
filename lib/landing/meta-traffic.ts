import {
  heroHookForMetro,
  metroFromSearch,
  normalizeMetroParam,
  type MetroInferenceResult,
  type TrustMetroId
} from "@/lib/landing/infer-visitor-metro";
import {
  resolveLandingHeroHook,
  type LandingHeroHook,
  type LandingHeroHookSource
} from "@/lib/landing/hero-hooks";

export type MetaLandingContext = {
  isMetaPaid: boolean;
  metro: MetroInferenceResult;
  heroHook: LandingHeroHook;
  heroHookSource: LandingHeroHookSource;
};

function parseParams(search: string): URLSearchParams {
  const normalized = search.startsWith("?") ? search.slice(1) : search;
  return new URLSearchParams(normalized);
}

/** Meta Ads Manager, Instagram, or Advantage+ traffic. */
export function isMetaPaidSearch(search: string): boolean {
  const params = parseParams(search);
  if (params.get("fbclid")) return true;
  const src = params.get("utm_source")?.toLowerCase() ?? "";
  if (src === "facebook" || src === "fb" || src === "meta" || src === "instagram") {
    return true;
  }
  const medium = params.get("utm_medium")?.toLowerCase() ?? "";
  if (medium === "paid_social" && (src.includes("facebook") || src.includes("meta"))) {
    return true;
  }
  return false;
}

/**
 * Metro personalization only when the ad URL sets `?metro=` explicitly.
 * National broad targeting = no reorder (trust bar shows score proof first).
 */
export function resolveMetaMetro(search: string): MetroInferenceResult {
  const fromQuery = metroFromSearch(search);
  if (fromQuery) return { metroId: fromQuery, source: "query" };
  return { metroId: null, source: "default" };
}

function metroHeroHook(metroId: TrustMetroId | null): LandingHeroHook | null {
  if (!metroId) return null;
  const raw = heroHookForMetro(metroId);
  if (
    raw === "gpa" ||
    raw === "fall" ||
    raw === "khan" ||
    raw === "nov1" ||
    raw === "gap" ||
    raw === "june" ||
    raw === "tutor"
  ) {
    return raw;
  }
  return null;
}

/** Resolve hook + optional metro from ad URL (national-first). */
export function resolveMetaLandingContext(search: string): MetaLandingContext {
  const params = parseParams(search);
  const metro = resolveMetaMetro(search);
  const metroHook = metro.metroId ? metroHeroHook(metro.metroId) : null;
  const resolved = resolveLandingHeroHook({
    search,
    utmContent: params.get("utm_content"),
    utmCampaign: params.get("utm_campaign"),
    metroHook
  });

  return {
    isMetaPaid: isMetaPaidSearch(search),
    metro,
    heroHook: resolved.hook,
    heroHookSource: resolved.source
  };
}

/** Default national Meta ad destination — hook via utm_content, not metro. */
export function metaLandingUrl(input: {
  hook?: LandingHeroHook;
  campaign?: string;
  content: string;
  metro?: TrustMetroId;
}): string {
  const params = new URLSearchParams({
    utm_source: "facebook",
    utm_medium: "paid_social",
    utm_campaign: input.campaign ?? "fall_sat_national",
    utm_content: input.content
  });
  if (input.hook) params.set("hook", input.hook);
  if (input.metro) params.set("metro", input.metro);
  return `https://illuminairy.com/?${params.toString()}`;
}

/** Live Meta cold ads — `/sat-plan-builder` path (same LP, distinct reporting). */
export function metaSatPlanBuilderLandingUrl(input: {
  hook?: LandingHeroHook;
  campaign?: string;
  content: string;
  term?: string;
  source?: "facebook" | "meta";
}): string {
  const params = new URLSearchParams({
    utm_source: input.source ?? "meta",
    utm_medium: "paid_social",
    utm_campaign: input.campaign ?? "c1_sat_plan_builder_cold_creative_test",
    utm_content: input.content
  });
  if (input.term) params.set("utm_term", input.term);
  if (input.hook) params.set("hook", input.hook);
  return `https://illuminairy.com/sat-plan-builder?${params.toString()}`;
}

export { metroFromSearch, normalizeMetroParam };
