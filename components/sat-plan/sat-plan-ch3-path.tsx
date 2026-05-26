"use client";

import { useEffect, useMemo } from "react";
import { Ch3PathBody } from "@/components/sat-plan/ch3-interstitial-bodies";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildCh3PathCopy } from "@/lib/sat-plan-funnel/ch3-interstitial-copy";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanCh3PathProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanCh3Path({ onBack, onContinue }: SatPlanCh3PathProps) {
  const answers = useSatPlanAnswers();
  const copy = useMemo(() => buildCh3PathCopy(answers), [answers]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "ch3-path",
      path: "spine",
      layout: "interstitial"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: "ch3-path" });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="ch3-path"
      headline={copy.headline}
      bodyVariant="copy"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <Ch3PathBody copy={copy} />
    </QuizStepTemplate>
  );
}
