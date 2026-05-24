"use client";

import { useEffect, useMemo, useState } from "react";
import { KidProblemIcon } from "@/components/sat-plan/kid-problem-icons";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { QuizTileGrid } from "@/components/sat-plan/quiz-tile-grid";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { kidProblemHeadline } from "@/lib/sat-plan-funnel/int13-kid-problem-copy";
import { KID_PROBLEM_OPTIONS } from "@/lib/sat-plan-funnel/kid-problem-options";
import { loadSatPlanState, patchSatPlanAnswers } from "@/lib/sat-plan-funnel/state";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanKidProblemProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanKidProblem({ onBack, onContinue }: SatPlanKidProblemProps) {
  const answers = useSatPlanAnswers();
  const saved = loadSatPlanState().answers.kid_problem_blocks;
  const [selected, setSelected] = useState<string[]>(() =>
    Array.isArray(saved) ? [...saved] : []
  );

  const headline = useMemo(
    () => kidProblemHeadline(answers.test_taker),
    [answers.test_taker]
  );

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "kid-problem",
      interstitial_id: "int13_kid_problem",
      path: "spine",
      layout: "grid"
    });
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      trackSatPlanFunnelEvent("intake_answer_toggle", {
        step_id: "kid-problem",
        option_id: id,
        selected: next.includes(id)
      });
      return next;
    });
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    patchSatPlanAnswers({ kid_problem_blocks: selected });
    trackSatPlanFunnelEvent("intake_step_complete", {
      step_id: "kid-problem",
      interstitial_id: "int13_kid_problem",
      answer_count: selected.length,
      answer_ids: selected.join(",")
    });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="kid-problem"
      headline={headline}
      hint="Select all that apply"
      bodyVariant="tile-grid"
      continueDisabled={selected.length === 0}
      onContinue={handleContinue}
      onBack={onBack}
    >
      <QuizTileGrid
        className="quiz-tile-grid--kid-problem"
        options={KID_PROBLEM_OPTIONS}
        selectedIds={selected}
        onToggle={toggle}
        groupLabel={headline}
        hintId="quiz-step-hint-kid-problem"
        renderIcon={(id) => <KidProblemIcon id={id} />}
      />
    </QuizStepTemplate>
  );
}
