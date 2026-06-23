"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useDeferUntilEngagedOrLcp } from "@/lib/defer-until-engaged-or-lcp";
import { isPlanBuilderBPathname } from "@/lib/plan-builder-b-routes";
import { isMarketingDeferPath } from "@/lib/perf-defer-paths";
import { LAB_ANALYTICS_PROPS } from "@/lib/quiz-funnel-b/constants";
import { ensurePostHogInitialized } from "@/lib/posthog/init-client";
import { getPostHogKey } from "@/lib/posthog";

function PostHogInitGate() {
  const pathname = usePathname();
  const defer = isMarketingDeferPath(pathname);
  const ready = useDeferUntilEngagedOrLcp(defer);

  useEffect(() => {
    if (!getPostHogKey()) return;
    if (!defer || ready) {
      ensurePostHogInitialized();
      if (isPlanBuilderBPathname(pathname)) {
        posthog.register(LAB_ANALYTICS_PROPS);
      }
    }
  }, [defer, ready, pathname]);

  return null;
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defer = isMarketingDeferPath(pathname);
  const ready = useDeferUntilEngagedOrLcp(defer);

  useEffect(() => {
    if (!getPostHogKey() || !pathname) {
      return;
    }
    if (defer && !ready) return;
    if (!ensurePostHogInitialized()) return;
    if (pathname === "/plan" || pathname.startsWith("/plan/")) {
      return;
    }
    if (pathname.startsWith("/danielle")) {
      return;
    }
    let url = window.location.origin + pathname;
    const query = searchParams.toString();
    if (query) {
      url = `${url}?${query}`;
    }
    posthog.capture("$pageview", { $current_url: url });
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
