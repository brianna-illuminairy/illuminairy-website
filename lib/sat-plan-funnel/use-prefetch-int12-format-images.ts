"use client";

import { useEffect } from "react";
import { int12FormatPanelImageSrcs } from "@/lib/sat-plan-funnel/int12-format-images";

const prefetched = new Set<string>();

/** Warm cache for INT12 panel art before `?step=sat-changed`. */
export function usePrefetchInt12FormatImages(enabled: boolean): void {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    for (const src of int12FormatPanelImageSrcs()) {
      if (prefetched.has(src)) continue;
      prefetched.add(src);

      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    }
  }, [enabled]);
}
