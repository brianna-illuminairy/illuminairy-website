"use client";

import { useEffect } from "react";
import { prefetchCalendlyAvailability } from "@/lib/calendly/availability-prefetch";

const PREFETCH_STEPS = new Set(["v1", "s4", "s7", "reveal", "achievability"]);

/** Warm Calendly slot list before s5 mount. */
export function useQuizAvailabilityPrefetch(stepId: string) {
  useEffect(() => {
    if (!PREFETCH_STEPS.has(stepId)) return;
    void prefetchCalendlyAvailability();
  }, [stepId]);
}
