"use client";

import { useEffect } from "react";
import { loadPlanBDeferredCss } from "@/lib/cold-funnel/load-deferred-css";

type DeferredFunnelStylesheetProps = {
  load?: () => Promise<unknown>;
};

/** Idle-load deep funnel CSS. Never import layout shell/column here. */
export function DeferredFunnelStylesheet({ load = loadPlanBDeferredCss }: DeferredFunnelStylesheetProps) {
  useEffect(() => {
    let cancelled = false;

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
  }, [load]);

  return null;
}

/** @deprecated Use DeferredFunnelStylesheet */
export function DeferredStylesheet() {
  return <DeferredFunnelStylesheet />;
}
