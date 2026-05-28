"use client";

import { useEffect, useState } from "react";
import { AssessmentOptionList } from "@/components/assessment/assessment-option-list";
import { AssessmentQuizStepTemplate } from "@/components/assessment/assessment-quiz-step-template";
import { trackAssessmentFunnelEvent } from "@/lib/assessment-funnel/analytics";
import { TRIED_QUESTION_COPY } from "@/lib/assessment-funnel/question-copy";
import { TRIED_OPTIONS } from "@/lib/assessment-funnel/tried-options";
import { loadAssessmentState, patchAssessmentAnswers } from "@/lib/assessment-funnel/state";

type AssessmentTriedProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function AssessmentTried({ onBack, onContinue }: AssessmentTriedProps) {
  const saved = loadAssessmentState().answers.tried_methods;
  const [selected, setSelected] = useState<string[]>(() =>
    Array.isArray(saved) ? [...saved] : []
  );

  useEffect(() => {
    trackAssessmentFunnelEvent("intake_step_view", { step_id: "tried", layout: "list" });
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      trackAssessmentFunnelEvent("intake_answer_toggle", {
        step_id: "tried",
        option_id: id,
        selected: next.includes(id)
      });
      return next;
    });
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    patchAssessmentAnswers({ tried_methods: selected });
    trackAssessmentFunnelEvent("intake_step_complete", {
      step_id: "tried",
      answer_count: selected.length
    });
    onContinue();
  };

  return (
    <AssessmentQuizStepTemplate
      stepId="tried"
      headline={TRIED_QUESTION_COPY.headline}
      hint={TRIED_QUESTION_COPY.hint}
      bodyVariant="option-list"
      continueDisabled={selected.length === 0}
      onContinue={handleContinue}
      onBack={onBack}
    >
      <AssessmentOptionList
        mode="multi"
        options={TRIED_OPTIONS}
        selectedIds={selected}
        onToggle={toggle}
        groupLabel="Prep methods tried"
      />
    </AssessmentQuizStepTemplate>
  );
}
