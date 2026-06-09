"use client";

import posthog from "posthog-js";
import { AnalyticsEvents } from "@/lib/analytics-events";
import type { DaniellePortalRole } from "@/lib/danielle-portal-roles";
import { getPostHogKey } from "@/lib/posthog";

const GA_MEASUREMENT_ID = "G-B1XC1ND9GT";

export type PortalTrackPayload = {
  email: string;
  sessionRole: DaniellePortalRole;
  visitorRole: DaniellePortalRole;
  isOwnerQa: boolean;
  pathname: string;
};

function gtagEvent(name: string, params: Record<string, string | boolean>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", name, params);
}

function identifyPortalVisitor({
  email,
  sessionRole,
  visitorRole,
  isOwnerQa
}: Pick<PortalTrackPayload, "email" | "sessionRole" | "visitorRole" | "isOwnerQa">) {
  const key = getPostHogKey();
  if (!key) {
    return;
  }

  if (isOwnerQa) {
    posthog.identify("brianna-owner-qa", {
      danielle_portal_role: visitorRole,
      danielle_session_role: sessionRole,
      danielle_owner_qa: true,
      impersonating_email: email
    });
    return;
  }

  posthog.identify(email, {
    danielle_portal_role: visitorRole,
    danielle_session_role: sessionRole,
    danielle_owner_qa: false
  });
}

function eventProps(payload: PortalTrackPayload) {
  return {
    pathname: payload.pathname,
    danielle_portal_role: payload.visitorRole,
    danielle_session_role: payload.sessionRole,
    is_owner_qa: payload.isOwnerQa,
    session_email: payload.email
  };
}

function gaParams(payload: PortalTrackPayload) {
  return {
    page_path: payload.pathname,
    visitor_role: payload.visitorRole,
    session_role: payload.sessionRole,
    is_owner_qa: payload.isOwnerQa,
    session_email: payload.email
  };
}

export function trackDaniellePortalLogin(payload: PortalTrackPayload) {
  identifyPortalVisitor(payload);

  const key = getPostHogKey();
  if (key) {
    posthog.capture(AnalyticsEvents.daniellePortalLogin, eventProps(payload));
  }

  gtagEvent(AnalyticsEvents.daniellePortalLogin, gaParams(payload));
}

export function trackDaniellePortalPageView(payload: PortalTrackPayload) {
  identifyPortalVisitor(payload);

  const key = getPostHogKey();
  if (key) {
    posthog.capture(AnalyticsEvents.daniellePortalPageView, eventProps(payload));
  }

  gtagEvent(AnalyticsEvents.daniellePortalPageView, gaParams(payload));

  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("config", GA_MEASUREMENT_ID, {
      user_properties: {
        danielle_portal_role: payload.visitorRole,
        danielle_session_role: payload.sessionRole,
        danielle_owner_qa: payload.isOwnerQa ? "true" : "false"
      }
    });
  }
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
