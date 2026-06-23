"use client";

import posthog from "posthog-js";
import { LabGa4Events, LabPostHogEvents } from "@/lib/analytics-registry";
import { getPostHogKey } from "@/lib/posthog";
import { LAB_ANALYTICS_PROPS } from "@/lib/quiz-funnel-b/constants";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function portalProps(extra: Record<string, unknown> = {}) {
  return {
    ...LAB_ANALYTICS_PROPS,
    source: "portal_b",
    ...extra,
  };
}

export function captureLabPortalEnrollTabViewed(recommendedPackage: string) {
  const props = portalProps({ recommended_package: recommendedPackage });
  if (getPostHogKey()) {
    posthog.capture(LabPostHogEvents.labPortalEnrollTabViewed, props);
  }
  window.gtag?.("event", LabGa4Events.labPortalEnrollTabViewed, props);
}

export function captureLabPortalEnrollUnlocked(recommendedPackage: string) {
  const props = portalProps({ recommended_package: recommendedPackage });
  if (getPostHogKey()) {
    posthog.capture(LabPostHogEvents.labPortalEnrollUnlocked, props);
  }
  window.gtag?.("event", LabGa4Events.labPortalEnrollUnlocked, props);
}
