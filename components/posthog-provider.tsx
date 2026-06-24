"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useAnalyticsReady } from "@/components/analytics-ready-provider";
import { ensureVisitorId } from "@/lib/attribution-visitor";
import { trackAd3LandingViewOnce } from "@/lib/marketing/ad3-landing-analytics";
import { AD3_HD_LANDING_PATH, isPlanBuilderBPathname } from "@/lib/plan-builder-b-routes";
import { LAB_ANALYTICS_PROPS } from "@/lib/quiz-funnel-b/constants";
import { ensurePostHogInitialized } from "@/lib/posthog/init-client";
import { getPostHogKey } from "@/lib/posthog";

function PostHogInitGate() {
  const pathname = usePathname();
  const { defer, ready } = useAnalyticsReady();

  useEffect(() => {
    if (!getPostHogKey()) return;
    if (defer && !ready) return;
    if (!ensurePostHogInitialized()) return;
    const visitorId = ensureVisitorId();
    posthog.identify(visitorId);
    if (isPlanBuilderBPathname(pathname)) {
      posthog.register(LAB_ANALYTICS_PROPS);
    }
  }, [defer, ready, pathname]);

  return null;
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { defer, ready } = useAnalyticsReady();

  useEffect(() => {
    if (!getPostHogKey() || !pathname) return;
    if (defer && !ready) return;
    if (!ensurePostHogInitialized()) return;
    if (pathname === "/plan" || pathname.startsWith("/plan/")) return;
    if (pathname.startsWith("/danielle")) return;

    let url = window.location.origin + pathname;
    const query = searchParams.toString();
    if (query) url = `${url}?${query}`;
    posthog.capture("$pageview", { $current_url: url });

    if (pathname === AD3_HD_LANDING_PATH) {
      trackAd3LandingViewOnce();
    }
  }, [pathname, searchParams, defer, ready]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const key = getPostHogKey();

  if (!key) {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogInitGate />
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}
