"use client";

import posthog from "posthog-js";
import { AnalyticsEvents } from "@/lib/analytics-events";
import { getPostHogKey } from "@/lib/posthog";

const GA_MEASUREMENT_ID = "G-B1XC1ND9GT";

export type ShermeenPortalTrackPayload = {
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

function identifyPortalVisitor({ email, isOwnerQa }: Pick<ShermeenPortalTrackPayload, "email" | "isOwnerQa">) {
  const key = getPostHogKey();
  if (!key) {
    return;
  }

  if (isOwnerQa) {
    posthog.identify("brianna-owner-qa", {
      shermeen_portal_owner_qa: true,
      impersonating_email: email
    });
    return;
  }

  posthog.identify(email, {
    shermeen_portal_owner_qa: false
  });
}

function eventProps(payload: ShermeenPortalTrackPayload) {
  return {
    pathname: payload.pathname,
    is_owner_qa: payload.isOwnerQa,
    session_email: payload.email
  };
}

function gaParams(payload: ShermeenPortalTrackPayload) {
  return {
    page_path: payload.pathname,
    is_owner_qa: payload.isOwnerQa,
    session_email: payload.email
  };
}

export function trackShermeenPortalLogin(payload: ShermeenPortalTrackPayload) {
  identifyPortalVisitor(payload);

  const key = getPostHogKey();
  if (key) {
    posthog.capture(AnalyticsEvents.shermeenPortalLogin, eventProps(payload));
  }

  gtagEvent(AnalyticsEvents.shermeenPortalLogin, gaParams(payload));
}

export function trackShermeenPortalPageView(payload: ShermeenPortalTrackPayload) {
  identifyPortalVisitor(payload);

  const key = getPostHogKey();
  if (key) {
    posthog.capture(AnalyticsEvents.shermeenPortalPageView, eventProps(payload));
  }

  gtagEvent(AnalyticsEvents.shermeenPortalPageView, gaParams(payload));

  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("config", GA_MEASUREMENT_ID, {
      user_properties: {
        shermeen_portal_owner_qa: payload.isOwnerQa ? "true" : "false"
      }
    });
  }
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
