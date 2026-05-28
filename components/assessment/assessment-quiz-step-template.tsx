"use client";

import type { ReactNode } from "react";
import { AssessmentCta } from "@/components/assessment/assessment-cta";
import { AssessmentShell } from "@/components/assessment/assessment-shell";
import {
  bodyClassForVariant,
  headlineTierClassFor,
  type AssessmentQuizBodyVariant,
  type AssessmentQuizHeadlineTier
} from "@/lib/assessment-funnel/quiz-step-layout";
import type { AssessmentStep } from "@/lib/assessment-funnel/types";

type AssessmentQuizStepTemplateProps = {
  stepId: AssessmentStep;
  headline?: string;
  hint?: string | null;
  bodyVariant: AssessmentQuizBodyVariant;
  headlineTier?: AssessmentQuizHeadlineTier;
  children: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  continueLabel?: string;
  onContinue?: (() => void) | null;
  continueDisabled?: boolean;
};

export function AssessmentQuizStepTemplate({
  stepId,
  headline,
  hint = null,
  bodyVariant,
  headlineTier = "hero",
  children,
  showBack = true,
  onBack,
  continueLabel = "Continue",
  onContinue = null,
  continueDisabled = false
}: AssessmentQuizStepTemplateProps) {
  const bodyClassName = bodyClassForVariant(bodyVariant);
  const headlineTierClass = headlineTierClassFor(headlineTier);
  const stepClassName = ["quiz-step", bodyClassName, headlineTierClass].filter(Boolean).join(" ");

  const footerNode = onContinue ? (
    <AssessmentCta
      variant="full"
      label={continueLabel}
      disabled={continueDisabled}
      onClick={onContinue}
    />
  ) : null;

  return (
    <AssessmentShell
      stepId={stepId}
      showBack={showBack}
      onBack={onBack}
      variant="quiz"
      footer={footerNode}
    >
      <div className={stepClassName}>
        {headline ? <h1 className="quiz-step-headline">{headline}</h1> : null}
        {hint ? (
          <p className="quiz-step-hint" id={`quiz-step-hint-${stepId}`}>
            {hint}
          </p>
        ) : null}
        {children}
      </div>
    </AssessmentShell>
  );
}
