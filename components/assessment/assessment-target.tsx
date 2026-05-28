"use client";

import { useEffect, useRef, useState } from "react";
import { AssessmentOptionList } from "@/components/assessment/assessment-option-list";
import { AssessmentQuizStepTemplate } from "@/components/assessment/assessment-quiz-step-template";
import { trackAssessmentFunnelEvent } from "@/lib/assessment-funnel/analytics";
import { TARGET_QUESTION_COPY } from "@/lib/assessment-funnel/question-copy";
import { loadAssessmentState, patchAssessmentAnswers } from "@/lib/assessment-funnel/state";
import { TARGET_OPTIONS } from "@/lib/assessment-funnel/target-options";

const ADVANCE_MS = 300;

type AssessmentTargetProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function AssessmentTarget({ onBack, onContinue }: AssessmentTargetProps) {
  const saved = loadAssessmentState().answers.target_score;
  const [selectedId, setSelectedId] = useState<string | null>(saved ?? null);
  const advancingRef = useRef(false);

  useEffect(() => {
    trackAssessmentFunnelEvent("intake_step_view", { step_id: "target", layout: "list" });
  }, []);

  const handleSelect = (id: string) => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setSelectedId(id);
    patchAssessmentAnswers({ target_score: id });
    trackAssessmentFunnelEvent("intake_step_complete", { step_id: "target", option_id: id });
    window.setTimeout(() => onContinue(), ADVANCE_MS);
  };

  return (
    <AssessmentQuizStepTemplate
      stepId="target"
      headline={TARGET_QUESTION_COPY.headline}
      hint={TARGET_QUESTION_COPY.hint}
      bodyVariant="option-list"
      onBack={onBack}
    >
      <AssessmentOptionList
        options={TARGET_OPTIONS}
        selectedId={selectedId}
        onSelect={handleSelect}
        groupLabel="Target score range"
      />
    </AssessmentQuizStepTemplate>
  );
}
