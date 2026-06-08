import {
  readSessionAttribution,
  type AttributionSnapshot,
  VISITOR_COOKIE
} from "@/lib/attribution";
import { applyLandingAttributionInference } from "@/lib/marketing/landing-attribution-infer";

function readCookie(name: string) {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
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
    visitorId: readCookie(VISITOR_COOKIE) || undefined,
    attribution
  };
}
