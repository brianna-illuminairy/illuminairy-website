"use client";

import { createContext, useContext, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useDeferUntilEngagedOrLcp } from "@/lib/defer-until-engaged-or-lcp";
import { isMarketingDeferPath } from "@/lib/perf-defer-paths";

type AnalyticsReadyValue = {
  defer: boolean;
  ready: boolean;
};

const AnalyticsReadyContext = createContext<AnalyticsReadyValue>({
  defer: false,
  ready: true,
});

/** Single defer gate for marketing paths — one listener set, stable provider tree. */
export function AnalyticsReadyProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const defer = isMarketingDeferPath(pathname);
  const ready = useDeferUntilEngagedOrLcp(defer);

  return (
    <AnalyticsReadyContext.Provider value={{ defer, ready }}>
      {children}
    </AnalyticsReadyContext.Provider>
  );
}

export function useAnalyticsReady(): AnalyticsReadyValue {
  return useContext(AnalyticsReadyContext);
}
