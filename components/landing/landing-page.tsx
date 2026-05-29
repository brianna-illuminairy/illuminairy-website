"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { FunnelHeaderLogo } from "@/components/funnel-header-logo";
import { B3Page } from "@/components/landing/b3/b3-page";
import { trackLandingCtaClick, trackLandingView } from "@/lib/landing/analytics";
import { persistLpVariant } from "@/lib/landing/variant-storage";
import type { LandingSectionId } from "@/lib/landing/content";
import { landingShared } from "@/lib/landing/content";
import {
  devOverrideFromSearch,
  LP_VARIANT_FLAG,
  resolveLpVariantFromFlag,
  trackLpExperimentExposure,
  type LpVariant
} from "@/lib/quiz-funnel/experiments";
import { getPostHogKey } from "@/lib/posthog";

const FLAG_TIMEOUT_MS = 2000;

function LandingSkeleton() {
  return (
    <div className="il-skeleton" aria-busy="true">
      <div className="il-skeleton-bar">
        <FunnelHeaderLogo />
      </div>
      <div className="il-skeleton-body" aria-hidden />
    </div>
  );
}

export function LandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [variant, setVariant] = useState<LpVariant | null>(null);
  const [ready, setReady] = useState(false);

  const applyVariant = useCallback(
    (v: LpVariant, opts?: { flag_timeout?: boolean }) => {
      setVariant(v);
      persistLpVariant(v);
      trackLpExperimentExposure(v, opts);
      trackLandingView(v, opts);
      setReady(true);
    },
    []
  );

  useEffect(() => {
    const search = searchParams.toString();
    const devOverride = devOverrideFromSearch(
      search ? `?${search}` : window.location.search
    );
    if (devOverride) {
      applyVariant(devOverride);
      return;
    }

    if (!getPostHogKey()) {
      applyVariant(resolveLpVariantFromFlag());
      return;
    }

    let settled = false;
    const finish = (v: LpVariant, flagTimeout = false) => {
      if (settled) return;
      settled = true;
      applyVariant(v, flagTimeout ? { flag_timeout: true } : undefined);
    };

    const timer = window.setTimeout(
      () => finish(resolveLpVariantFromFlag(), true),
      FLAG_TIMEOUT_MS
    );

    if (posthog.onFeatureFlags) {
      posthog.onFeatureFlags(() => {
        window.clearTimeout(timer);
        finish(resolveLpVariantFromFlag());
      });
    }

    return () => window.clearTimeout(timer);
  }, [applyVariant, searchParams]);

  const handleCta = useCallback(
    (sectionId: LandingSectionId, label?: string) => {
      if (!variant) return;
      const ctaLabel = label ?? landingShared.heroCtaLabel;
      trackLandingCtaClick(variant, sectionId, ctaLabel);
      router.push("/quiz?step=q1");
    },
    [router, variant]
  );

  if (!ready || !variant) {
    return <LandingSkeleton />;
  }

  return <B3Page variant={variant} onCta={handleCta} />;
}

/** Exported for tests — flag key constant */
export { LP_VARIANT_FLAG };
