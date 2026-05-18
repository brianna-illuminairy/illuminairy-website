"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const FUNNEL_PATH_PREFIXES = ["/go/", "/tools/georgia-list-fit"];

export function isFunnelPath(pathname: string) {
  if (FUNNEL_PATH_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  if (pathname.startsWith("/get-started")) return true;
  return false;
}

export function SiteChrome({
  header,
  footer,
  children
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const funnel = isFunnelPath(pathname);

  if (funnel) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      {children}
      {footer}
    </>
  );
}
