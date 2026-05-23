"use client";

import { FunnelCta } from "@/components/sat-plan/funnel-cta";
import { ScoreCards } from "@/components/sat-plan/score-cards";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";

type SatPlanLandingProps = {
  onStart: () => void;
};

export function SatPlanLanding({ onStart }: SatPlanLandingProps) {
  const handleStart = () => {
    trackSatPlanFunnelEvent("funnel_cta_click", { step: "landing" });
    trackSatPlanFunnelEvent("assessment_start", { path: "spine" });
    onStart();
  };

  return (
    <div className="page">
      <div className="nav">
        <span className="word">illuminairy</span>
      </div>

      <h1 className="headline">
        High GPA,
        <br />
        <span className="low">low SAT?</span>
      </h1>

      <p className="sub">
        Find out why they&apos;re struggling.
        <br />
        What score improvement is realistic.
        <br />
        And how to fix it before their next test.
        <br />
        <strong className="sub-cred">Backed by College Board data from 250,000+ students.</strong>
      </p>

      <ScoreCards />

      <div className="cta-wrap">
        <FunnelCta label="Get my answers" onClick={handleStart} showArrow />
      </div>

      <p className="micro">Free · 2 minutes · No account needed</p>
    </div>
  );
}
