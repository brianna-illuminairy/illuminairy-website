"use client";

import { useEffect } from "react";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";

type SatPlanPlanReadyProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanPlanReady({ onBack, onContinue }: SatPlanPlanReadyProps) {
  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "plan-ready",
      path: "spine",
      layout: "interstitial"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: "plan-ready" });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="plan-ready"
      headline="Your plan is ready."
      bodyVariant="copy"
      continueLabel="See my plan"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <div className="quiz-step-int3-content quiz-step-trust-content">
        <p className="quiz-step-copy">
          We mapped your target, timeline, and gaps into a focused SAT prep path — built for how
          your student actually learns.
        </p>
      </div>
    </QuizStepTemplate>
  );
}
