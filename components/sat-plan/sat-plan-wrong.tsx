"use client";

import { useEffect, useState } from "react";
import { QuizOptionCategoryList } from "@/components/sat-plan/quiz-option-category-list";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { wrongHeadline } from "@/lib/sat-plan-funnel/personalization";
import { loadSatPlanState, patchSatPlanAnswers } from "@/lib/sat-plan-funnel/state";
import { WRONG_CATEGORIES } from "@/lib/sat-plan-funnel/wrong-options";

type SatPlanWrongProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanWrong({ onBack, onContinue }: SatPlanWrongProps) {
  const saved = loadSatPlanState().answers.wrong_reasons;
  const [selected, setSelected] = useState<string[]>(() =>
    Array.isArray(saved) ? [...saved] : []
  );
  const headline = wrongHeadline();

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "wrong",
      path: "spine",
      layout: "category-list"
    });
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      trackSatPlanFunnelEvent("intake_answer_toggle", {
        step_id: "wrong",
        option_id: id,
        selected: next.includes(id)
      });
      return next;
    });
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    patchSatPlanAnswers({ wrong_reasons: selected });
    trackSatPlanFunnelEvent("intake_step_complete", {
      step_id: "wrong",
      answer_count: selected.length
    });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="wrong"
      headline={headline}
      hint="Select all that apply"
      bodyVariant="copy"
      continueDisabled={selected.length === 0}
      onContinue={handleContinue}
      onBack={onBack}
    >
      <QuizOptionCategoryList
        categories={WRONG_CATEGORIES}
        selectedIds={selected}
        onToggle={toggle}
        groupLabel={headline}
        hintId="quiz-step-hint-wrong"
      />
    </QuizStepTemplate>
  );
}
