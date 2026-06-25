"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

const STORAGE_KEY = "illuminairy_utm_b_v1";
const COOKIE_KEY = "__ill_utm_b";
const COOKIE_MAX_AGE_DAYS = 180;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const;

type UtmKey = (typeof UTM_KEYS)[number];
type UtmPayload = Partial<Record<UtmKey, string>> & { captured_at?: string };

function readUrlUtms(search: string): UtmPayload {
  if (!search) return {};
  const params = new URLSearchParams(search);
  const out: UtmPayload = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value && value.length > 0 && value.length <= 256) {
      out[key] = value;
    }
  }
  return out;
}

function readStoredUtms(): UtmPayload {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as UtmPayload;
  } catch {
    /* corrupt JSON, ignore */
  }
  return {};
}

function writeStoredUtms(payload: UtmPayload) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota/private mode, ignore */
  }
  try {
    const value = encodeURIComponent(JSON.stringify(payload));
    const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
    const isHttps = window.location.protocol === "https:";
    document.cookie = `${COOKIE_KEY}=${value}; Max-Age=${maxAge}; Path=/; SameSite=Lax${
      isHttps ? "; Secure" : ""
    }`;
  } catch {
    /* document.cookie blocked, ignore */
  }
}

export function readPlanBUtms(): UtmPayload {
  return readStoredUtms();
}

export function UtmCapture() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromUrl = readUrlUtms(window.location.search);
    const stored = readStoredUtms();
    const hasUrlUtm = Object.keys(fromUrl).length > 0;
    const merged: UtmPayload = hasUrlUtm
      ? { ...stored, ...fromUrl, captured_at: new Date().toISOString() }
      : stored;
    if (hasUrlUtm) writeStoredUtms(merged);
    if (Object.keys(merged).length > 0) {
      try {
        posthog.register(merged);
      } catch {
        /* posthog not ready, ignore */
      }
    }
  }, []);
  return null;
}
