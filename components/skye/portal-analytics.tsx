"use client";

import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { trackSkyePortalPageView } from "@/lib/skye-portal-analytics";

type SessionPayload = {
  email: string;
  isOwnerQa: boolean;
};

function SkyePortalAnalyticsInner() {
  const pathname = usePathname() ?? "";
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname.startsWith("/skye") || pathname === "/skye/login") {
      return;
    }

    const trackKey = pathname;
    if (lastTracked.current === trackKey) {
      return;
    }

    let cancelled = false;

    async function track() {
      try {
        const res = await fetch("/api/skye/session");
        if (!res.ok || cancelled) {
          return;
        }
        const session = (await res.json()) as SessionPayload;
        trackSkyePortalPageView({
          email: session.email,
          isOwnerQa: session.isOwnerQa,
          pathname
        });
        if (!cancelled) {
          lastTracked.current = trackKey;
        }
      } catch {
        // Analytics should not block the portal.
      }
    }

    void track();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}

export function SkyePortalAnalytics() {
  return (
    <Suspense fallback={null}>
      <SkyePortalAnalyticsInner />
    </Suspense>
  );
}
