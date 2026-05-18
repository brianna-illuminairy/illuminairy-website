"use client";

import { useEffect, useRef } from "react";
import {
  ATTRIBUTION_SESSION_KEY,
  mergeAttribution,
  parseAttributionFromSearch,
  type AttributionSnapshot,
  VISITOR_COOKIE
} from "@/lib/attribution";

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

function ensureVisitorId() {
  let id = readCookie(VISITOR_COOKIE);
  if (!id) {
    id = crypto.randomUUID();
    writeCookie(VISITOR_COOKIE, id);
  }
  return id;
}

function loadSessionAttribution(): AttributionSnapshot {
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_SESSION_KEY);
    if (raw) {
      return JSON.parse(raw) as AttributionSnapshot;
    }
  } catch {
    /* ignore */
  }
  return {};
}

function saveSessionAttribution(snap: AttributionSnapshot) {
  try {
    sessionStorage.setItem(ATTRIBUTION_SESSION_KEY, JSON.stringify(snap));
  } catch {
    /* ignore */
  }
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
    const merged = mergeAttribution(loadSessionAttribution(), {
      ...fromUrl,
      landing_page: window.location.href,
      referrer: document.referrer || undefined
    });

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
  return readCookie(VISITOR_COOKIE);
}

export function getAttributionPayload(): {
  visitorId: string;
  attribution: AttributionSnapshot;
} {
  const visitorId = ensureVisitorId();
  const fromUrl = parseAttributionFromSearch(window.location.search);
  const merged = mergeAttribution(loadSessionAttribution(), fromUrl);
  saveSessionAttribution(merged);
  return { visitorId, attribution: merged };
}
