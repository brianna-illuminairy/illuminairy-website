"use client";

import { useEffect, useMemo, useState } from "react";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { schoolsHeadline } from "@/lib/sat-plan-funnel/personalization";
import { loadSatPlanState, patchSatPlanAnswers } from "@/lib/sat-plan-funnel/state";

type SatPlanSchoolsProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanSchools({ onBack, onContinue }: SatPlanSchoolsProps) {
  const answers = loadSatPlanState().answers;
  const [schools, setSchools] = useState(() => answers.target_schools ?? "");
  const headline = useMemo(() => schoolsHeadline(answers.test_taker), [answers.test_taker]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "schools",
      path: "spine",
      layout: "form"
    });
  }, []);

  const handleContinue = () => {
    patchSatPlanAnswers({ target_schools: schools.trim() });
    trackSatPlanFunnelEvent("intake_step_complete", {
      step_id: "schools",
      has_schools: schools.trim().length > 0
    });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="schools"
      headline={headline}
      hint="Optional — skip if you're still exploring"
      bodyVariant="copy"
      continueLabel={schools.trim() ? "Continue" : "Skip for now"}
      onContinue={handleContinue}
      onBack={onBack}
    >
      <label className="sf-field" htmlFor="satplan-schools-input">
        <span className="sf-field__label">School names</span>
        <textarea
          id="satplan-schools-input"
          className="sf-textarea"
          rows={4}
          value={schools}
          placeholder="e.g. UGA, Georgia Tech, Emory…"
          onChange={(event) => setSchools(event.target.value)}
        />
      </label>
    </QuizStepTemplate>
  );
}
