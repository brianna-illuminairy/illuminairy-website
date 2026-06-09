"use client";

import posthog from "posthog-js";
import { AnalyticsEvents } from "@/lib/analytics-events";
import type { DaniellePortalRole } from "@/lib/danielle-portal-roles";
import { getPostHogKey } from "@/lib/posthog";

const GA_MEASUREMENT_ID = "G-B1XC1ND9GT";

type PortalTrackPayload = {
  email: string;
  role: DaniellePortalRole;
  pathname: string;
};

function gtagEvent(name: string, params: Record<string, string>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", name, params);
}

function identifyPortalVisitor(email: string, role: DaniellePortalRole) {
  const key = getPostHogKey();
  if (key) {
    posthog.identify(email, { danielle_portal_role: role });
  }
}

export function trackDaniellePortalLogin({ email, role, pathname }: PortalTrackPayload) {
  identifyPortalVisitor(email, role);

  const key = getPostHogKey();
  if (key) {
    posthog.capture(AnalyticsEvents.daniellePortalLogin, {
      pathname,
      danielle_portal_role: role
    });
  }

  gtagEvent(AnalyticsEvents.daniellePortalLogin, {
    page_path: pathname,
    visitor_role: role
  });
}

export function trackDaniellePortalPageView({ email, role, pathname }: PortalTrackPayload) {
  identifyPortalVisitor(email, role);

  const key = getPostHogKey();
  if (key) {
    posthog.capture(AnalyticsEvents.daniellePortalPageView, {
      pathname,
      danielle_portal_role: role
    });
  }

  gtagEvent(AnalyticsEvents.daniellePortalPageView, {
    page_path: pathname,
    visitor_role: role
  });

  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("config", GA_MEASUREMENT_ID, {
      user_properties: { danielle_portal_role: role }
    });
  }
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
