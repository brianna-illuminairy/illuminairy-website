"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useDeferUntilEngagedOrDelayed } from "@/lib/defer-until-engaged-or-delayed";
import { isMarketingDeferPath } from "@/lib/perf-defer-paths";

type DeferredBelowFoldProps = {
  children: ReactNode;
};

/** Footer-only defer on cold paths — trust + hero are SSR in first HTML. */
export function DeferredBelowFold({ children }: DeferredBelowFoldProps) {
  const pathname = usePathname();
  const defer = isMarketingDeferPath(pathname);
  const ready = useDeferUntilEngagedOrDelayed(defer);
  if (defer && !ready) return null;
  return children;
}
