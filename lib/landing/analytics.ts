"use client";

import posthog from "posthog-js";
import {
  registerPostHogAttribution
} from "@/lib/analytics-attribution";
import {
  mergeAttribution,
  readSessionAttribution,
  type AttributionSnapshot,
  attributionUtmProps,
  readAttributionForAnalytics,
  writeSessionAttribution
} from "@/lib/attribution";
import { recordClientTouch } from "@/lib/analytics-touch-client";
import { AnalyticsEvents } from "@/lib/analytics-events";
import { TouchEvents } from "@/lib/analytics-registry";
import { getPostHogKey } from "@/lib/posthog";
import type { LpVariant } from "@/lib/quiz-funnel/experiments";
import type { LpLayout } from "@/lib/quiz-funnel/experiments-layout";
import { trackQuizGaEvent } from "@/lib/quiz-funnel/analytics";
import type { LandingSectionId } from "@/lib/landing/content";
import { AD3_HD_LANDING_PATH } from "@/lib/plan-builder-b-routes";
import { LAB_ANALYTICS_PROPS } from "@/lib/quiz-funnel-b/constants";
import { STRATEGY_CALL_ANALYTICS_PROPS } from "@/lib/quiz-funnel/strategy-call-analytics-props";

/** GA4/PostHog funnel tags by landing page (Strategy Call vs free lesson). */
function landingOfferProps(landingPath: string) {
  if (
    landingPath === AD3_HD_LANDING_PATH ||
    landingPath.startsWith(`${AD3_HD_LANDING_PATH}/`)
  ) {
    return {
      funnel: LAB_ANALYTICS_PROPS.funnel_id,
      funnel_id: LAB_ANALYTICS_PROPS.funnel_id,
      offer_goal: LAB_ANALYTICS_PROPS.offer_goal,
    };
  }
  return {
    funnel: STRATEGY_CALL_ANALYTICS_PROPS.funnel_id,
    funnel_id: STRATEGY_CALL_ANALYTICS_PROPS.funnel_id,
    offer_goal: STRATEGY_CALL_ANALYTICS_PROPS.offer_goal,
  };
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export type LandingEventProps = {
  sat_lp_variant: LpVariant;
  sat_lp_layout: LpLayout;
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
  traffic_channel?: "meta_paid" | "other";
  preferred_metro?: string | null;
  metro_source?: string;
  hero_hook?: string;
  hero_hook_source?: string;
  lp_variant?: string;
};

function baseProps(
  variant: LpVariant,
  layout: LpLayout,
  landingPath: string,
  extra?: Partial<LandingEventProps>
): LandingEventProps {
  const attr = readAttributionForAnalytics();
  return {
    sat_lp_variant: variant,
    sat_lp_layout: layout,
    landing_page: landingPath,
    ...attributionUtmProps(attr),
    ...extra
  };
}

function landingAttributionSnapshot(
  props: LandingEventProps
): Partial<AttributionSnapshot> {
  return {
    utm_source: props.utm_source,
    utm_medium: props.utm_medium,
    utm_campaign: props.utm_campaign,
    utm_content: props.utm_content,
    utm_term: props.utm_term,
    fbclid: props.fbclid,
    gclid: props.gclid,
    landing_page: props.landing_page,
    hero_hook: props.hero_hook
  };
}

/**
 * Keep first-touch attribution stable for downstream funnel events.
 * Landing context wins only when the session is missing that value.
 */
function persistLandingAttribution(props: LandingEventProps): void {
  const merged = mergeAttribution(
    readSessionAttribution(),
    landingAttributionSnapshot(props) as AttributionSnapshot
  );
  writeSessionAttribution(merged);
  registerPostHogAttribution(merged);
}

function analyticsEventProps(
  props: LandingEventProps
): Record<string, string | number | boolean | undefined> {
  return {
    ...props,
    preferred_metro: props.preferred_metro ?? undefined
  };
}

export function trackLandingView(
  variant: LpVariant,
  layout: LpLayout,
  landingPath: string,
  extra?: Partial<LandingEventProps>
) {
  const props = baseProps(variant, layout, landingPath, extra);
  const analyticsProps = analyticsEventProps(props);
  const offer = landingOfferProps(landingPath);
  persistLandingAttribution(props);
  if (getPostHogKey()) {
    posthog.capture(AnalyticsEvents.funnelLandingView, { ...props, ...offer });
  }
  trackQuizGaEvent(AnalyticsEvents.funnelLandingView, {
    ...analyticsProps,
    ...offer,
  });
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "ViewContent", {
      content_name: "sat_landing",
      content_category: variant,
      sat_lp_layout: layout
    });
  }
}

export function trackLandingCtaClick(
  variant: LpVariant,
  layout: LpLayout,
  landingPath: string,
  sectionId: LandingSectionId,
  ctaLabel: string,
  extra?: Partial<LandingEventProps>
) {
  const props = baseProps(variant, layout, landingPath, {
    section_id: sectionId,
    cta_label: ctaLabel,
    ...extra
  });
  const analyticsProps = analyticsEventProps(props);
  const offer = landingOfferProps(landingPath);
  persistLandingAttribution(props);
  if (getPostHogKey()) {
    posthog.capture(AnalyticsEvents.funnelCtaClick, { ...props, ...offer });
  }
  recordClientTouch(TouchEvents.funnelCtaClick, {
    ...analyticsProps,
    ...offer,
  });
  trackQuizGaEvent(AnalyticsEvents.funnelCtaClick, {
    ...analyticsProps,
    ...offer,
  });
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", "FunnelCTA", {
      content_name: "sat_landing",
      content_category: variant,
      sat_lp_layout: layout,
      section_id: sectionId,
      cta_label: ctaLabel
    });
  }
}

export function trackLandingSmsClick(
  variant: LpVariant,
  layout: LpLayout,
  landingPath: string,
  extra?: Partial<LandingEventProps>
) {
  const props = baseProps(variant, layout, landingPath, {
    section_id: "nav",
    cta_label: "Text us",
    ...extra
  });
  const analyticsProps = analyticsEventProps(props);
  const offer = landingOfferProps(landingPath);
  if (getPostHogKey()) {
    posthog.capture(AnalyticsEvents.funnelLpSmsClick, { ...props, ...offer });
  }
  recordClientTouch(TouchEvents.funnelLpSmsClick, {
    ...analyticsProps,
    ...offer,
  });
  trackQuizGaEvent(AnalyticsEvents.funnelLpSmsClick, {
    ...analyticsProps,
    ...offer,
  });
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
