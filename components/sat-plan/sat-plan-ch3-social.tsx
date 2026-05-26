"use client";

import { useEffect, useMemo } from "react";
import { Ch3SocialBody } from "@/components/sat-plan/ch3-interstitial-bodies";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildCh3SocialCopy } from "@/lib/sat-plan-funnel/ch3-interstitial-copy";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanCh3SocialProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanCh3Social({ onBack, onContinue }: SatPlanCh3SocialProps) {
  const answers = useSatPlanAnswers();
  const copy = useMemo(() => buildCh3SocialCopy(answers), [answers]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "ch3-social",
      path: "spine",
      layout: "interstitial"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: "ch3-social" });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="ch3-social"
      headline={copy.headline}
      bodyVariant="copy"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <Ch3SocialBody copy={copy} />
    </QuizStepTemplate>
  );
}
