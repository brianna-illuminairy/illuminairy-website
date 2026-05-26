"use client";

import { useEffect, useMemo } from "react";
import { IntCh2ScoreFitBody } from "@/components/sat-plan/int-ch2-score-fit-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildIntCh2ScoreFitCopy } from "@/lib/sat-plan-funnel/int-ch2-score-fit-copy";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanIntCh2ScoreFitProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanIntCh2ScoreFit({ onBack, onContinue }: SatPlanIntCh2ScoreFitProps) {
  const answers = useSatPlanAnswers();
  const copy = useMemo(() => buildIntCh2ScoreFitCopy(answers), [answers]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "score-fit",
      path: "spine",
      layout: "interstitial"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: "score-fit" });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="score-fit"
      headline={copy.headline}
      bodyVariant="copy"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <IntCh2ScoreFitBody copy={copy} />
    </QuizStepTemplate>
  );
}
