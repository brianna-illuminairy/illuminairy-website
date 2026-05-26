"use client";

import { useEffect, useMemo } from "react";
import { Ch3PreviewBody } from "@/components/sat-plan/ch3-interstitial-bodies";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildCh3PreviewCopy } from "@/lib/sat-plan-funnel/ch3-interstitial-copy";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanCh3PreviewProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanCh3Preview({ onBack, onContinue }: SatPlanCh3PreviewProps) {
  const answers = useSatPlanAnswers();
  const copy = useMemo(() => buildCh3PreviewCopy(answers), [answers]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "ch3-preview",
      path: "spine",
      layout: "interstitial"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: "ch3-preview" });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="ch3-preview"
      headline={copy.headline}
      bodyVariant="copy"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <Ch3PreviewBody copy={copy} />
    </QuizStepTemplate>
  );
}
