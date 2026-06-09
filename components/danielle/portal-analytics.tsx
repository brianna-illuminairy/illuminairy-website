"use client";

import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { trackDaniellePortalPageView } from "@/lib/danielle-portal-analytics";
import type { DaniellePortalRole } from "@/lib/danielle-portal-roles";

type SessionPayload = {
  email: string;
  sessionRole: DaniellePortalRole;
  visitorRole: DaniellePortalRole;
  isOwnerQa: boolean;
};

function DaniellePortalAnalyticsInner() {
  const pathname = usePathname() ?? "";
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname.startsWith("/danielle") || pathname === "/danielle/login") {
      return;
    }

    const trackKey = pathname;
    if (lastTracked.current === trackKey) {
      return;
    }

    let cancelled = false;

    async function track() {
      try {
        const res = await fetch("/api/danielle/session");
        if (!res.ok || cancelled) {
          return;
        }
        const session = (await res.json()) as SessionPayload;
        trackDaniellePortalPageView({
          email: session.email,
          sessionRole: session.sessionRole,
          visitorRole: session.visitorRole,
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

export function DaniellePortalAnalytics() {
  return (
    <Suspense fallback={null}>
      <DaniellePortalAnalyticsInner />
    </Suspense>
  );
}
