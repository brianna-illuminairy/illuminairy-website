import type { AttributionSnapshot } from "@/lib/attribution";
import type { LandingHeroHook } from "@/lib/landing/hero-hooks";
import { isSatParentLandingPath } from "@/lib/plan-builder-routes";
import { META_LIVE_CREATIVES, type MetaLiveCreative } from "@/lib/marketing/meta-live-creatives";

/** Normalize stored landing_page (full URL or pathname) to a parent LP path. */
export function landingPathFromSnapshot(
  snap: Partial<AttributionSnapshot>
): string | null {
  const raw = snap.landing_page;
  if (!raw) return null;
  try {
    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      const path = new URL(raw).pathname;
      return isSatParentLandingPath(path) ? path : null;
    }
  } catch {
    /* ignore malformed URL */
  }
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return isSatParentLandingPath(path) ? path : null;
}

function creativesOnPath(path: string): MetaLiveCreative[] {
  return META_LIVE_CREATIVES.filter((c) => c.landingPath === path);
}

function creativeToAttribution(
  creative: MetaLiveCreative,
  landingPath: string
): Partial<AttributionSnapshot> {
  return {
    utm_source: "meta",
    utm_medium: "paid_social",
    utm_campaign: creative.utmCampaign,
    utm_content: creative.utmContent,
    utm_term: creative.utmTerm,
    landing_page: landingPath
  };
}

/**
 * When URL UTMs are missing, infer Meta tags from the SAT parent LP path.
 * Single-ad paths (e.g. `/`) map 1:1. Shared paths use `heroHook` when set.
 */
export function inferMetaAttributionFromLanding(
  landingPath: string | null | undefined,
  heroHook?: LandingHeroHook | string | null
): Partial<AttributionSnapshot> {
  if (!landingPath || !isSatParentLandingPath(landingPath)) {
    return {};
  }

  const onPath = creativesOnPath(landingPath);
  if (onPath.length === 0) return { landing_page: landingPath };

  if (heroHook && heroHook !== "default") {
    const byHook = onPath.find((c) => c.heroHook === heroHook);
    if (byHook) return creativeToAttribution(byHook, landingPath);
  }

  if (onPath.length === 1) {
    return creativeToAttribution(onPath[0], landingPath);
  }

  const sharedCampaign = onPath[0]?.utmCampaign;
  return {
    utm_source: "meta",
    utm_medium: "paid_social",
    utm_campaign: sharedCampaign,
    utm_content: `lp${landingPath.replace(/\//g, "_") || "_root"}`,
    utm_term: onPath[0]?.utmTerm,
    landing_page: landingPath
  };
}

export function needsLandingAttributionInference(
  snap: Partial<AttributionSnapshot>
): boolean {
  return !snap.utm_content && !snap.utm_campaign;
}

/** Fill missing UTM fields from LP path + optional hero hook (does not overwrite URL UTMs). */
export function applyLandingAttributionInference(
  snap: AttributionSnapshot
): AttributionSnapshot {
  if (!needsLandingAttributionInference(snap)) {
    return snap;
  }
  const path = landingPathFromSnapshot(snap);
  if (!path) return snap;
  const inferred = inferMetaAttributionFromLanding(path, snap.hero_hook);
  return { ...snap, ...mergeInferredOnly(snap, inferred) };
}

function mergeInferredOnly(
  base: Partial<AttributionSnapshot>,
  incoming: Partial<AttributionSnapshot>
): Partial<AttributionSnapshot> {
  const out: Partial<AttributionSnapshot> = {};
  const keys: (keyof AttributionSnapshot)[] = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "landing_page"
  ];
  for (const key of keys) {
    const value = incoming[key];
    if (value && !base[key]) {
      out[key] = value;
    }
  }
  return out;
}
