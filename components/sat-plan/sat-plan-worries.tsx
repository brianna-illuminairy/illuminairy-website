"use client";

import { useEffect, useState } from "react";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { QuizTileGrid } from "@/components/sat-plan/quiz-tile-grid";
import { WorryIcon } from "@/components/sat-plan/worry-icons";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { loadSatPlanState, patchSatPlanAnswers } from "@/lib/sat-plan-funnel/state";
import { WORRY_OPTIONS } from "@/lib/sat-plan-funnel/worry-options";

type SatPlanWorriesProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanWorries({ onBack, onContinue }: SatPlanWorriesProps) {
  const saved = loadSatPlanState().answers.worries;
  const [selected, setSelected] = useState<string[]>(() =>
    Array.isArray(saved) ? [...saved] : []
  );

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "worries",
      path: "spine",
      layout: "grid"
    });
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      trackSatPlanFunnelEvent("intake_answer_toggle", {
        step_id: "worries",
        option_id: id,
        selected: next.includes(id)
      });
      return next;
    });
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    patchSatPlanAnswers({ worries: selected });
    trackSatPlanFunnelEvent("intake_step_complete", {
      step_id: "worries",
      answer_count: selected.length
    });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="worries"
      headline="What's got you worried?"
      hint="Select all that apply"
      bodyVariant="tile-grid"
      continueDisabled={selected.length === 0}
      onContinue={handleContinue}
      onBack={onBack}
    >
      <QuizTileGrid
        options={WORRY_OPTIONS}
        selectedIds={selected}
        onToggle={toggle}
        groupLabel="What's got you worried?"
        hintId="quiz-step-hint-worries"
        renderIcon={(id) => <WorryIcon id={id} />}
      />
    </QuizStepTemplate>
  );
}
