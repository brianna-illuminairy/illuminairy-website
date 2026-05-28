"use client";

import { useEffect, useRef, useState } from "react";
import { AssessmentOptionList } from "@/components/assessment/assessment-option-list";
import { AssessmentQuizStepTemplate } from "@/components/assessment/assessment-quiz-step-template";
import { trackAssessmentFunnelEvent } from "@/lib/assessment-funnel/analytics";
import { WHO_QUESTION_COPY } from "@/lib/assessment-funnel/question-copy";
import { WHO_OPTIONS } from "@/lib/assessment-funnel/who-options";
import { loadAssessmentState, patchAssessmentAnswers } from "@/lib/assessment-funnel/state";

const ADVANCE_MS = 300;

type AssessmentWhoProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function AssessmentWho({ onBack, onContinue }: AssessmentWhoProps) {
  const saved = loadAssessmentState().answers.test_taker;
  const [selectedId, setSelectedId] = useState<string | null>(saved ?? null);
  const advancingRef = useRef(false);

  useEffect(() => {
    trackAssessmentFunnelEvent("intake_step_view", { step_id: "who", layout: "list" });
  }, []);

  const handleSelect = (id: string) => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setSelectedId(id);
    patchAssessmentAnswers({ test_taker: id });
    trackAssessmentFunnelEvent("intake_step_complete", { step_id: "who", option_id: id });
    window.setTimeout(() => onContinue(), ADVANCE_MS);
  };

  return (
    <AssessmentQuizStepTemplate
      stepId="who"
      headline={WHO_QUESTION_COPY.headline}
      hint={WHO_QUESTION_COPY.hint}
      bodyVariant="option-list"
      onBack={onBack}
    >
      <AssessmentOptionList
        options={WHO_OPTIONS}
        selectedId={selectedId}
        onSelect={handleSelect}
        groupLabel="Who this assessment is for"
      />
    </AssessmentQuizStepTemplate>
  );
}
