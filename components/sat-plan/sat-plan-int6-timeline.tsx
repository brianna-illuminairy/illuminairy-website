"use client";

import { useEffect, useMemo } from "react";
import { Int6TimelineBody } from "@/components/sat-plan/int6-timeline-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildInt6TimelineCopy } from "@/lib/sat-plan-funnel/int6-timeline-copy";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanInt6TimelineProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanInt6Timeline({ onBack, onContinue }: SatPlanInt6TimelineProps) {
  const answers = useSatPlanAnswers();
  const copy = useMemo(() => buildInt6TimelineCopy(answers), [answers]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "timeline",
      path: "spine",
      layout: "interstitial"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: "timeline" });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="timeline"
      headline={copy.headline}
      bodyVariant="copy"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <Int6TimelineBody copy={copy} />
    </QuizStepTemplate>
  );
}
