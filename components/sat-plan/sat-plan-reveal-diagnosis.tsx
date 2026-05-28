"use client";

import { useEffect, useMemo } from "react";
import { FunnelRevealDiagnosisBody } from "@/components/sat-plan/funnel-reveal-diagnosis-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildRevealDiagnosisCopy } from "@/lib/sat-plan-funnel/final-reveal-copy";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanRevealDiagnosisProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanRevealDiagnosis({ onBack, onContinue }: SatPlanRevealDiagnosisProps) {
  const answers = useSatPlanAnswers();
  const copy = useMemo(() => buildRevealDiagnosisCopy(answers), [answers]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "reveal-diagnosis",
      path: "spine",
      layout: "interstitial"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: "reveal-diagnosis" });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="reveal-diagnosis"
      headline={copy.headline}
      headlineTier="compact"
      bodyVariant="copy"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <FunnelRevealDiagnosisBody copy={copy} />
    </QuizStepTemplate>
  );
}
