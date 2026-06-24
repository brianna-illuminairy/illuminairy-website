"use client";

import { usePathname } from "next/navigation";
import { isPlanBuilderBPathname, PLAN_BUILDER_B_PATH } from "@/lib/plan-builder-b-routes";
import { PLAN_BUILDER_PATH } from "@/lib/plan-builder-routes";

function isPlanBuilderAPathname(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  if (isPlanBuilderBPathname(pathname)) return false;
  return pathname === PLAN_BUILDER_PATH || pathname.startsWith(`${PLAN_BUILDER_PATH}/`);
}

export function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMinimalFunnel =
    pathname === "/" ||
    pathname === "/sat-plan-builder" ||
    isPlanBuilderBPathname(pathname) ||
    isPlanBuilderAPathname(pathname) ||
    pathname?.startsWith("/quiz") ||
    pathname?.startsWith("/danielle") ||
    pathname?.startsWith("/soha") ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/support-policy" ||
    pathname === "/refund-policy" ||
    pathname === "/contact";

  if (isMinimalFunnel) {
    if (pathname === "/sat-plan-builder") {
      return children;
    }
    return <main className="funnel-main">{children}</main>;
  }

  return <main>{children}</main>;
}
