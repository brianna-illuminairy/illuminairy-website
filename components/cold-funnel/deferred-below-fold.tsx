"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useDeferUntilEngagedOrLcp } from "@/lib/defer-until-engaged-or-lcp";
import { isMarketingDeferPath } from "@/lib/perf-defer-paths";

type DeferredBelowFoldProps = {
  children: ReactNode;
  /** When true, always defer until engagement/LCP (e.g. trust bar on ad LP). */
  force?: boolean;
};

/** Renders below-the-fold UI after LCP or first interaction on cold funnel paths. */
export function DeferredBelowFold({ children, force = false }: DeferredBelowFoldProps) {
  const pathname = usePathname();
  const defer = force || isMarketingDeferPath(pathname);
  const ready = useDeferUntilEngagedOrLcp(defer);
  if (defer && !ready) return null;
  return children;
}
