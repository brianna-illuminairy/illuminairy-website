"use client";

import { useEffect } from "react";
import { loadAdLpDeferredCss, loadPlanBDeferredCss } from "@/lib/cold-funnel/load-deferred-css";

type ColdFunnelCssRoute = "plan-b" | "ad-lp";

const LOADERS: Record<ColdFunnelCssRoute, () => Promise<unknown>> = {
  "plan-b": loadPlanBDeferredCss,
  "ad-lp": loadAdLpDeferredCss,
};

/** Loads route CSS after idle — critical styles are inlined separately. */
export function DeferredStylesheet({ route }: { route: ColdFunnelCssRoute }) {
  useEffect(() => {
    let cancelled = false;
    const load = LOADERS[route];

    const run = () => {
      if (!cancelled) void load();
    };

    if (typeof requestIdleCallback !== "undefined") {
      const idleId = requestIdleCallback(run, { timeout: 2500 });
      return () => {
        cancelled = true;
        cancelIdleCallback(idleId);
      };
    }

    const timeoutId = window.setTimeout(run, 16);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [route]);

  return null;
}
