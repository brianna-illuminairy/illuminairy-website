import {
  readSessionAttribution,
  type AttributionSnapshot,
  VISITOR_COOKIE,
  VISITOR_STORAGE_KEY
} from "@/lib/attribution";
import { applyLandingAttributionInference } from "@/lib/marketing/landing-attribution-infer";

function readCookie(name: string) {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function readStoredVisitorId() {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(VISITOR_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function getClientAttributionPayload(): {
  visitorId?: string;
  attribution: AttributionSnapshot;
} {
  if (typeof window === "undefined") {
    return { attribution: {} };
  }
  let attribution: AttributionSnapshot = readSessionAttribution();
  attribution = {
    ...attribution,
    landing_page: attribution.landing_page ?? window.location.pathname,
    referrer: attribution.referrer ?? (document.referrer || undefined)
  };
  attribution = applyLandingAttributionInference(attribution);
  return {
    visitorId: readStoredVisitorId() || readCookie(VISITOR_COOKIE) || undefined,
    attribution
  };
}
