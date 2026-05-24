"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { QuizOptionList } from "@/components/sat-plan/quiz-option-list";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { HOURS_OPTIONS } from "@/lib/sat-plan-funnel/hours-options";
import { hoursHeadline } from "@/lib/sat-plan-funnel/personalization";
import {
  clearSatPlanAnswerKey,
  loadSatPlanState,
  patchSatPlanAnswers
} from "@/lib/sat-plan-funnel/state";

type SatPlanHoursProps = {
  onBack: () => void;
  onContinue: () => void;
};

const ADVANCE_MS = 300;

export function SatPlanHours({ onBack, onContinue }: SatPlanHoursProps) {
  const answers = loadSatPlanState().answers;
  const saved = answers.study_hours;
  const [selectedId, setSelectedId] = useState<string | null>(saved ?? null);
  const advancingRef = useRef(false);

  const headline = useMemo(() => hoursHeadline(answers.test_taker), [answers.test_taker]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "hours",
      path: "spine",
      layout: "list"
    });
  }, []);

  const advance = () => {
    window.setTimeout(() => {
      onContinue();
    }, ADVANCE_MS);
  };

  const handleSelect = (id: string) => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setSelectedId(id);
    if (id === "hours_skip") {
      clearSatPlanAnswerKey("study_hours");
      trackSatPlanFunnelEvent("intake_step_complete", {
        step_id: "hours",
        skipped: true
      });
      advance();
      return;
    }
    trackSatPlanFunnelEvent("intake_answer_toggle", {
      step_id: "hours",
      option_id: id,
      selected: true
    });
    patchSatPlanAnswers({ study_hours: id });
    trackSatPlanFunnelEvent("intake_step_complete", {
      step_id: "hours",
      option_id: id
    });
    advance();
  };

  return (
    <QuizStepTemplate
      stepId="hours"
      headline={headline}
      bodyVariant="option-list"
      continueDisabled
      onContinue={() => {}}
      onBack={onBack}
    >
      <QuizOptionList
        options={HOURS_OPTIONS}
        selectedId={selectedId}
        onSelect={handleSelect}
        groupLabel={headline}
      />
    </QuizStepTemplate>
  );
}
