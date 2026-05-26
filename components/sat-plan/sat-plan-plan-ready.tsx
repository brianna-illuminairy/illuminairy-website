"use client";

import { useEffect, useMemo } from "react";
import { FunnelPlanReadyBody } from "@/components/sat-plan/funnel-plan-ready-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { studentDisplayName } from "@/lib/sat-plan-funnel/student-voice";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanPlanReadyProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanPlanReady({ onBack, onContinue }: SatPlanPlanReadyProps) {
  const answers = useSatPlanAnswers();
  const name = useMemo(() => studentDisplayName(answers), [answers]);

  const headline = useMemo(() => {
    if (answers.test_taker === "test_taker_self") return "Putting together your plan…";
    return `Putting together ${name}'s plan…`;
  }, [answers.test_taker, name]);

  const bodyCopy = useMemo(() => {
    const learner = answers.test_taker === "test_taker_self" ? "you" : name;
    return `We mapped your target, timeline, and gaps into one focused SAT path — built for how ${learner} actually learns.`;
  }, [answers.test_taker, name]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "plan-ready",
      path: "spine",
      layout: "interstitial"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: "plan-ready" });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="plan-ready"
      headline={headline}
      bodyVariant="copy"
      continueLabel="Open my plan"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <FunnelPlanReadyBody bodyCopy={bodyCopy} />
    </QuizStepTemplate>
  );
}
