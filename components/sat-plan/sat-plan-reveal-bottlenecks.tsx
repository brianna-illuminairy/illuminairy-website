"use client";

import { useEffect, useMemo } from "react";
import { FunnelRevealBottlenecksBody } from "@/components/sat-plan/funnel-reveal-bottlenecks-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildRevealBottlenecksCopy } from "@/lib/sat-plan-funnel/final-reveal-copy";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanRevealBottlenecksProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanRevealBottlenecks({
  onBack,
  onContinue
}: SatPlanRevealBottlenecksProps) {
  const answers = useSatPlanAnswers();
  const copy = useMemo(() => buildRevealBottlenecksCopy(answers), [answers]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "reveal-bottlenecks",
      path: "spine",
      layout: "interstitial"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: "reveal-bottlenecks" });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="reveal-bottlenecks"
      headline={copy.headline}
      bodyVariant="copy"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <FunnelRevealBottlenecksBody copy={copy} />
    </QuizStepTemplate>
  );
}
