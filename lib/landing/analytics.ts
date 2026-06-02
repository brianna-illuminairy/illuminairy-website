"use client";

import posthog from "posthog-js";
import type { AttributionSnapshot } from "@/lib/attribution";
import { readSessionAttribution } from "@/lib/attribution";
import { AnalyticsEvents } from "@/lib/analytics-events";
import { getPostHogKey } from "@/lib/posthog";
import type { LpVariant } from "@/lib/quiz-funnel/experiments";
import { trackQuizGaEvent } from "@/lib/quiz-funnel/analytics";
import type { LandingSectionId } from "@/lib/landing/content";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export type LandingEventProps = {
  sat_lp_variant: LpVariant;
  section_id?: LandingSectionId;
  cta_label?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  landing_page?: string;
  flag_timeout?: boolean;
};

function readAttribution(): Partial<AttributionSnapshot> {
  return readSessionAttribution();
}

function baseProps(
  variant: LpVariant,
  extra?: Partial<LandingEventProps>
): LandingEventProps {
  const attr = readAttribution();
  return {
    sat_lp_variant: variant,
    landing_page: "/",
    utm_source: attr.utm_source,
    utm_medium: attr.utm_medium,
    utm_campaign: attr.utm_campaign,
    utm_content: attr.utm_content,
    utm_term: attr.utm_term,
    fbclid: attr.fbclid,
    gclid: attr.gclid,
    ...extra
  };
}

export function trackLandingView(
  variant: LpVariant,
  extra?: Partial<LandingEventProps>
) {
  const props = baseProps(variant, extra);
  if (getPostHogKey()) {
    posthog.capture(AnalyticsEvents.funnelLandingView, props);
  }
  trackQuizGaEvent(AnalyticsEvents.funnelLandingView, {
    sat_lp_variant: variant,
    funnel: "sat_quiz",
    landing_page: "/"
  });
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "ViewContent", {
      content_name: "sat_landing",
      content_category: variant
    });
  }
}

export function trackLandingCtaClick(
  variant: LpVariant,
  sectionId: LandingSectionId,
  ctaLabel: string
) {
  const props = baseProps(variant, {
    section_id: sectionId,
    cta_label: ctaLabel
  });
  if (getPostHogKey()) {
    posthog.capture(AnalyticsEvents.funnelCtaClick, props);
  }
  trackQuizGaEvent(AnalyticsEvents.funnelCtaClick, {
    sat_lp_variant: variant,
    section_id: sectionId,
    cta_label: ctaLabel,
    funnel: "sat_quiz"
  });
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", "FunnelCTA", {
      content_name: "sat_landing",
      content_category: variant,
      section_id: sectionId,
      cta_label: ctaLabel
    });
  }
}

/** Read Meta browser cookies for CAPI enrichment on lead/schedule. */
export function readMetaCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === "undefined") return {};
  const match = (name: string) => {
    const row = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${name}=`));
    return row ? decodeURIComponent(row.split("=")[1]) : undefined;
  };
  return { fbp: match("_fbp"), fbc: match("_fbc") };
}
