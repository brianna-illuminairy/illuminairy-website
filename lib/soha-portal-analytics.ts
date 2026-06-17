"use client";

import posthog from "posthog-js";
import { AnalyticsEvents } from "@/lib/analytics-events";
import { getPostHogKey } from "@/lib/posthog";

const GA_MEASUREMENT_ID = "G-B1XC1ND9GT";

export type SohaPortalTrackPayload = {
  email: string;
  isOwnerQa: boolean;
  pathname: string;
};

function gtagEvent(name: string, params: Record<string, string | boolean>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", name, params);
}

function identifyPortalVisitor({ email, isOwnerQa }: Pick<SohaPortalTrackPayload, "email" | "isOwnerQa">) {
  const key = getPostHogKey();
  if (!key) {
    return;
  }

  if (isOwnerQa) {
    posthog.identify("brianna-owner-qa", {
      soha_portal_owner_qa: true,
      impersonating_email: email
    });
    return;
  }

  posthog.identify(email, {
    soha_portal_owner_qa: false
  });
}

function eventProps(payload: SohaPortalTrackPayload) {
  return {
    pathname: payload.pathname,
    is_owner_qa: payload.isOwnerQa,
    session_email: payload.email
  };
}

function gaParams(payload: SohaPortalTrackPayload) {
  return {
    page_path: payload.pathname,
    is_owner_qa: payload.isOwnerQa,
    session_email: payload.email
  };
}

export function trackSohaPortalLogin(payload: SohaPortalTrackPayload) {
  identifyPortalVisitor(payload);

  const key = getPostHogKey();
  if (key) {
    posthog.capture(AnalyticsEvents.sohaPortalLogin, eventProps(payload));
  }

  gtagEvent(AnalyticsEvents.sohaPortalLogin, gaParams(payload));
}

export function trackSohaPortalPageView(payload: SohaPortalTrackPayload) {
  identifyPortalVisitor(payload);

  const key = getPostHogKey();
  if (key) {
    posthog.capture(AnalyticsEvents.sohaPortalPageView, eventProps(payload));
  }

  gtagEvent(AnalyticsEvents.sohaPortalPageView, gaParams(payload));

  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("config", GA_MEASUREMENT_ID, {
      user_properties: {
        soha_portal_owner_qa: payload.isOwnerQa ? "true" : "false"
      }
    });
  }
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
