"use client";

import { useEffect, useMemo } from "react";
import { Int12SatChangedBody } from "@/components/sat-plan/int12-sat-changed-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildInt12SatChangedCopy } from "@/lib/sat-plan-funnel/int12-sat-changed-copy";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanSatChangedProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanSatChanged({ onBack, onContinue }: SatPlanSatChangedProps) {
  const answers = useSatPlanAnswers();
  const copy = useMemo(() => buildInt12SatChangedCopy(answers), [answers]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "sat-changed",
      interstitial_id: "int12_digital",
      education_part: "b",
      path: "spine",
      layout: "interstitial"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", {
      step_id: "sat-changed",
      interstitial_id: "int12_digital"
    });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="sat-changed"
      headline={copy.headline}
      bodyVariant="copy"
      continueLabel="Got it"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <Int12SatChangedBody copy={copy} />
    </QuizStepTemplate>
  );
}
