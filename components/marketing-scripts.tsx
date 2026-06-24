"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAnalyticsReady } from "@/components/analytics-ready-provider";
import { shouldLoadKlaviyoNow } from "@/lib/perf-defer-paths";
import { GoogleAnalytics } from "@/components/google-analytics";
import { MetaPixel } from "@/components/meta-pixel";
import { KlaviyoScript } from "@/components/klaviyo";

function MarketingScriptsInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const step = searchParams.get("step");
  const { defer, ready } = useAnalyticsReady();
  const loadGaMeta = !defer || ready;
  const loadKlaviyo = shouldLoadKlaviyoNow(pathname, step);

  return (
    <>
      {loadGaMeta ? (
        <>
          <GoogleAnalytics />
          <MetaPixel />
        </>
      ) : null}
      {loadKlaviyo ? <KlaviyoScript /> : null}
    </>
  );
}

/** Route-aware GA / Meta / Klaviyo — deferred on ad LP + Plan B until LCP or interaction. */
export function MarketingScripts() {
  return (
    <Suspense fallback={null}>
      <MarketingScriptsInner />
    </Suspense>
  );
}
