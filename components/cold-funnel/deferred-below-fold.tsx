"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useDeferUntilEngagedOrDelayed } from "@/lib/defer-until-engaged-or-delayed";
import { isMarketingDeferPath } from "@/lib/perf-defer-paths";

type DeferredBelowFoldProps = {
  children: ReactNode;
  /** When true, always defer until engagement or delay (e.g. trust bar on ad LP). */
  force?: boolean;
};

/** Renders below-the-fold UI after engagement or delay — never on LCP (that would steal LCP). */
export function DeferredBelowFold({ children, force = false }: DeferredBelowFoldProps) {
  const pathname = usePathname();
  const defer = force || isMarketingDeferPath(pathname);
  const ready = useDeferUntilEngagedOrDelayed(defer);
  if (defer && !ready) return null;
  return children;
}
