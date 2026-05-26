"use client";

import { useEffect, useMemo } from "react";
import { Ch3MethodBody } from "@/components/sat-plan/ch3-interstitial-bodies";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildCh3MethodCopy } from "@/lib/sat-plan-funnel/ch3-interstitial-copy";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanCh3MethodProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanCh3Method({ onBack, onContinue }: SatPlanCh3MethodProps) {
  const answers = useSatPlanAnswers();
  const copy = useMemo(() => buildCh3MethodCopy(answers), [answers]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "ch3-method",
      path: "spine",
      layout: "interstitial"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: "ch3-method" });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="ch3-method"
      headline={copy.headline}
      bodyVariant="copy"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <Ch3MethodBody copy={copy} />
    </QuizStepTemplate>
  );
}
