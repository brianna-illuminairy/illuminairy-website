"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { FunnelShell } from "@/funnel/layout/funnel-shell";
import { MagnetFunnelShell } from "@/funnel/layout/magnet-funnel-shell";
import { isFunnelPath } from "@/components/site-chrome";

export function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/go/guide")) {
    return <MagnetFunnelShell>{children}</MagnetFunnelShell>;
  }

  if (isFunnelPath(pathname)) {
    return <FunnelShell>{children}</FunnelShell>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
