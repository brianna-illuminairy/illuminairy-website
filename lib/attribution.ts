/** First-touch attribution — browser session + cookie helpers. */

import { applyLandingAttributionInference } from "@/lib/marketing/landing-attribution-infer";
import { canonicalizeUtmContent } from "@/lib/marketing/utm-content-aliases";

export const VISITOR_COOKIE = "illuminairy_vid";
export const VISITOR_STORAGE_KEY = "illuminairy_vid";
export const ATTRIBUTION_SESSION_KEY = "illuminairy_attribution";

/** Ad creative revision — e.g. `hd1080` on Meta LP URLs (`?version=`). */
export const ATTRIBUTION_VERSION_PARAM = "version" as const;

/** Works on HTTP LAN dev (crypto.randomUUID needs a secure context). */
export function createVisitorId(): string {
  const c = globalThis.crypto;
  if (typeof c?.randomUUID === "function") {
    try {
      return c.randomUUID();
    } catch {
      /* non-secure origin — fall through */
    }
  }
  if (typeof c?.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    c.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  return `vid-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

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
  /** Resolved on LP load — used to infer ad when utm_content is stripped. */
  hero_hook?: string;
  /** Creative revision from ad URL — e.g. HD video relaunch (`hd1080`). */
  version?: string;
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
const ATTRIBUTION_KEYS = [
  ...TRACKING_KEYS,
  "fbp",
  "fbc",
  "landing_page",
  "hero_hook",
  "version",
  "referrer"
] as const satisfies readonly (keyof AttributionSnapshot)[];

const ATTRIBUTION_MAX_LEN: Record<keyof AttributionSnapshot, number> = {
  utm_source: 120,
  utm_medium: 120,
  utm_campaign: 180,
  utm_term: 180,
  utm_content: 180,
  gclid: 220,
  fbclid: 220,
  msclkid: 220,
  fbp: 220,
  fbc: 220,
  landing_page: 300,
  hero_hook: 80,
  version: 80,
  referrer: 300
};

function sanitizeAttributionValue(
  key: keyof AttributionSnapshot,
  value: unknown
): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const max = ATTRIBUTION_MAX_LEN[key];
  const clipped = trimmed.length > max ? trimmed.slice(0, max) : trimmed;
  if (key === "utm_content") {
    return canonicalizeUtmContent(clipped);
  }
  return clipped;
}

export function sanitizeAttributionSnapshot(
  snap: Partial<AttributionSnapshot>
): AttributionSnapshot {
  const cleaned: AttributionSnapshot = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = sanitizeAttributionValue(key, snap[key]);
    if (value) cleaned[key] = value;
  }
  return cleaned;
}

export function parseAttributionFromSearch(
  search: string
): AttributionSnapshot {
  const params = new URLSearchParams(search);
  const snap: AttributionSnapshot = {};

  for (const key of TRACKING_KEYS) {
    const value = params.get(key);
    if (value) {
      const cleaned = sanitizeAttributionValue(key, value);
      if (cleaned) snap[key] = cleaned;
    }
  }

  const version = params.get(ATTRIBUTION_VERSION_PARAM);
  if (version) {
    const cleaned = sanitizeAttributionValue("version", version);
    if (cleaned) snap.version = cleaned;
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

const CONTEXT_KEYS = ["hero_hook", "landing_page", "version"] as const;

export function mergeAttribution(
  base: AttributionSnapshot,
  incoming: AttributionSnapshot
): AttributionSnapshot {
  const merged = sanitizeAttributionSnapshot(base);
  const cleanedIncoming = sanitizeAttributionSnapshot(incoming);
  for (const key of TRACKING_KEYS) {
    if (cleanedIncoming[key] && !merged[key]) {
      merged[key] = cleanedIncoming[key];
    }
  }
  for (const key of CONTEXT_KEYS) {
    if (cleanedIncoming[key] && !merged[key]) {
      merged[key] = cleanedIncoming[key];
    }
  }
  return merged;
}

export function appendAttributionToUrl(url: string, snap: AttributionSnapshot) {
  const target = new URL(url, "https://illuminairy.com");
  const cleaned = sanitizeAttributionSnapshot(snap);
  for (const key of TRACKING_KEYS) {
    const value = cleaned[key];
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
export function readSessionAttribution(): AttributionSnapshot {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_SESSION_KEY);
    if (!raw) return {};
    return sanitizeAttributionSnapshot(JSON.parse(raw) as AttributionSnapshot);
  } catch {
    return {};
  }
}

/** Session storage only — never mirrors full attribution into cookies. */
export function writeSessionAttribution(snap: AttributionSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      ATTRIBUTION_SESSION_KEY,
      JSON.stringify(sanitizeAttributionSnapshot(snap))
    );
  } catch {
    /* ignore */
  }
}

/** Session + current URL — for analytics before AttributionProvider runs or if sessionStorage is blocked. */
export function readAttributionForAnalytics(): Partial<AttributionSnapshot> {
  if (typeof window === "undefined") return {};
  const fromSession = readSessionAttribution();
  const fromUrl = parseAttributionFromSearch(window.location.search);
  const merged = mergeAttribution(fromSession, fromUrl);
  return applyLandingAttributionInference(merged);
}

/** Persist LP path + hero hook and infer Meta UTMs when URL params are missing. */
export function enrichSessionAttributionFromLanding(
  landingPath: string,
  heroHook?: string
): void {
  if (typeof window === "undefined") return;
  const fromUrl = parseAttributionFromSearch(window.location.search);
  let merged = mergeAttribution(readSessionAttribution(), fromUrl);
  merged = mergeAttribution(merged, {
    landing_page: landingPath,
    hero_hook: heroHook
  });
  merged = applyLandingAttributionInference(merged);
  writeSessionAttribution(merged);
}

export function attributionUtmProps(
  snap: Partial<AttributionSnapshot>
): Pick<
  AttributionSnapshot,
  | "utm_source"
  | "utm_medium"
  | "utm_campaign"
  | "utm_content"
  | "utm_term"
  | "fbclid"
  | "gclid"
  | "landing_page"
  | "hero_hook"
  | "version"
> {
  return {
    utm_source: snap.utm_source,
    utm_medium: snap.utm_medium,
    utm_campaign: snap.utm_campaign,
    utm_content: snap.utm_content,
    utm_term: snap.utm_term,
    fbclid: snap.fbclid,
    gclid: snap.gclid,
    landing_page: snap.landing_page,
    hero_hook: snap.hero_hook,
    version: snap.version
  };
}
