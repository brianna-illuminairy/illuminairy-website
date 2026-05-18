"use client";

import { captureAnalytics } from "@/lib/analytics-capture";
import type { AnalyticsEventName } from "@/lib/analytics-events";
import { utmForAnalytics } from "@/funnel/lib/utm";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackFunnelEvent(
  event: AnalyticsEventName,
  properties?: Record<string, string | number | boolean>
) {
  const merged = { ...utmForAnalytics(), ...properties };
  captureAnalytics(event, merged);

  if (
    event === "intake_completed" &&
    properties?.qualified !== false &&
    typeof window !== "undefined"
  ) {
    try {
      window.gtag?.("event", "generate_lead", {
        event_category: "funnel",
        ...merged
      });
    } catch {
      // Analytics must not block UX
    }
  }
}
