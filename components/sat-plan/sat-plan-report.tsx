"use client";

import { useEffect, useMemo } from "react";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildReportSummary } from "@/lib/sat-plan-funnel/report-summary";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanReportProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanReport({ onBack, onContinue }: SatPlanReportProps) {
  const answers = useSatPlanAnswers();
  const { rows } = useMemo(() => buildReportSummary(answers), [answers]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
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
      headline="Your SAT plan snapshot"
      hint="Results vary — this is a starting map, not a guarantee."
      bodyVariant="copy"
      continueLabel="Book a free review"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <dl className="sf-report">
        {rows.map((row) => (
          <div key={row.label} className="sf-report__row">
            <dt className="sf-report__label">{row.label}</dt>
            <dd className="sf-report__value">{row.value}</dd>
          </div>
        ))}
      </dl>
    </QuizStepTemplate>
  );
}
