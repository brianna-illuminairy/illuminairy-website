"use client";

import { useEffect, useRef, useState } from "react";
import { AssessmentOptionList } from "@/components/assessment/assessment-option-list";
import { AssessmentQuizStepTemplate } from "@/components/assessment/assessment-quiz-step-template";
import { trackAssessmentFunnelEvent } from "@/lib/assessment-funnel/analytics";
import { CURRENT_QUESTION_COPY } from "@/lib/assessment-funnel/question-copy";
import { CURRENT_SCORE_OPTIONS } from "@/lib/assessment-funnel/current-options";
import { loadAssessmentState, patchAssessmentAnswers } from "@/lib/assessment-funnel/state";

const ADVANCE_MS = 300;

type AssessmentCurrentProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function AssessmentCurrent({ onBack, onContinue }: AssessmentCurrentProps) {
  const answers = loadAssessmentState().answers;
  const saved = answers.recent_score;
  const [selectedId, setSelectedId] = useState<string | null>(saved ?? null);
  const advancingRef = useRef(false);
  const proactive = answers.situation === "proactive_early";

  const headline = proactive
    ? CURRENT_QUESTION_COPY.headlineProactiveEarly
    : CURRENT_QUESTION_COPY.headlineDefault;
  const hint = proactive ? CURRENT_QUESTION_COPY.hintProactiveEarly : null;

  useEffect(() => {
    trackAssessmentFunnelEvent("intake_step_view", { step_id: "current", layout: "list" });
  }, []);

  const handleSelect = (id: string) => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setSelectedId(id);
    patchAssessmentAnswers({ recent_score: id });
    trackAssessmentFunnelEvent("intake_step_complete", { step_id: "current", option_id: id });
    window.setTimeout(() => onContinue(), ADVANCE_MS);
  };

  return (
    <AssessmentQuizStepTemplate
      stepId="current"
      headline={headline}
      hint={hint}
      bodyVariant="option-list"
      onBack={onBack}
    >
      <AssessmentOptionList
        options={CURRENT_SCORE_OPTIONS}
        selectedId={selectedId}
        onSelect={handleSelect}
        groupLabel="Recent SAT score"
      />
    </AssessmentQuizStepTemplate>
  );
}
