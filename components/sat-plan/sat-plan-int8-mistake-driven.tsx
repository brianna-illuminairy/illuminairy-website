"use client";

import { useEffect, useMemo } from "react";
import { Int8MistakeDrivenBody } from "@/components/sat-plan/int8-mistake-driven-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildInt8MistakeDrivenCopy } from "@/lib/sat-plan-funnel/int8-mistake-driven-copy";

type SatPlanInt8MistakeDrivenProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanInt8MistakeDriven({
  onBack,
  onContinue
}: SatPlanInt8MistakeDrivenProps) {
  const copy = useMemo(() => buildInt8MistakeDrivenCopy(), []);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "prep-failed-mistake-driven",
      path: "spine",
      layout: "interstitial",
      int8_beat: "mistake-driven"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", {
      step_id: "prep-failed-mistake-driven",
      int8_beat: "mistake-driven"
    });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="prep-failed-mistake-driven"
      headline={copy.headline}
      bodyVariant="copy"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <Int8MistakeDrivenBody copy={copy} />
    </QuizStepTemplate>
  );
}
