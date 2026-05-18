"use client";

import posthog from "posthog-js";
import type { AnalyticsEventName } from "@/lib/analytics-events";

export function captureAnalytics(
  event: AnalyticsEventName,
  properties?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") return;
  try {
    posthog.capture(event, properties);
  } catch {
    // Analytics must not block UX
  }
}
