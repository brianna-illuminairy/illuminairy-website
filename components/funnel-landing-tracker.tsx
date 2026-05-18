"use client";

import { useEffect } from "react";
import { AnalyticsEvents } from "@/lib/analytics-events";
import { trackFunnelEvent } from "@/funnel/lib/track";
import { parseUtmFromSearchParams, persistUtm } from "@/funnel/lib/utm";
import type { FunnelContext } from "@/funnel/lib/campaigns";

export function FunnelLandingTracker({ context }: { context: FunnelContext }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    persistUtm(parseUtmFromSearchParams(params));
    trackFunnelEvent(AnalyticsEvents.funnelLandingView, {
      campaign_id: context.campaignId,
      tone: context.tone,
      fear_id: context.fearId ?? "",
      variant: context.variant,
      attribution_warning: context.attributionWarning ?? false
    });
  }, [context]);

  return null;
}
