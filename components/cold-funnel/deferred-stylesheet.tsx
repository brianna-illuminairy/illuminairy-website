"use client";

import { useEffect } from "react";
import { loadPlanBDeferredCss } from "@/lib/cold-funnel/load-deferred-css";

/** Loads Plan B funnel CSS after idle — critical styles are inlined separately. */
export function DeferredStylesheet() {
  useEffect(() => {
    let cancelled = false;

    const run = () => {
      if (!cancelled) void loadPlanBDeferredCss();
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
  }, []);

  return null;
}
