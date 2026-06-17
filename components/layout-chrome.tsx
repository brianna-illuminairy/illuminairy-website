"use client";

import { usePathname } from "next/navigation";

export function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMinimalFunnel =
    pathname === "/" ||
    pathname === "/sat-plan-builder" ||
    pathname?.startsWith("/plan") ||
    pathname?.startsWith("/quiz") ||
    pathname?.startsWith("/danielle") ||
    pathname?.startsWith("/soha") ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/support-policy" ||
    pathname === "/refund-policy" ||
    pathname === "/contact";

  if (isMinimalFunnel) {
    return <main className="funnel-main">{children}</main>;
  }

  return <main>{children}</main>;
}
