/** First-touch attribution — browser session + cookie helpers. */

export const VISITOR_COOKIE = "illuminairy_vid";
export const ATTRIBUTION_SESSION_KEY = "illuminairy_attribution";

export type AttributionSnapshot = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  /** Meta click IDs captured at landing — bridges LP -> quiz under Safari ITP. */
  fbp?: string;
  fbc?: string;
  landing_page?: string;
  referrer?: string;
};

const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid"
] as const;

export function parseAttributionFromSearch(
  search: string
): AttributionSnapshot {
  const params = new URLSearchParams(search);
  const snap: AttributionSnapshot = {};

  for (const key of TRACKING_KEYS) {
    const value = params.get(key);
    if (value) {
      snap[key] = value;
    }
  }

  return snap;
}

export function deriveLeadSource(snap: AttributionSnapshot): string {
  const src = snap.utm_source?.toLowerCase() ?? "";
  if (
    snap.fbclid ||
    src === "facebook" ||
    src === "fb" ||
    src === "meta" ||
    src === "instagram" ||
    src.includes("facebook")
  ) {
    return "meta";
  }
  if (snap.gclid || snap.utm_source?.toLowerCase() === "google") {
    return "google";
  }
  if (snap.utm_medium?.toLowerCase() === "email") {
    return "newsletter";
  }
  if (snap.utm_source?.toLowerCase() === "referral") {
    return "referral";
  }
  if (snap.utm_source) {
    return "organic";
  }
  return "unknown";
}

export function mergeAttribution(
  base: AttributionSnapshot,
  incoming: AttributionSnapshot
): AttributionSnapshot {
  const merged = { ...base };
  for (const key of TRACKING_KEYS) {
    if (incoming[key] && !merged[key]) {
      merged[key] = incoming[key];
    }
  }
  return merged;
}

export function appendAttributionToUrl(url: string, snap: AttributionSnapshot) {
  const target = new URL(url, "https://illuminairy.com");
  for (const key of TRACKING_KEYS) {
    const value = snap[key];
    if (value) {
      target.searchParams.set(key, value);
    }
  }
  return `${target.pathname}${target.search}${target.hash}`;
}

export function attributionToTouchColumns(snap: AttributionSnapshot) {
  return {
    utm_source: snap.utm_source ?? null,
    utm_medium: snap.utm_medium ?? null,
    utm_campaign: snap.utm_campaign ?? null,
    utm_term: snap.utm_term ?? null,
    utm_content: snap.utm_content ?? null,
    gclid: snap.gclid ?? null,
    fbclid: snap.fbclid ?? null,
    msclkid: snap.msclkid ?? null
  };
}

/** Read persisted first-touch attribution from sessionStorage (browser only). */
export function readSessionAttribution(): Partial<AttributionSnapshot> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_SESSION_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as AttributionSnapshot;
  } catch {
    return {};
  }
}
