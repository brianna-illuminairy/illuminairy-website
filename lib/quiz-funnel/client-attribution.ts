import {
  readSessionAttribution,
  type AttributionSnapshot,
  VISITOR_COOKIE,
  VISITOR_STORAGE_KEY,
} from "@/lib/attribution";
import { applyLandingAttributionInference } from "@/lib/marketing/landing-attribution-infer";
import { readBrowserCookie } from "@/lib/browser-cookies";

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
    visitorId: readStoredVisitorId() || readBrowserCookie(VISITOR_COOKIE) || undefined,
    attribution
  };
}
