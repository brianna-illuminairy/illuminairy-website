import {
  ATTRIBUTION_SESSION_KEY,
  VISITOR_COOKIE,
  type AttributionSnapshot
} from "@/lib/attribution";

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
  let attribution: AttributionSnapshot = {};
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_SESSION_KEY);
    if (raw) attribution = JSON.parse(raw) as AttributionSnapshot;
  } catch {
    /* ignore */
  }
  return {
    visitorId: readCookie(VISITOR_COOKIE) || undefined,
    attribution: {
      ...attribution,
      landing_page: attribution.landing_page ?? window.location.pathname,
      referrer: attribution.referrer ?? (document.referrer || undefined)
    }
  };
}
