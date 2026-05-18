"use client";

import Script from "next/script";
import { site } from "@/lib/site";

type CalendlyInlineProps = {
  className?: string;
  minHeight?: number;
};

export function CalendlyInline({ className = "", minHeight = 700 }: CalendlyInlineProps) {
  const url = site.calendlyUrl;
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
