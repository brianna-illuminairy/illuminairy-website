"use client";

import posthog from "posthog-js";
import {
  attributionUtmProps,
  readAttributionForAnalytics,
  type AttributionSnapshot
} from "@/lib/attribution";
import { getPostHogKey } from "@/lib/posthog";

/** Stick UTMs on the PostHog session so every subsequent event inherits them. */
export function registerPostHogAttribution(
  attr?: Partial<AttributionSnapshot>
) {
  if (!getPostHogKey()) return;
  const snap = attr ?? readAttributionForAnalytics();
  const props = attributionUtmProps(snap);
  const register: Record<string, string> = {};
  for (const [key, value] of Object.entries(props)) {
    if (value) register[key] = value;
  }
  if (Object.keys(register).length > 0) {
    posthog.register(register);
  }
}

/** Read session + URL UTMs, register on PostHog, return props for event payloads. */
export function analyticsAttributionProps(): ReturnType<
  typeof attributionUtmProps
> {
  const attr = readAttributionForAnalytics();
  registerPostHogAttribution(attr);
  return attributionUtmProps(attr);
}
