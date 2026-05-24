"use client";

import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import type { SatPlanStep } from "@/lib/sat-plan-funnel/types";

type SatPlanFunnelStubProps = {
  stepId: SatPlanStep;
  title: string;
  body?: string;
  onBack: () => void;
  onContinue: () => void;
  continueLabel?: string;
};

export function SatPlanFunnelStub({
  stepId,
  title,
  body = "Placeholder — full copy and UI ship next. Continue to walk the end-to-end funnel.",
  onBack,
  onContinue,
  continueLabel = "Continue"
}: SatPlanFunnelStubProps) {
  return (
    <QuizStepTemplate
      stepId={stepId}
      headline={title}
      bodyVariant="copy"
      onBack={onBack}
      onContinue={onContinue}
      continueLabel={continueLabel}
    >
      <p className="quiz-step-eyebrow">Coming soon</p>
      <p className="quiz-step-copy">{body}</p>
    </QuizStepTemplate>
  );
}

/** @deprecated Use SatPlanFunnelStub with onContinue for forward navigation. */
export function SatPlanChapterStub({
  title,
  stepId,
  onBack
}: {
  title: string;
  stepId: SatPlanStep;
  onBack: () => void;
}) {
  return (
    <SatPlanFunnelStub
      stepId={stepId}
      title={title}
      onBack={onBack}
      onContinue={onBack}
      continueLabel="← Back"
    />
  );
}
