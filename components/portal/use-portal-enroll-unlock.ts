"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PortalEnrollTabState } from "@/lib/portal/load-dashboard";
import {
  captureLabPortalEnrollTabViewed,
  captureLabPortalEnrollUnlocked,
} from "@/lib/portal/portal-analytics";

export function usePortalEnrollUnlock(initial: PortalEnrollTabState): PortalEnrollTabState {
  const [clientUnlocked, setClientUnlocked] = useState(false);
  const unlockedFired = useRef(false);
  const viewedFired = useRef(false);

  const locked = initial.locked && !clientUnlocked;

  useEffect(() => {
    if (viewedFired.current || !initial.unlockAt) return;
    viewedFired.current = true;
    captureLabPortalEnrollTabViewed(initial.recommendedPackage);
  }, [initial.unlockAt, initial.recommendedPackage]);

  useEffect(() => {
    if (!initial.unlockAt || !initial.locked) return;

    const unlockMs = new Date(initial.unlockAt).getTime();
    const tick = () => {
      if (Date.now() >= unlockMs) {
        setClientUnlocked(true);
        if (!unlockedFired.current) {
          unlockedFired.current = true;
          captureLabPortalEnrollUnlocked(initial.recommendedPackage);
        }
      }
    };

    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [initial.unlockAt, initial.locked, initial.recommendedPackage]);

  return useMemo(
    () => ({
      ...initial,
      locked,
    }),
    [initial, locked]
  );
}
