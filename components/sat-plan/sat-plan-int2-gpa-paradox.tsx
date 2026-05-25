"use client";

import { useEffect, useMemo } from "react";
import { Int2GpaParadoxBody } from "@/components/sat-plan/int2-gpa-paradox-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildInt2GpaParadoxCopy } from "@/lib/sat-plan-funnel/int2-gpa-paradox-copy";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanInt2GpaParadoxProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanInt2GpaParadox({ onBack, onContinue }: SatPlanInt2GpaParadoxProps) {
  const answers = useSatPlanAnswers();
  const copy = useMemo(() => buildInt2GpaParadoxCopy(answers), [answers]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "gpa-paradox",
      path: "spine",
      layout: "interstitial"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: "gpa-paradox" });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="gpa-paradox"
      headline={copy.headline}
      headlineTier="compact"
      bodyVariant="copy"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <Int2GpaParadoxBody copy={copy} />
    </QuizStepTemplate>
  );
}
