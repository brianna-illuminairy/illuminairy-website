"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import {
  buildCalendlyInlineWidgetOptions,
  calendlyEmbedUrl,
  type CalendlyPrefill,
  type CalendlyUtm
} from "@/lib/calendly-embed";
import { site } from "@/lib/site";

type CalendlyInlineEmbedProps = {
  prefill?: CalendlyPrefill;
  utm?: CalendlyUtm;
  eventUrl?: string;
  className?: string;
  style?: CSSProperties;
};

/** Wait for widget.js (loaded in quiz layout) — handles script arriving before or after mount. */
function waitForCalendly(
  timeoutMs = 15000
): Promise<NonNullable<typeof window.Calendly>> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Calendly embed requires a browser"));
  }
  if (window.Calendly) {
    return Promise.resolve(window.Calendly);
  }

  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = () => {
      if (window.Calendly) {
        resolve(window.Calendly);
        return;
      }
      if (Date.now() - started >= timeoutMs) {
        reject(new Error("Calendly widget.js did not load"));
        return;
      }
      window.setTimeout(tick, 50);
    };
    tick();
  });
}

/**
 * Official Calendly inline embed (widget.js + initInlineWidget).
 * Prefill, UTM, Aurora colors, and auto-resize — not a raw iframe.
 */
export function CalendlyInlineEmbed({
  prefill,
  utm,
  eventUrl = site.calendlyUrl,
  className = "calendly-inline-widget",
  style
}: CalendlyInlineEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initKeyRef = useRef("");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!prefill?.email?.includes("@") || !prefill?.name?.trim()) return;

    const initKey = JSON.stringify({ prefill, utm, eventUrl });
    let cancelled = false;

    void waitForCalendly()
      .then((Calendly) => {
        if (cancelled || !containerRef.current) return;
        if (initKeyRef.current === initKey && el.childElementCount > 0) return;

        el.innerHTML = "";
        Calendly.initInlineWidget(
          buildCalendlyInlineWidgetOptions(containerRef.current, {
            prefill,
            utm,
            eventUrl,
            embedDomain: typeof window !== "undefined" ? window.location.hostname : undefined
          })
        );
        initKeyRef.current = initKey;
      })
      .catch(() => {
        if (cancelled || !containerRef.current) return;
        // Last resort: same URL as widget would use (no customAnswers via URL).
        el.innerHTML = "";
        const iframe = document.createElement("iframe");
        iframe.title = "Schedule a call";
        iframe.src = calendlyEmbedUrl(eventUrl, prefill);
        iframe.style.border = "0";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.minHeight = "620px";
        containerRef.current.appendChild(iframe);
      });

    return () => {
      cancelled = true;
    };
  }, [prefill, utm, eventUrl]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        minWidth: 320,
        width: "100%",
        height: "min(700px, 72dvh)",
        ...style
      }}
    />
  );
}
