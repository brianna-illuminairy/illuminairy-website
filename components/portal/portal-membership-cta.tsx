"use client";

import Link from "next/link";
import { useEffect } from "react";
import posthog from "posthog-js";
import { LAB_ANALYTICS_PROPS } from "@/lib/quiz-funnel-b/constants";
import { Ga4Events, LabPostHogEvents } from "@/lib/analytics-registry";
import { site } from "@/lib/site";
import { getPostHogKey } from "@/lib/posthog";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

type PortalMembershipCtaProps = {
  showAfterAttended?: boolean;
};

export function PortalMembershipCta({ showAfterAttended = false }: PortalMembershipCtaProps) {
  useEffect(() => {
    if (!showAfterAttended) return;
    const props = {
      ...LAB_ANALYTICS_PROPS,
      weekly_price: site.standardMembershipWeeklyPrice
    };
    if (getPostHogKey()) {
      posthog.capture(LabPostHogEvents.labMembershipOfferViewed, props);
    }
  }, [showAfterAttended]);

  const href = "/portal/enroll";

  function handleClick() {
    const props = {
      ...LAB_ANALYTICS_PROPS,
      weekly_price: site.standardMembershipWeeklyPrice,
      destination: href
    };
    if (getPostHogKey()) {
      posthog.capture(LabPostHogEvents.labMembershipOfferClicked, props);
    }
    window.gtag?.("event", Ga4Events.beginCheckout, {
      funnel: "plan_builder_b",
      weekly_price: site.standardMembershipWeeklyPrice
    });
    if (window.fbq) {
      window.fbq("track", "InitiateCheckout", {
        value: site.standardMembershipWeeklyPrice,
        currency: "USD"
      });
    }
  }

  if (!showAfterAttended) {
    return (
      <p className="aurora-muted" style={{ marginTop: "24px" }}>
        Standard membership: ${site.standardMembershipWeeklyPrice}/week after your free lesson.
        Results vary.
      </p>
    );
  }

  return (
    <div className="aurora-card" style={{ marginTop: "24px", padding: "20px" }}>
      <h2 className="aurora-card-title">Continue with weekly SAT tutoring</h2>
      <p className="aurora-lede" style={{ marginBottom: "16px" }}>
        ${site.standardMembershipWeeklyPrice}/week · mistake-driven tutoring on their weakest skills.
        Results vary.
      </p>
      <Link
        href={href}
        className="aurora-btn aurora-btn--primary"
        onClick={handleClick}
      >
        Start membership
      </Link>
    </div>
  );
}
