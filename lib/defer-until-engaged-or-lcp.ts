"use client";

import { useEffect, useState } from "react";

/**
 * Returns true immediately when `enabled` is false.
 * When enabled, waits for first user engagement, LCP, or a timeout fallback.
 */
export function useDeferUntilEngagedOrLcp(enabled: boolean): boolean {
  const [ready, setReady] = useState(!enabled);

  useEffect(() => {
    if (!enabled || ready) return;

    let done = false;
    let lcpObserver: PerformanceObserver | undefined;
    let idleId: number | undefined;
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

    if (typeof PerformanceObserver !== "undefined") {
      try {
        lcpObserver = new PerformanceObserver((list) => {
          if (list.getEntries().length > 0) fire();
        });
        lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
      } catch {
        /* unsupported */
      }
    }

    if (typeof requestIdleCallback !== "undefined") {
      idleId = requestIdleCallback(() => fire(), { timeout: 5000 });
    } else {
      timeoutId = window.setTimeout(fire, 5000);
    }

    function cleanup() {
      window.removeEventListener("pointerdown", onEngage, eventOpts);
      window.removeEventListener("keydown", onEngage, eventOpts);
      window.removeEventListener("touchstart", onEngage, eventOpts);
      window.removeEventListener("scroll", onEngage, eventOpts);
      lcpObserver?.disconnect();
      if (idleId != null && typeof cancelIdleCallback !== "undefined") {
        cancelIdleCallback(idleId);
      }
      if (timeoutId != null) {
        window.clearTimeout(timeoutId);
      }
    }

    return cleanup;
  }, [enabled, ready]);

  return ready;
}
