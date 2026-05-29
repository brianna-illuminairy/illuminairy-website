"use client";

import { usePathname } from "next/navigation";

export function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMinimalFunnel =
    pathname === "/" ||
    pathname?.startsWith("/quiz") ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/support-policy" ||
    pathname === "/refund-policy";

  if (isMinimalFunnel) {
    return <main className="funnel-main">{children}</main>;
  }

  return <main>{children}</main>;
}
