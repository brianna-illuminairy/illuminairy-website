"use client";

import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import type { SatPlanStep } from "@/lib/sat-plan-funnel/types";

type SatPlanChapterStubProps = {
  title: string;
  stepId: SatPlanStep;
  onBack: () => void;
};

export function SatPlanChapterStub({ title, stepId, onBack }: SatPlanChapterStubProps) {
  return (
    <QuizStepTemplate
      stepId={stepId}
      headline={title}
      bodyVariant="copy"
      onBack={onBack}
      continueLabel="← Back"
      onContinue={onBack}
    >
      <p className="quiz-step-eyebrow">Next up</p>
      <p className="quiz-step-copy">
        This screen is not built yet — waiting on your review of the step before it.
      </p>
    </QuizStepTemplate>
  );
}
