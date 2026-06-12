"use client";

import { useSyncExternalStore } from "react";

/**
 * Returns the current wall-clock time as ms-since-epoch, re-rendering at
 * `intervalMs` cadence. Pure for `useMemo` because the value only changes
 * via the subscription, never inside the render itself. Returns `0` on the
 * server so SSR is deterministic.
 */
export function useWallClock(intervalMs = 60_000): number {
  return useSyncExternalStore(
    (callback) => {
      const id = setInterval(callback, intervalMs);
      return () => clearInterval(id);
    },
    () => Date.now(),
    () => 0
  );
}
