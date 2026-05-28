"use client";

import { useEffect } from "react";
import { AssessmentQuizStepTemplate } from "@/components/assessment/assessment-quiz-step-template";
import { trackAssessmentFunnelEvent } from "@/lib/assessment-funnel/analytics";
import { INSIGHT_PATH_COPY } from "@/lib/assessment-funnel/insight-copy";

type AssessmentInsightPathProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function AssessmentInsightPath({ onBack, onContinue }: AssessmentInsightPathProps) {
  useEffect(() => {
    trackAssessmentFunnelEvent("intake_step_view", { step_id: "insight-path" });
  }, []);

  const handleContinue = () => {
    trackAssessmentFunnelEvent("intake_step_complete", { step_id: "insight-path" });
    onContinue();
  };

  return (
    <AssessmentQuizStepTemplate
      stepId="insight-path"
      headline={INSIGHT_PATH_COPY.headline}
      bodyVariant="copy"
      onBack={onBack}
      onContinue={handleContinue}
      continueLabel="Continue"
    >
      <div className="quiz-step-copy">
        <p>{INSIGHT_PATH_COPY.body}</p>
      </div>
    </AssessmentQuizStepTemplate>
  );
}
