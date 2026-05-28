"use client";

import { useEffect, useRef, useState } from "react";
import { AssessmentOptionList } from "@/components/assessment/assessment-option-list";
import { AssessmentQuizStepTemplate } from "@/components/assessment/assessment-quiz-step-template";
import { trackAssessmentFunnelEvent } from "@/lib/assessment-funnel/analytics";
import { TEST_DATE_QUESTION_COPY } from "@/lib/assessment-funnel/question-copy";
import { ASSESSMENT_TEST_TIMING_OPTIONS } from "@/lib/assessment-funnel/test-date-options";
import { loadAssessmentState, patchAssessmentAnswers } from "@/lib/assessment-funnel/state";

const ADVANCE_MS = 300;

type AssessmentTestDateProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function AssessmentTestDate({ onBack, onContinue }: AssessmentTestDateProps) {
  const saved = loadAssessmentState().answers.test_timing;
  const [selectedId, setSelectedId] = useState<string | null>(saved ?? null);
  const advancingRef = useRef(false);

  useEffect(() => {
    trackAssessmentFunnelEvent("intake_step_view", { step_id: "test-date", layout: "list" });
  }, []);

  const handleSelect = (id: string) => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setSelectedId(id);
    patchAssessmentAnswers({ test_timing: id });
    trackAssessmentFunnelEvent("intake_step_complete", { step_id: "test-date", option_id: id });
    window.setTimeout(() => onContinue(), ADVANCE_MS);
  };

  return (
    <AssessmentQuizStepTemplate
      stepId="test-date"
      headline={TEST_DATE_QUESTION_COPY.headline}
      hint={TEST_DATE_QUESTION_COPY.hint}
      bodyVariant="option-list"
      onBack={onBack}
    >
      <AssessmentOptionList
        options={ASSESSMENT_TEST_TIMING_OPTIONS}
        selectedId={selectedId}
        onSelect={handleSelect}
        groupLabel="SAT timing"
      />
    </AssessmentQuizStepTemplate>
  );
}
