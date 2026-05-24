"use client";

import { useEffect, useMemo } from "react";
import { Int8SelfStudyFailBody } from "@/components/sat-plan/int8-self-study-fail-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildInt8SelfStudyFailCopy } from "@/lib/sat-plan-funnel/int8-self-study-fail-copy";

type SatPlanInt8SelfStudyFailProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanInt8SelfStudyFail({
  onBack,
  onContinue
}: SatPlanInt8SelfStudyFailProps) {
  const copy = useMemo(() => buildInt8SelfStudyFailCopy(), []);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "prep-failed-self-study",
      path: "spine",
      layout: "interstitial",
      int8_beat: "self-study-fail"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", {
      step_id: "prep-failed-self-study",
      int8_beat: "self-study-fail"
    });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="prep-failed-self-study"
      headline={copy.headline}
      bodyVariant="copy"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <Int8SelfStudyFailBody copy={copy} />
    </QuizStepTemplate>
  );
}
