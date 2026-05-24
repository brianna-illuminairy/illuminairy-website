"use client";

import { useEffect, useRef, useState } from "react";
import { QuizOptionList } from "@/components/sat-plan/quiz-option-list";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { loadSatPlanState, patchSatPlanAnswers } from "@/lib/sat-plan-funnel/state";
import { TEST_TAKER_OPTIONS } from "@/lib/sat-plan-funnel/test-taker-options";

type SatPlanWhoProps = {
  onBack: () => void;
  onContinue: () => void;
};

const ADVANCE_MS = 300;

export function SatPlanWho({ onBack, onContinue }: SatPlanWhoProps) {
  const saved = loadSatPlanState().answers.test_taker;
  const [selectedId, setSelectedId] = useState<string | null>(saved ?? null);
  const advancingRef = useRef(false);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "who",
      path: "spine",
      layout: "list"
    });
  }, []);

  const handleSelect = (id: string) => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setSelectedId(id);
    trackSatPlanFunnelEvent("intake_answer_toggle", {
      step_id: "who",
      option_id: id,
      selected: true
    });
    patchSatPlanAnswers({ test_taker: id });
    trackSatPlanFunnelEvent("intake_step_complete", {
      step_id: "who",
      option_id: id
    });
    window.setTimeout(() => {
      onContinue();
    }, ADVANCE_MS);
  };

  return (
    <QuizStepTemplate
      stepId="who"
      headline="Who's taking the SAT?"
      bodyVariant="option-list"
      continueDisabled
      onContinue={() => {}}
      onBack={onBack}
    >
      <QuizOptionList
        options={TEST_TAKER_OPTIONS}
        selectedId={selectedId}
        onSelect={handleSelect}
        groupLabel="Who's taking the SAT?"
      />
    </QuizStepTemplate>
  );
}
