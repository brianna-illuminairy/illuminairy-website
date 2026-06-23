"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useDeferUntilEngagedOrLcp } from "@/lib/defer-until-engaged-or-lcp";
import {
  isMarketingDeferPath,
  shouldLoadKlaviyoNow,
} from "@/lib/perf-defer-paths";
import { GoogleAnalytics } from "@/components/google-analytics";
import { MetaPixel } from "@/components/meta-pixel";
import { KlaviyoScript } from "@/components/klaviyo";

function MarketingScriptsInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const step = searchParams.get("step");
  const deferMarketing = isMarketingDeferPath(pathname);
  const engagedOrLcp = useDeferUntilEngagedOrLcp(deferMarketing);
  const loadGaMeta = !deferMarketing || engagedOrLcp;
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
