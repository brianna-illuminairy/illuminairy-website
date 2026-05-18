"use client";

import { useEffect } from "react";
import Script from "next/script";
import { site } from "@/lib/site";

type CalendlyInlineProps = {
  className?: string;
  minHeight?: number;
  /** Override default public consultation URL (e.g. Calendly prefill after intake). */
  bookingUrl?: string;
  /** Fires when the visitor completes a Calendly booking in the embed */
  onEventScheduled?: () => void;
};

export function CalendlyInline({
  className = "",
  minHeight = 700,
  bookingUrl,
  onEventScheduled
}: CalendlyInlineProps) {
  const url = bookingUrl || site.calendlyUrl;

  useEffect(() => {
    if (!onEventScheduled) return;

    function onMessage(e: MessageEvent) {
      if (e.origin !== "https://calendly.com") return;
      const data = e.data as { event?: string };
      if (data?.event === "calendly.event_scheduled") {
        onEventScheduled?.();
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onEventScheduled]);

  if (!url) {
    return null;
  }

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
      <div
        className={`calendly-inline-widget overflow-hidden rounded-2xl border border-line bg-ivory ${className}`}
        data-url={url}
        style={{ minWidth: "320px", height: `${minHeight}px` }}
      />
    </>
  );
}
