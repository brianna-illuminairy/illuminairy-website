"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { QuizOptionList } from "@/components/sat-plan/quiz-option-list";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { testDateHeadline } from "@/lib/sat-plan-funnel/personalization";
import { getSatTestDateOptions } from "@/lib/sat-plan-funnel/sat-test-dates";
import { loadSatPlanState, patchSatPlanAnswers } from "@/lib/sat-plan-funnel/state";

type SatPlanTestDateProps = {
  onBack: () => void;
  onContinue: () => void;
};

const ADVANCE_MS = 300;

export function SatPlanTestDate({ onBack, onContinue }: SatPlanTestDateProps) {
  const answers = loadSatPlanState().answers;
  const saved = answers.test_date;
  const [selectedId, setSelectedId] = useState<string | null>(saved ?? null);
  const advancingRef = useRef(false);

  const headline = useMemo(
    () => testDateHeadline(answers.test_taker, answers.test_history),
    [answers.test_history, answers.test_taker]
  );

  const options = useMemo(() => getSatTestDateOptions(), []);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "test-date",
      path: "spine",
      layout: "list"
    });
  }, []);

  const handleSelect = (id: string) => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setSelectedId(id);
    trackSatPlanFunnelEvent("intake_answer_toggle", {
      step_id: "test-date",
      option_id: id,
      selected: true
    });
    patchSatPlanAnswers({ test_date: id });
    trackSatPlanFunnelEvent("intake_step_complete", {
      step_id: "test-date",
      option_id: id
    });
    window.setTimeout(() => {
      onContinue();
    }, ADVANCE_MS);
  };

  return (
    <QuizStepTemplate
      stepId="test-date"
      headline={headline}
      bodyVariant="option-list"
      continueDisabled
      onContinue={() => {}}
      onBack={onBack}
    >
      <QuizOptionList
        options={options}
        selectedId={selectedId}
        onSelect={handleSelect}
        groupLabel={headline}
      />
    </QuizStepTemplate>
  );
}
