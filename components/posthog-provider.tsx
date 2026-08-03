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
import { STRATEGY_CALL_ANALYTICS_PROPS } from "@/lib/quiz-funnel/strategy-call-analytics-props";
import { ensurePostHogInitialized } from "@/lib/posthog/init-client";
import { getPostHogKey } from "@/lib/posthog";

function isStrategyCallQuizPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname === "/plan" || pathname.startsWith("/plan/");
}

/** Quiz step routes: step events are SSOT — no $pageview spam on ?step= changes. */
function isQuizStepPathSuppressingPageview(
  pathname: string | null | undefined
): boolean {
  if (!pathname) return false;
  if (isStrategyCallQuizPath(pathname)) return true;
  if (isPlanBuilderBPathname(pathname)) return true;
  if (pathname === "/quiz-b" || pathname.startsWith("/quiz-b/")) return true;
  return false;
}

function PostHogInitGate() {
  const pathname = usePathname();
  const { defer, ready } = useAnalyticsReady();

  useEffect(() => {
    if (!getPostHogKey()) return;
    if (defer && !ready) return;
    if (!ensurePostHogInitialized()) return;
    const visitorId = ensureVisitorId();
    posthog.identify(visitorId);
    if (isPlanBuilderBPathname(pathname) || pathname === "/quiz-b" || pathname?.startsWith("/quiz-b/")) {
      posthog.register(LAB_ANALYTICS_PROPS);
    } else if (isStrategyCallQuizPath(pathname)) {
      posthog.register(STRATEGY_CALL_ANALYTICS_PROPS);
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
    if (isQuizStepPathSuppressingPageview(pathname)) return;
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
