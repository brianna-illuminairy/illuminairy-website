"use client";

import { useEffect, useMemo } from "react";
import { Int8PrepComparisonBody } from "@/components/sat-plan/int8-prep-comparison-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import {
  buildInt8PrepComparisonCopy,
  type Int8PrepBeat
} from "@/lib/sat-plan-funnel/int8-prep-comparison-copy";
import type { SatPlanStep } from "@/lib/sat-plan-funnel/types";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanInt8PrepComparisonProps = {
  beat?: Int8PrepBeat;
  stepId?: SatPlanStep;
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanInt8PrepComparison({
  beat = "proof",
  stepId = "prep-failed-proof",
  onBack,
  onContinue
}: SatPlanInt8PrepComparisonProps) {
  const answers = useSatPlanAnswers();
  const copy = useMemo(() => buildInt8PrepComparisonCopy(answers), [answers]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: stepId,
      path: "spine",
      layout: "interstitial",
      int8_beat: beat
    });
  }, [beat, stepId]);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", {
      step_id: stepId,
      int8_beat: beat
    });
    onContinue();
  };

  const headlineNode = (() => {
    if (beat === "plateau") {
      return copy.plateauHeadline;
    }
    if (beat === "proof") {
      return (
        <>
          <strong>+{copy.proofHeadlineGap}</strong>
          {" more points with 1:1 tutoring."}
        </>
      );
    }
    if (beat === "guided") {
      return copy.guidedHeadline;
    }
    return (
      <>
        <strong>+{copy.proofHeadlineGap}</strong>
        {" more points with 1:1 tutoring."}
      </>
    );
  })();

  return (
    <QuizStepTemplate
      stepId={stepId}
      headlineNode={headlineNode}
      bodyVariant="copy"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <Int8PrepComparisonBody
        copy={copy}
        beat={beat}
        testTaker={answers.test_taker}
      />
    </QuizStepTemplate>
  );
}
