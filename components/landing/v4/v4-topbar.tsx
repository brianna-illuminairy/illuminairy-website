"use client";

import { IlluminairyLogoV7 } from "@/components/brand/illuminairy-logo-v7";
import type { LandingHeroHook } from "@/lib/landing/hero-hooks";
import { parentSmsDisplayPhone, parentSmsHref } from "@/lib/site";
import { v4NavParentRating } from "./v4-content";

type V4TopbarProps = {
  heroHook?: LandingHeroHook;
  onSmsClick?: () => void;
};

function NavStarRating() {
  const rating = v4NavParentRating.numeric;
  const fullStars = Math.floor(rating);
  const partialFill = `${Math.round(v4NavParentRating.partialStarFill * 100)}%`;

  return (
    <div className="lp-topbar-rating" aria-label={`${v4NavParentRating.value} ${v4NavParentRating.label}`}>
      <span className="lp-topbar-stars" aria-hidden="true">
        {Array.from({ length: fullStars }, (_, i) => (
          <span className="lp-topbar-star lp-topbar-star--full" key={`full-${i}`}>
            ★
          </span>
        ))}
        {rating < 5 ? (
          <span
            className="lp-topbar-star lp-topbar-star--partial"
            style={{ ["--star-fill" as string]: partialFill }}
          >
            <span className="lp-topbar-star-empty">★</span>
            <span className="lp-topbar-star-fill">★</span>
          </span>
        ) : null}
      </span>
      <span className="lp-topbar-rating-num">{v4NavParentRating.value}</span>
    </div>
  );
}

export function V4Topbar({ heroHook, onSmsClick }: V4TopbarProps) {
  const smsHref = heroHook === "tutor" ? parentSmsHref() : null;
  const smsPhone = smsHref ? parentSmsDisplayPhone() : null;
  const showSms = Boolean(smsHref && smsPhone);

  return (
    <div className="lp-container lp-topbar lp-topbar--split">
      <IlluminairyLogoV7 tone="on-dark" height={34} />
      <div className="lp-topbar-end">
        <NavStarRating />
        {showSms ? (
          <a href={smsHref!} className="lp-topbar-sms" onClick={onSmsClick}>
            Rising senior? <span className="lp-topbar-sms-em">Text us</span>
            <span className="lp-topbar-sms-num">{smsPhone}</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
