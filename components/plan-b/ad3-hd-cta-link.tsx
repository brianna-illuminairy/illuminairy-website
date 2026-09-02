"use client";

import Link from "next/link";
import { trackLandingCtaClick } from "@/lib/landing/analytics";
import { AD3_HD_CTA } from "@/lib/plan-b/ad3-hd-landing-copy";
import { AD3_HD_LANDING_PATH } from "@/lib/plan-builder-b-routes";

type Ad3HdCtaLinkProps = {
  ctaHref: string;
};

/** Hero CTA — fires `funnel_cta_click` before navigating to `/plan-b`. */
export function Ad3HdCtaLink({ ctaHref }: Ad3HdCtaLinkProps) {
  return (
    <Link
      href={ctaHref}
      className="lp-btn"
      onClick={() => {
        trackLandingCtaClick(
          "b3a-problem",
          "compact",
          AD3_HD_LANDING_PATH,
          "hero",
          AD3_HD_CTA.button,
          {
            hero_hook: "tutor",
            hero_hook_source: "frozen",
            lp_variant: "variant-beforetutoringmoney-realistic-score",
            traffic_channel: "meta_paid",
            landing_page: AD3_HD_LANDING_PATH,
          }
        );
      }}
    >
      {AD3_HD_CTA.button} <span className="arrow">→</span>
    </Link>
  );
}
