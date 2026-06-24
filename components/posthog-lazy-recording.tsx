"use client";

import posthog from "posthog-js";
import { Suspense, useEffect, useRef, type MutableRefObject } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAnalyticsReady } from "@/components/analytics-ready-provider";
import { getPostHogKey } from "@/lib/posthog";
import {
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
  const { defer, ready } = useAnalyticsReady();

  useEffect(() => {
    if (!getPostHogKey()) return;

    if (!defer) {
      startSessionRecordingOnce(startedRef);
      return;
    }

    if (isPlanBuilderBPathname(pathname) && !isPlanBuilderBEntryStep(pathname, step)) {
      startSessionRecordingOnce(startedRef);
      return;
    }

    if (ready) {
      startSessionRecordingOnce(startedRef);
    }
  }, [defer, ready, pathname, step]);

  return null;
}

/** Session replay on cold paths starts when analytics defer gate opens. */
export function PostHogLazySessionRecording() {
  return (
    <Suspense fallback={null}>
      <PostHogLazySessionRecordingInner />
    </Suspense>
  );
}
