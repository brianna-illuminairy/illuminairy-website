"use client";

import { useEffect, useMemo } from "react";
import { Int13KidProblemBody } from "@/components/sat-plan/int13-kid-problem-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildInt13KidProblemCopy } from "@/lib/sat-plan-funnel/int13-kid-problem-copy";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanKidProblemProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanKidProblem({ onBack, onContinue }: SatPlanKidProblemProps) {
  const answers = useSatPlanAnswers();
  const copy = useMemo(() => buildInt13KidProblemCopy(answers), [answers]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "kid-problem",
      interstitial_id: "int13_kid_problem",
      education_part: "B_bridge",
      path: "spine",
      layout: "interstitial"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", {
      step_id: "kid-problem",
      interstitial_id: "int13_kid_problem"
    });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="kid-problem"
      headline={copy.headline}
      bodyVariant="copy"
      continueLabel="Got it"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <Int13KidProblemBody copy={copy} />
    </QuizStepTemplate>
  );
}
