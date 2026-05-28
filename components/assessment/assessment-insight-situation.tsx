"use client";

import { useEffect } from "react";
import { AssessmentQuizStepTemplate } from "@/components/assessment/assessment-quiz-step-template";
import { trackAssessmentFunnelEvent } from "@/lib/assessment-funnel/analytics";
import { insightSituationCopy } from "@/lib/assessment-funnel/insight-copy";
import { loadAssessmentState } from "@/lib/assessment-funnel/state";

type AssessmentInsightSituationProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function AssessmentInsightSituation({
  onBack,
  onContinue
}: AssessmentInsightSituationProps) {
  const situation = loadAssessmentState().answers.situation;
  const copy = insightSituationCopy(situation);

  useEffect(() => {
    trackAssessmentFunnelEvent("intake_step_view", {
      step_id: "insight-situation",
      situation_id: situation ?? "default"
    });
  }, [situation]);

  const handleContinue = () => {
    trackAssessmentFunnelEvent("intake_step_complete", { step_id: "insight-situation" });
    onContinue();
  };

  return (
    <AssessmentQuizStepTemplate
      stepId="insight-situation"
      headline={copy.headline}
      bodyVariant="copy"
      onBack={onBack}
      onContinue={handleContinue}
      continueLabel="Continue"
    >
      <div className="quiz-step-copy">
        <p>{copy.body}</p>
      </div>
    </AssessmentQuizStepTemplate>
  );
}
