"use client";

import { useEffect, useMemo } from "react";
import { Int6PlanPathBody } from "@/components/sat-plan/int6-plan-path-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildInt6PlanPathCopy } from "@/lib/sat-plan-funnel/int6-plan-path-copy";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanPlanPathProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanPlanPath({ onBack, onContinue }: SatPlanPlanPathProps) {
  const answers = useSatPlanAnswers();
  const copy = useMemo(() => buildInt6PlanPathCopy(answers), [answers]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "plan-path",
      path: "spine",
      layout: "interstitial"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: "plan-path" });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="plan-path"
      headline="Your score path"
      bodyVariant="copy"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <Int6PlanPathBody copy={copy} />
    </QuizStepTemplate>
  );
}
