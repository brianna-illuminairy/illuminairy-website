"use client";

import { useEffect, useState } from "react";
import { landingShared } from "@/lib/landing/content";

type StickyCtaProps = {
  heroAnchorId: string;
  onStart: () => void;
};

export function StickyCta({ heroAnchorId, onStart }: StickyCtaProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const anchor = document.getElementById(heroAnchorId);
    if (!anchor) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { root: null, threshold: 0, rootMargin: "0px 0px -40% 0px" }
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, [heroAnchorId]);

  if (!visible) return null;

  return (
    <div className="il-sticky-cta" role="region" aria-label="Quick start">
      <button type="button" className="btn il-sticky-cta-btn" onClick={onStart}>
        {landingShared.stickyCtaLabel} <span className="arrow">→</span>
      </button>
    </div>
  );
}
