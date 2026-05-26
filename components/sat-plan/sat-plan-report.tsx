"use client";

import { useEffect, useMemo } from "react";
import { FunnelReportBody } from "@/components/sat-plan/funnel-report-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildReportPlan } from "@/lib/sat-plan-funnel/report-plan";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanReportProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanReport({ onBack, onContinue }: SatPlanReportProps) {
  const answers = useSatPlanAnswers();
  const plan = useMemo(() => buildReportPlan(answers), [answers]);

  useEffect(() => {
    trackSatPlanFunnelEvent("report_view", {
      step_id: "report",
      path: "spine",
      layout: "report"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: "report" });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="report"
      headline={plan.headline}
      hint={plan.subhead}
      bodyVariant="copy"
      continueLabel="Book your free plan review"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <FunnelReportBody sections={plan.sections} />
    </QuizStepTemplate>
  );
}
