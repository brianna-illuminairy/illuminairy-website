"use client";

import { useEffect } from "react";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { site } from "@/lib/site";

type SatPlanBookProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanBook({ onBack, onContinue }: SatPlanBookProps) {
  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "book",
      path: "spine",
      layout: "conversion"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: "book" });
    window.open(site.calendlyUrl, "_blank", "noopener,noreferrer");
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="book"
      headline="Book your free SAT plan review"
      bodyVariant="copy"
      continueLabel="Open scheduling"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <div className="quiz-step-int3-content quiz-step-trust-content">
        <p className="quiz-step-copy">
          Pick a 20-minute call with our team. We will walk through your plan snapshot and answer
          questions about the August SAT Accelerator program.
        </p>
        <p className="quiz-step-footnote">
          Opens Calendly in a new tab — {site.calendlyUrl.replace("https://", "")}
        </p>
      </div>
    </QuizStepTemplate>
  );
}
