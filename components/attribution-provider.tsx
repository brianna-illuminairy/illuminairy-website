"use client";

import { useEffect, useRef } from "react";
import { useAnalyticsReady } from "@/components/analytics-ready-provider";
import { runAttributionCapture } from "@/lib/attribution-visitor";

export function AttributionProvider({ children }: { children: React.ReactNode }) {
  const { defer, ready } = useAnalyticsReady();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    if (defer && !ready) return;
    ran.current = true;
    runAttributionCapture();
  }, [defer, ready]);

  return children;
}

/** @deprecated Use getVisitorIdFromStorage from lib/attribution-visitor */
export { getVisitorIdFromStorage as getVisitorIdFromCookie } from "@/lib/attribution-visitor";

/** @deprecated Use readAttributionPayloadForTouch from lib/attribution-visitor */
export { readAttributionPayloadForTouch as getAttributionPayload } from "@/lib/attribution-visitor";
