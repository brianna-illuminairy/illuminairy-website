"use client";

import { useEffect, useState } from "react";

/**
 * Below-fold UI only — never keyed off LCP (mounting content on LCP steals LCP).
 * Default: engagement only (scroll/tap). Optional delayMs for non-cold pages.
 */
export function useDeferUntilEngagedOrDelayed(
  enabled: boolean,
  delayMs: number | null = null
): boolean {
  const [ready, setReady] = useState(!enabled);

  useEffect(() => {
    if (!enabled || ready) return;

    let done = false;
    let timeoutId: number | undefined;

    const fire = () => {
      if (done) return;
      done = true;
      setReady(true);
      cleanup();
    };

    const eventOpts: AddEventListenerOptions = { once: true, passive: true, capture: true };
    const onEngage = () => fire();

    window.addEventListener("pointerdown", onEngage, eventOpts);
    window.addEventListener("keydown", onEngage, eventOpts);
    window.addEventListener("touchstart", onEngage, eventOpts);
    window.addEventListener("scroll", onEngage, eventOpts);

    if (delayMs != null && delayMs > 0) {
      timeoutId = window.setTimeout(fire, delayMs);
    }

    function cleanup() {
      window.removeEventListener("pointerdown", onEngage, eventOpts);
      window.removeEventListener("keydown", onEngage, eventOpts);
      window.removeEventListener("touchstart", onEngage, eventOpts);
      window.removeEventListener("scroll", onEngage, eventOpts);
      if (timeoutId != null) {
        window.clearTimeout(timeoutId);
      }
    }

    return cleanup;
  }, [delayMs, enabled, ready]);

  return ready;
}
