"use client";

import { useEffect, useMemo, useState } from "react";
import { PrepIcon } from "@/components/sat-plan/prep-icons";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { QuizTileGrid } from "@/components/sat-plan/quiz-tile-grid";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { prepHeadline } from "@/lib/sat-plan-funnel/personalization";
import { normalizePrepMethods, prepOptionsForTaker } from "@/lib/sat-plan-funnel/prep-options";
import { loadSatPlanState, patchSatPlanAnswers } from "@/lib/sat-plan-funnel/state";

type SatPlanPrepProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanPrep({ onBack, onContinue }: SatPlanPrepProps) {
  const answers = loadSatPlanState().answers;
  const [selected, setSelected] = useState<string[]>(() =>
    normalizePrepMethods(answers.prep_method)
  );

  const headline = useMemo(
    () => prepHeadline(answers.test_taker, answers.student_first_name),
    [answers.student_first_name, answers.test_taker]
  );

  const options = useMemo(
    () => prepOptionsForTaker(answers.test_taker),
    [answers.test_taker]
  );

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "prep",
      path: "spine",
      layout: "grid"
    });
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      trackSatPlanFunnelEvent("intake_answer_toggle", {
        step_id: "prep",
        option_id: id,
        selected: next.includes(id)
      });
      return next;
    });
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    patchSatPlanAnswers({ prep_method: selected });
    trackSatPlanFunnelEvent("intake_step_complete", {
      step_id: "prep",
      answer_count: selected.length
    });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="prep"
      headline={headline}
      hint="Select all that apply"
      bodyVariant="tile-grid"
      continueDisabled={selected.length === 0}
      onContinue={handleContinue}
      onBack={onBack}
    >
      <QuizTileGrid
        options={options}
        selectedIds={selected}
        onToggle={toggle}
        groupLabel={headline}
        hintId="quiz-step-hint-prep"
        renderIcon={(id) => <PrepIcon id={id} />}
      />
    </QuizStepTemplate>
  );
}
