"use client";

import { landingTrustBar, landingTrustColleges } from "@/lib/landing/trust-colleges";

/** Seamless loop: duplicate the list once in the track. */
const MARQUEE_ITEMS = [...landingTrustColleges, ...landingTrustColleges];

export function CollegeTrustBar() {
  return (
    <section
      className="il-trust-bar"
      aria-labelledby="il-trust-bar-heading"
    >
      <div className="il-premium-container il-trust-bar-inner">
        <p id="il-trust-bar-heading" className="il-trust-bar-title">
          {landingTrustBar.title}
        </p>
        <div className="il-trust-bar-viewport">
          <ul className="il-trust-bar-track" aria-label="Colleges and universities">
            {MARQUEE_ITEMS.map((name, index) => (
              <li
                key={`${name}-${index}`}
                className="il-trust-bar-item"
                aria-hidden={index >= landingTrustColleges.length ? true : undefined}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
        <p className="il-trust-bar-disclaimer">{landingTrustBar.disclaimer}</p>
      </div>
    </section>
  );
}
