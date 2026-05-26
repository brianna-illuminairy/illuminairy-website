"use client";

import { useEffect, useMemo } from "react";
import { FunnelRevealStakesBody } from "@/components/sat-plan/funnel-reveal-stakes-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildRevealStakesCopy } from "@/lib/sat-plan-funnel/final-reveal-copy";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanRevealStakesProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanRevealStakes({ onBack, onContinue }: SatPlanRevealStakesProps) {
  const answers = useSatPlanAnswers();
  const copy = useMemo(() => buildRevealStakesCopy(answers), [answers]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "reveal-stakes",
      path: "spine",
      layout: "interstitial"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: "reveal-stakes" });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="reveal-stakes"
      headline={copy.headline}
      bodyVariant="copy"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <FunnelRevealStakesBody copy={copy} />
    </QuizStepTemplate>
  );
}
