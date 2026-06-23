"use client";

import posthog from "posthog-js";
import { Suspense, useEffect, useRef, type MutableRefObject } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getPostHogKey } from "@/lib/posthog";
import {
  isMarketingDeferPath,
  isPlanBuilderBEntryStep,
  isPlanBuilderBPathname,
} from "@/lib/perf-defer-paths";

function startSessionRecordingOnce(startedRef: MutableRefObject<boolean>) {
  if (startedRef.current) return;
  startedRef.current = true;
  if (typeof posthog.startSessionRecording === "function") {
    posthog.startSessionRecording();
  }
}

function PostHogLazySessionRecordingInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const step = searchParams.get("step");
  const startedRef = useRef(false);

  useEffect(() => {
    if (!getPostHogKey()) return;

    const deferPath = isMarketingDeferPath(pathname);
    if (!deferPath) {
      startSessionRecordingOnce(startedRef);
      return;
    }

    if (isPlanBuilderBPathname(pathname) && !isPlanBuilderBEntryStep(pathname, step)) {
      startSessionRecordingOnce(startedRef);
      return;
    }

    let done = false;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const fire = () => {
      if (done) return;
      done = true;
      startSessionRecordingOnce(startedRef);
      cleanup();
    };

    const onScroll = () => {
      if (window.scrollY > 80) fire();
    };

    const engageOpts: AddEventListenerOptions = { once: true, passive: true, capture: true };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", fire, engageOpts);
    window.addEventListener("keydown", fire, engageOpts);
    window.addEventListener("touchstart", fire, engageOpts);

    if (typeof requestIdleCallback !== "undefined") {
      idleId = requestIdleCallback(() => fire(), { timeout: 8000 });
    } else {
      timeoutId = window.setTimeout(fire, 8000);
    }

    function cleanup() {
      window.removeEventListener("scroll", onScroll);
      if (idleId != null && typeof cancelIdleCallback !== "undefined") {
        cancelIdleCallback(idleId);
      }
      if (timeoutId != null) {
        window.clearTimeout(timeoutId);
      }
    }

    return cleanup;
  }, [pathname, step]);

  return null;
}

/** Session replay starts after scroll or interaction on ad LP / Plan B step 1. */
export function PostHogLazySessionRecording() {
  return (
    <Suspense fallback={null}>
      <PostHogLazySessionRecordingInner />
    </Suspense>
  );
}
