"use client";

import { enrichSessionAttributionFromLanding } from "@/lib/attribution";
import { trackLandingView } from "@/lib/landing/analytics";
import { AD3_HD_LANDING_PATH } from "@/lib/plan-builder-b-routes";

let ad3LandingViewTracked = false;

/** Ad3 HD LP funnel entry — call once after analytics bootstrap is ready. */
export function trackAd3LandingViewOnce(): void {
  if (ad3LandingViewTracked) return;
  ad3LandingViewTracked = true;
  enrichSessionAttributionFromLanding(AD3_HD_LANDING_PATH, "tutor");
  trackLandingView("b3a-problem", "compact", AD3_HD_LANDING_PATH, {
    hero_hook: "tutor",
    hero_hook_source: "frozen",
    lp_variant: "variant-beforetutoringmoney-realistic-score",
    traffic_channel: "meta_paid",
    landing_page: AD3_HD_LANDING_PATH,
  });
}
