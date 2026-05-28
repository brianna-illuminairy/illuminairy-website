"use client";

// psych-in: overwhelm | psych-out: seen | get-at: segment Q1
import { useEffect, useRef, useState } from "react";
import { AssessmentOptionList } from "@/components/assessment/assessment-option-list";
import { AssessmentQuizStepTemplate } from "@/components/assessment/assessment-quiz-step-template";
import { trackAssessmentFunnelEvent } from "@/lib/assessment-funnel/analytics";
import { SITUATION_QUESTION_COPY } from "@/lib/assessment-funnel/question-copy";
import { SITUATION_OPTIONS } from "@/lib/assessment-funnel/situation-options";
import { loadAssessmentState, patchAssessmentAnswers } from "@/lib/assessment-funnel/state";

const ADVANCE_MS = 300;

type AssessmentSituationProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function AssessmentSituation({ onBack, onContinue }: AssessmentSituationProps) {
  const saved = loadAssessmentState().answers.situation;
  const [selectedId, setSelectedId] = useState<string | null>(saved ?? null);
  const advancingRef = useRef(false);

  useEffect(() => {
    trackAssessmentFunnelEvent("intake_step_view", { step_id: "situation", layout: "list" });
  }, []);

  const handleSelect = (id: string) => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setSelectedId(id);
    trackAssessmentFunnelEvent("intake_answer_toggle", {
      step_id: "situation",
      option_id: id,
      selected: true
    });
    patchAssessmentAnswers({ situation: id });
    trackAssessmentFunnelEvent("intake_step_complete", { step_id: "situation", option_id: id });
    window.setTimeout(() => onContinue(), ADVANCE_MS);
  };

  return (
    <AssessmentQuizStepTemplate
      stepId="situation"
      headline={SITUATION_QUESTION_COPY.headline}
      hint={SITUATION_QUESTION_COPY.hint}
      bodyVariant="option-list"
      onBack={onBack}
    >
      <AssessmentOptionList
        options={SITUATION_OPTIONS}
        selectedId={selectedId}
        onSelect={handleSelect}
        groupLabel="SAT situation and goals"
      />
    </AssessmentQuizStepTemplate>
  );
}
