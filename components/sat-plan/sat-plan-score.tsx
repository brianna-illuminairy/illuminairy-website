"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { QuizOptionList } from "@/components/sat-plan/quiz-option-list";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { scoreHeadline } from "@/lib/sat-plan-funnel/personalization";
import { SCORE_OPTIONS } from "@/lib/sat-plan-funnel/score-options";
import { loadSatPlanState, patchSatPlanAnswers } from "@/lib/sat-plan-funnel/state";

type SatPlanScoreProps = {
  onBack: () => void;
  onContinue: () => void;
};

const ADVANCE_MS = 300;

export function SatPlanScore({ onBack, onContinue }: SatPlanScoreProps) {
  const answers = loadSatPlanState().answers;
  const saved = answers.recent_score;
  const [selectedId, setSelectedId] = useState<string | null>(saved ?? null);
  const advancingRef = useRef(false);

  const headline = useMemo(
    () => scoreHeadline(answers.test_taker, answers.test_history),
    [answers.test_history, answers.test_taker]
  );

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "score",
      path: "spine",
      layout: "list"
    });
  }, []);

  const handleSelect = (id: string) => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setSelectedId(id);
    trackSatPlanFunnelEvent("intake_answer_toggle", {
      step_id: "score",
      option_id: id,
      selected: true
    });
    patchSatPlanAnswers({ recent_score: id });
    trackSatPlanFunnelEvent("intake_step_complete", {
      step_id: "score",
      option_id: id
    });
    window.setTimeout(() => {
      onContinue();
    }, ADVANCE_MS);
  };

  return (
    <QuizStepTemplate
      stepId="score"
      headline={headline}
      bodyVariant="option-list"
      continueDisabled
      onContinue={() => {}}
      onBack={onBack}
    >
      <QuizOptionList
        options={SCORE_OPTIONS}
        selectedId={selectedId}
        onSelect={handleSelect}
        groupLabel={headline}
      />
    </QuizStepTemplate>
  );
}
