"use client";

import { useEffect } from "react";
import { AnalyticsEvents } from "@/lib/analytics-events";
import { trackFunnelEvent } from "@/funnel/lib/track";
import type { MagnetFunnelContext } from "@/funnel/lib/magnet-funnel";
import { parseUtmFromSearchParams, persistUtm } from "@/funnel/lib/utm";

export function MagnetFunnelTracker({ context }: { context: MagnetFunnelContext }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    persistUtm(parseUtmFromSearchParams(params));
    trackFunnelEvent(AnalyticsEvents.funnelLandingView, {
      funnel_type: "lead_magnet",
      lead_magnet_slug: context.magnetSlug,
      campaign_id: context.campaignId,
      tone: context.tone,
      fear_id: context.fearId ?? "",
      variant: context.variant,
      attribution_warning: context.attributionWarning ?? false
    });
  }, [context]);

  return null;
}
