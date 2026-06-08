"use client";

import { useEffect, useRef } from "react";
import {
  createVisitorId,
  mergeAttribution,
  parseAttributionFromSearch,
  readSessionAttribution,
  writeSessionAttribution,
  type AttributionSnapshot,
  VISITOR_COOKIE,
  VISITOR_STORAGE_KEY
} from "@/lib/attribution";
import { applyLandingAttributionInference } from "@/lib/marketing/landing-attribution-infer";
import { persistMetaClickIds } from "@/lib/meta-click-ids";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return "";
  }
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function writeCookie(name: string, value: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

function readStoredVisitorId() {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(VISITOR_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function writeStoredVisitorId(value: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VISITOR_STORAGE_KEY, value);
  } catch {
    /* ignore */
  }
}

function ensureVisitorId() {
  let id = readStoredVisitorId() || readCookie(VISITOR_COOKIE);
  if (!id) {
    id = createVisitorId();
  }
  // Storage is primary on mobile; cookie is legacy/back-compat.
  writeStoredVisitorId(id);
  if (!readCookie(VISITOR_COOKIE)) writeCookie(VISITOR_COOKIE, id);
  return id;
}

function loadSessionAttribution(): AttributionSnapshot {
  return readSessionAttribution();
}

function saveSessionAttribution(snap: AttributionSnapshot) {
  writeSessionAttribution(snap);
}

async function sendTouch(
  visitorId: string,
  eventType: string,
  snap: AttributionSnapshot
) {
  const fullUrl = window.location.href;
  await fetch("/api/attribution/touch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      visitorId,
      eventType,
      path: window.location.pathname,
      fullUrl,
      referrer: document.referrer || undefined,
      attribution: snap
    }),
    keepalive: true
  });
}

export function AttributionProvider({ children }: { children: React.ReactNode }) {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) {
      return;
    }
    ran.current = true;

    const visitorId = ensureVisitorId();
    const fromUrl = parseAttributionFromSearch(window.location.search);
    let merged = mergeAttribution(loadSessionAttribution(), {
      ...fromUrl,
      landing_page: window.location.href,
      referrer: document.referrer || undefined
    });

    // Capture Meta click IDs early + persist first-party (Safari/ITP resilience).
    const metaIds = persistMetaClickIds(merged.fbclid);
    if (metaIds.fbp && !merged.fbp) merged.fbp = metaIds.fbp;
    if (metaIds.fbc && !merged.fbc) merged.fbc = metaIds.fbc;

    merged = applyLandingAttributionInference(merged);

    saveSessionAttribution(merged);

    const hasTracking = Boolean(
      merged.utm_source ||
        merged.gclid ||
        merged.fbclid ||
        merged.utm_campaign
    );

    void (async () => {
      if (hasTracking) {
        await sendTouch(visitorId, "attribution_captured", merged);
      }
      await sendTouch(visitorId, "page_view", merged);
    })();
  }, []);

  return children;
}

export function getVisitorIdFromCookie() {
  return readStoredVisitorId() || readCookie(VISITOR_COOKIE);
}

export function getAttributionPayload(): {
  visitorId: string;
  attribution: AttributionSnapshot;
} {
  const visitorId = ensureVisitorId();
  const fromUrl = parseAttributionFromSearch(window.location.search);
  let merged = mergeAttribution(loadSessionAttribution(), fromUrl);
  merged = applyLandingAttributionInference(merged);
  saveSessionAttribution(merged);
  return { visitorId, attribution: merged };
}
