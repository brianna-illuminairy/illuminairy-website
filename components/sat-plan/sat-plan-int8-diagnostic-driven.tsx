"use client";

import { useEffect, useMemo } from "react";
import { Int8DiagnosticDrivenBody } from "@/components/sat-plan/int8-diagnostic-driven-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildInt8DiagnosticDrivenCopy } from "@/lib/sat-plan-funnel/int8-diagnostic-driven-copy";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanInt8DiagnosticDrivenProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanInt8DiagnosticDriven({
  onBack,
  onContinue
}: SatPlanInt8DiagnosticDrivenProps) {
  const answers = useSatPlanAnswers();
  const copy = useMemo(
    () => buildInt8DiagnosticDrivenCopy(answers.test_taker),
    [answers.test_taker]
  );

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "prep-failed-guided",
      path: "spine",
      layout: "interstitial",
      int8_beat: "diagnostic-driven"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", {
      step_id: "prep-failed-guided",
      int8_beat: "diagnostic-driven"
    });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="prep-failed-guided"
      headlineNode={
        <span className="int8-diagnostic-driven-headline">
          <span className="int8-diagnostic-driven-headline__lead">{copy.headlineLead}</span>{" "}
          <span className="int8-diagnostic-driven-headline__accent">{copy.headlineAccent}</span>
        </span>
      }
      bodyVariant="copy"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <Int8DiagnosticDrivenBody copy={copy} />
    </QuizStepTemplate>
  );
}
