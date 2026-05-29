"use client";

import { FunnelHeaderLogo } from "@/components/funnel-header-logo";

/** Same lockup as quiz (`QFShell`) — on-dark logo on navy hero band. */
export function LandingHeader() {
  return (
    <div className="top-bar il-top-bar">
      <div className="il-logo-wrap">
        <FunnelHeaderLogo />
      </div>
    </div>
  );
}
