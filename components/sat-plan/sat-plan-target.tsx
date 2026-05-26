"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { QuizOptionList } from "@/components/sat-plan/quiz-option-list";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { targetScoreHeadline } from "@/lib/sat-plan-funnel/personalization";
import { loadSatPlanState, patchSatPlanAnswers } from "@/lib/sat-plan-funnel/state";
import { TARGET_SCORE_OPTIONS } from "@/lib/sat-plan-funnel/target-score-options";

type SatPlanTargetProps = {
  onBack: () => void;
  onContinue: () => void;
};

const ADVANCE_MS = 300;

export function SatPlanTarget({ onBack, onContinue }: SatPlanTargetProps) {
  const answers = loadSatPlanState().answers;
  const saved = answers.target_score;
  const [selectedId, setSelectedId] = useState<string | null>(saved ?? null);
  const advancingRef = useRef(false);

  const headline = useMemo(
    () => targetScoreHeadline(answers.test_taker, answers.student_first_name),
    [answers.student_first_name, answers.test_taker]
  );

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "target",
      path: "spine",
      layout: "list"
    });
  }, []);

  const handleSelect = (id: string) => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setSelectedId(id);
    trackSatPlanFunnelEvent("intake_answer_toggle", {
      step_id: "target",
      option_id: id,
      selected: true
    });
    patchSatPlanAnswers({ target_score: id });
    trackSatPlanFunnelEvent("intake_step_complete", {
      step_id: "target",
      option_id: id
    });
    window.setTimeout(() => {
      onContinue();
    }, ADVANCE_MS);
  };

  return (
    <QuizStepTemplate
      stepId="target"
      headline={headline}
      bodyVariant="option-list"
      continueDisabled
      onContinue={() => {}}
      onBack={onBack}
    >
      <QuizOptionList
        options={TARGET_SCORE_OPTIONS}
        selectedId={selectedId}
        onSelect={handleSelect}
        groupLabel={headline}
      />
    </QuizStepTemplate>
  );
}
