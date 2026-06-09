"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { getPostHogKey } from "@/lib/posthog";

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!getPostHogKey() || !pathname) {
      return;
    }
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
  }, [pathname, searchParams]);

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
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}
