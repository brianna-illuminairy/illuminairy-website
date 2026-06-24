/** Visitor ID + attribution payload — browser SSOT (no React). */

import {
  createVisitorId,
  mergeAttribution,
  parseAttributionFromSearch,
  readSessionAttribution,
  writeSessionAttribution,
  type AttributionSnapshot,
  VISITOR_COOKIE,
  VISITOR_STORAGE_KEY,
} from "@/lib/attribution";
import { applyLandingAttributionInference } from "@/lib/marketing/landing-attribution-infer";
import { persistMetaClickIds } from "@/lib/meta-click-ids";
import { readBrowserCookie, writeBrowserCookie } from "@/lib/browser-cookies";

function readStoredVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(VISITOR_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function writeStoredVisitorId(value: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VISITOR_STORAGE_KEY, value);
  } catch {
    /* ignore */
  }
}

/** Create or read the cross-session visitor id (localStorage primary, cookie back-compat). */
export function ensureVisitorId(): string {
  let id = readStoredVisitorId() || readBrowserCookie(VISITOR_COOKIE);
  if (!id) {
    id = createVisitorId();
  }
  writeStoredVisitorId(id);
  if (!readBrowserCookie(VISITOR_COOKIE)) {
    writeBrowserCookie(VISITOR_COOKIE, id);
  }
  return id;
}

export function getVisitorIdFromStorage(): string {
  return readStoredVisitorId() || readBrowserCookie(VISITOR_COOKIE);
}

/** Read-only merge for CRM touches — does not mutate session storage. */
export function readAttributionPayloadForTouch(): {
  visitorId: string;
  attribution: AttributionSnapshot;
} {
  const visitorId = ensureVisitorId();
  const fromUrl = parseAttributionFromSearch(window.location.search);
  let merged = mergeAttribution(readSessionAttribution(), fromUrl);
  merged = applyLandingAttributionInference(merged);
  return { visitorId, attribution: merged };
}

async function sendTouch(visitorId: string, eventType: string, snap: AttributionSnapshot): Promise<void> {
  await fetch("/api/attribution/touch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      visitorId,
      eventType,
      path: window.location.pathname,
      fullUrl: window.location.href,
      referrer: document.referrer || undefined,
      attribution: snap,
    }),
    keepalive: true,
  });
}

/** First-touch capture — runs once per app mount when analytics is ready. */
export function runAttributionCapture(): void {
  const visitorId = ensureVisitorId();
  const fromUrl = parseAttributionFromSearch(window.location.search);
  let merged = mergeAttribution(readSessionAttribution(), {
    ...fromUrl,
    landing_page: window.location.pathname,
    referrer: document.referrer || undefined,
  });

  const metaIds = persistMetaClickIds(merged.fbclid);
  if (metaIds.fbp && !merged.fbp) merged.fbp = metaIds.fbp;
  if (metaIds.fbc && !merged.fbc) merged.fbc = metaIds.fbc;

  merged = applyLandingAttributionInference(merged);
  writeSessionAttribution(merged);

  const hasTracking = Boolean(
    merged.utm_source || merged.gclid || merged.fbclid || merged.utm_campaign
  );

  void (async () => {
    if (hasTracking) {
      await sendTouch(visitorId, "attribution_captured", merged);
    }
    await sendTouch(visitorId, "page_view", merged);
  })();
}
