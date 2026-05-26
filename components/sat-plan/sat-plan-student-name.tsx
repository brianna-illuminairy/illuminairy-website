"use client";

import { useEffect, useState } from "react";
import { FunnelStudentNameBody } from "@/components/sat-plan/funnel-student-name-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { studentNameHeadline, studentNameHint } from "@/lib/sat-plan-funnel/personalization";
import { loadSatPlanState, patchSatPlanAnswers } from "@/lib/sat-plan-funnel/state";

type SatPlanStudentNameProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanStudentName({ onBack, onContinue }: SatPlanStudentNameProps) {
  const answers = loadSatPlanState().answers;
  const [name, setName] = useState(answers.student_first_name ?? "");
  const trimmed = name.trim();
  const valid = trimmed.length >= 1 && trimmed.length <= 32;

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "student-name",
      path: "spine",
      layout: "form"
    });
  }, []);

  const handleContinue = () => {
    if (!valid) return;
    patchSatPlanAnswers({ student_first_name: trimmed });
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: "student-name" });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="student-name"
      headline={studentNameHeadline(answers.test_taker)}
      hint={studentNameHint(answers.test_taker)}
      bodyVariant="copy"
      continueDisabled={!valid}
      onContinue={handleContinue}
      onBack={onBack}
    >
      <FunnelStudentNameBody name={name} onNameChange={setName} />
    </QuizStepTemplate>
  );
}
