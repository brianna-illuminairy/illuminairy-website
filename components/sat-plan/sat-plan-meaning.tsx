"use client";

import { useEffect, useState } from "react";
import { QuizOptionList } from "@/components/sat-plan/quiz-option-list";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { MEANING_OPTIONS } from "@/lib/sat-plan-funnel/meaning-options";
import { loadSatPlanState, patchSatPlanAnswers } from "@/lib/sat-plan-funnel/state";

type SatPlanMeaningProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanMeaning({ onBack, onContinue }: SatPlanMeaningProps) {
  const saved = loadSatPlanState().answers.meaning;
  const [selected, setSelected] = useState<string[]>(() =>
    Array.isArray(saved) ? [...saved] : []
  );

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "meaning",
      path: "spine",
      layout: "list"
    });
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      trackSatPlanFunnelEvent("intake_answer_toggle", {
        step_id: "meaning",
        option_id: id,
        selected: next.includes(id)
      });
      return next;
    });
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    patchSatPlanAnswers({ meaning: selected });
    trackSatPlanFunnelEvent("intake_step_complete", {
      step_id: "meaning",
      answer_count: selected.length
    });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="meaning"
      headline="What would a stronger SAT score mean for you?"
      hint="Select all that apply"
      bodyVariant="option-list"
      continueDisabled={selected.length === 0}
      onContinue={handleContinue}
      onBack={onBack}
    >
      <QuizOptionList
        mode="multi"
        options={MEANING_OPTIONS}
        selectedIds={selected}
        onToggle={toggle}
        groupLabel="What would a stronger SAT score mean for you?"
      />
    </QuizStepTemplate>
  );
}
