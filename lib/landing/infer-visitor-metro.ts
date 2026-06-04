import type { TrustMetroRegion } from "@/lib/landing/trust-metro-schools";
import type { LandingTrustScoreStory } from "@/lib/landing/trust-scores";
import { affluentZipClusters } from "@/lib/landing/trust-affluent-zips";

/** Matches `landingTrustMetroRegions[].id` */
export type TrustMetroId =
  | "atlanta"
  | "dallas"
  | "houston"
  | "miami"
  | "charlotte"
  | "phoenix"
  | "dc"
  | "nashville"
  | "boston"
  | "nj";

export const TRUST_METRO_IDS: TrustMetroId[] = [
  "atlanta",
  "dallas",
  "houston",
  "miami",
  "charlotte",
  "phoenix",
  "dc",
  "nashville",
  "boston",
  "nj"
];

export type MetroInferenceSource = "query" | "utm" | "geo" | "default";

export type MetroInferenceResult = {
  metroId: TrustMetroId | null;
  source: MetroInferenceSource;
};

const METRO_QUERY_ALIASES: Record<string, TrustMetroId> = {
  atlanta: "atlanta",
  atl: "atlanta",
  dallas: "dallas",
  dfw: "dallas",
  houston: "houston",
  hou: "houston",
  miami: "miami",
  mia: "miami",
  charlotte: "charlotte",
  clt: "charlotte",
  phoenix: "phoenix",
  phx: "phoenix",
  scottsdale: "phoenix",
  dc: "dc",
  nova: "dc",
  nashville: "nashville",
  bna: "nashville",
  boston: "boston",
  nj: "nj",
  nyc: "nj"
};

/** City names (lowercase) → metro — extend as you add ZIP clusters. */
const CITY_TO_METRO: Record<string, TrustMetroId> = {
  atlanta: "atlanta",
  alpharetta: "atlanta",
  roswell: "atlanta",
  marietta: "atlanta",
  "johns creek": "atlanta",
  milton: "atlanta",
  suwanee: "atlanta",
  cumming: "atlanta",
  dallas: "dallas",
  plano: "dallas",
  frisco: "dallas",
  southlake: "dallas",
  coppell: "dallas",
  allen: "dallas",
  houston: "houston",
  katy: "houston",
  woodlands: "houston",
  miami: "miami",
  "coral gables": "miami",
  pinecrest: "miami",
  charlotte: "charlotte",
  matthews: "charlotte",
  scottsdale: "phoenix",
  mclean: "dc",
  bethesda: "dc",
  arlington: "dc",
  brentwood: "nashville",
  franklin: "nashville",
  lexington: "boston",
  westfield: "nj",
  princeton: "nj",
  scarsdale: "nj"
};

/** US state / region code → fallback metro when city is missing. */
const STATE_FALLBACK_METRO: Record<string, TrustMetroId> = {
  GA: "atlanta",
  TX: "dallas",
  FL: "miami",
  NC: "charlotte",
  AZ: "phoenix",
  VA: "dc",
  MD: "dc",
  DC: "dc",
  TN: "nashville",
  MA: "boston",
  NJ: "nj",
  NY: "nj"
};

const HOUSTON_TX_CITIES = new Set([
  "houston",
  "katy",
  "sugar land",
  "the woodlands",
  "memorial",
  "bellaire",
  "pearland"
]);

function normalizeRegion(region?: string): string | undefined {
  if (!region) return undefined;
  const r = region.trim().toUpperCase();
  if (r.startsWith("US-")) return r.slice(3);
  return r;
}

function normalizeCity(city?: string): string | undefined {
  if (!city) return undefined;
  return city.trim().toLowerCase();
}

export function normalizeMetroParam(raw?: string | null): TrustMetroId | null {
  if (!raw) return null;
  const key = raw.trim().toLowerCase();
  return METRO_QUERY_ALIASES[key] ?? null;
}

/** Infer metro from Vercel geo headers or geolocation() fields. */
export function inferMetroFromGeo(input: {
  country?: string;
  region?: string;
  city?: string;
}): TrustMetroId | null {
  const country = input.country?.trim().toUpperCase();
  if (country && country !== "US") return null;

  const city = normalizeCity(input.city);
  const state = normalizeRegion(input.region);

  if (state === "TX" && city) {
    if (HOUSTON_TX_CITIES.has(city)) return "houston";
    return "dallas";
  }

  if (city === "weston") {
    if (state === "FL") return "miami";
    if (state === "MA") return "boston";
  }

  if (city && CITY_TO_METRO[city]) {
    return CITY_TO_METRO[city];
  }

  if (state && STATE_FALLBACK_METRO[state]) {
    return STATE_FALLBACK_METRO[state];
  }

  return null;
}

/** Parse `?metro=` from search string. */
export function metroFromSearch(search: string): TrustMetroId | null {
  const normalized = search.startsWith("?") ? search.slice(1) : search;
  return normalizeMetroParam(new URLSearchParams(normalized).get("metro"));
}

/** Optional: infer from campaign slug e.g. `fall_sat_atlanta`. */
export function metroFromUtmCampaign(campaign?: string): TrustMetroId | null {
  if (!campaign) return null;
  const lower = campaign.toLowerCase();
  for (const id of TRUST_METRO_IDS) {
    if (lower.includes(id)) return id;
  }
  if (lower.includes("dfw")) return "dallas";
  if (lower.includes("nova")) return "dc";
  return null;
}

export function resolvePreferredMetro(input: {
  metroParam?: string | null;
  utmCampaign?: string;
  country?: string;
  region?: string;
  city?: string;
}): MetroInferenceResult {
  const fromQuery = normalizeMetroParam(input.metroParam);
  if (fromQuery) return { metroId: fromQuery, source: "query" };

  const fromUtm = metroFromUtmCampaign(input.utmCampaign);
  if (fromUtm) return { metroId: fromUtm, source: "utm" };

  const fromGeo = inferMetroFromGeo({
    country: input.country,
    region: input.region,
    city: input.city
  });
  if (fromGeo) return { metroId: fromGeo, source: "geo" };

  return { metroId: null, source: "default" };
}

const highSchoolMetroIndex = (() => {
  const map = new Map<string, TrustMetroId>();
  for (const cluster of affluentZipClusters) {
    for (const school of cluster.publicHighSchools) {
      if (!map.has(school)) map.set(school, cluster.metroId as TrustMetroId);
    }
  }
  return map;
})();

export function highSchoolToMetroId(highSchool: string): TrustMetroId | null {
  return highSchoolMetroIndex.get(highSchool) ?? null;
}

export function sortMetroRegions(
  regions: TrustMetroRegion[],
  preferred: TrustMetroId | null
): TrustMetroRegion[] {
  if (!preferred) return regions;
  const match = regions.filter((r) => r.id === preferred);
  const rest = regions.filter((r) => r.id !== preferred);
  return [...match, ...rest];
}

export function sortTrustScoreStories(
  stories: LandingTrustScoreStory[],
  preferred: TrustMetroId | null
): LandingTrustScoreStory[] {
  if (!preferred) return stories;
  const local: LandingTrustScoreStory[] = [];
  const other: LandingTrustScoreStory[] = [];
  for (const story of stories) {
    if (highSchoolToMetroId(story.highSchool) === preferred) {
      local.push(story);
    } else {
      other.push(story);
    }
  }
  return [...local, ...other];
}

/** Map metro → hero hook for message match. */
export function heroHookForMetro(metro: TrustMetroId | null): string | null {
  if (!metro) return null;
  const map: Partial<Record<TrustMetroId, string>> = {
    atlanta: "gpa",
    dallas: "gap",
    houston: "gap",
    miami: "gap",
    charlotte: "fall",
    phoenix: "fall",
    dc: "nov1",
    nj: "gap",
    boston: "gap",
    nashville: "fall"
  };
  return map[metro] ?? null;
}
