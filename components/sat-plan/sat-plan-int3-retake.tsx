"use client";

import { useEffect, useMemo } from "react";
import { Int3RetakeBody } from "@/components/sat-plan/int3-retake-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildInt3RetakeCopy } from "@/lib/sat-plan-funnel/int3-retake-copy";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanInt3RetakeProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanInt3Retake({ onBack, onContinue }: SatPlanInt3RetakeProps) {
  const answers = useSatPlanAnswers();
  const copy = useMemo(() => buildInt3RetakeCopy(answers), [answers]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "int3-retake",
      path: "spine",
      layout: "interstitial"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: "int3-retake" });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="int3-retake"
      headline={copy.headline}
      bodyVariant="copy"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <Int3RetakeBody copy={copy} />
    </QuizStepTemplate>
  );
}
