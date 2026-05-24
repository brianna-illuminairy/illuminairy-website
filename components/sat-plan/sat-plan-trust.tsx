"use client";

import { useEffect, useMemo } from "react";
import { Int1TrustBody } from "@/components/sat-plan/int1-trust-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildInt1TrustCopy, INT1_TRUST_HEADLINE } from "@/lib/sat-plan-funnel/int1-trust-copy";
import { loadSatPlanState } from "@/lib/sat-plan-funnel/state";

type SatPlanTrustProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanTrust({ onBack, onContinue }: SatPlanTrustProps) {
  const copy = useMemo(() => buildInt1TrustCopy(loadSatPlanState().answers), []);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "trust",
      path: "spine",
      layout: "interstitial"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: "trust" });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="trust"
      headline={INT1_TRUST_HEADLINE}
      bodyVariant="copy"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <Int1TrustBody copy={copy} />
    </QuizStepTemplate>
  );
}
