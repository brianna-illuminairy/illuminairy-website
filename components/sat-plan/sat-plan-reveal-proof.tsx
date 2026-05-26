"use client";

import { useEffect, useMemo } from "react";
import { FunnelRevealProofBody } from "@/components/sat-plan/funnel-reveal-proof-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildRevealProofCopy } from "@/lib/sat-plan-funnel/final-reveal-copy";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanRevealProofProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanRevealProof({ onBack, onContinue }: SatPlanRevealProofProps) {
  const answers = useSatPlanAnswers();
  const copy = useMemo(() => buildRevealProofCopy(answers), [answers]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "reveal-proof",
      path: "spine",
      layout: "interstitial"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: "reveal-proof" });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="reveal-proof"
      headline={copy.headline}
      bodyVariant="copy"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <FunnelRevealProofBody copy={copy} />
    </QuizStepTemplate>
  );
}
