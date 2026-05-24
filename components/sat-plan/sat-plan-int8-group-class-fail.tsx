"use client";

import { useEffect, useMemo } from "react";
import { Int8GroupClassFailBody } from "@/components/sat-plan/int8-group-class-fail-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildInt8GroupClassFailCopy } from "@/lib/sat-plan-funnel/int8-group-class-fail-copy";

type SatPlanInt8GroupClassFailProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanInt8GroupClassFail({
  onBack,
  onContinue
}: SatPlanInt8GroupClassFailProps) {
  const copy = useMemo(() => buildInt8GroupClassFailCopy(), []);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "prep-failed-group-class",
      path: "spine",
      layout: "interstitial",
      int8_beat: "group-class-fail"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", {
      step_id: "prep-failed-group-class",
      int8_beat: "group-class-fail"
    });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="prep-failed-group-class"
      headline={copy.headline}
      bodyVariant="copy"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <Int8GroupClassFailBody copy={copy} />
    </QuizStepTemplate>
  );
}
