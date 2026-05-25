"use client";

import type { ReactNode } from "react";
import { FunnelCta } from "@/components/sat-plan/funnel-cta";
import { FunnelShell } from "@/components/sat-plan/funnel-shell";
import {
  bodyClassForVariant,
  headlineTierClassFor,
  type QuizStepBodyVariant,
  type QuizStepHeadlineTier
} from "@/lib/sat-plan-funnel/quiz-step-layout";
import type { SatPlanStep } from "@/lib/sat-plan-funnel/types";

type QuizStepTemplateProps = {
  stepId: SatPlanStep;
  headline?: string;
  headlineNode?: ReactNode;
  hint?: string | null;
  hintId?: string | null;
  bodyVariant: QuizStepBodyVariant;
  /** `copy` interstitials: `hero` (default) or `compact` when a tall graphic needs a shorter title. */
  headlineTier?: QuizStepHeadlineTier;
  children: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  continueLabel?: string;
  onContinue?: (() => void) | null;
  continueDisabled?: boolean;
};

export function QuizStepTemplate({
  stepId,
  headline,
  headlineNode,
  hint = null,
  hintId = null,
  bodyVariant,
  headlineTier = "hero",
  children,
  showBack = true,
  onBack,
  continueLabel = "Continue",
  onContinue = null,
  continueDisabled = false
}: QuizStepTemplateProps) {
  const resolvedHintId = hintId ?? (hint ? `quiz-step-hint-${stepId}` : null);
  const bodyClassName = bodyClassForVariant(bodyVariant);
  const headlineTierClass = headlineTierClassFor(headlineTier);
  const stepClassName = ["quiz-step", bodyClassName, headlineTierClass]
    .filter(Boolean)
    .join(" ");

  const footerNode = onContinue ? (
    <div className="cta-wrap cta-wrap--quiz">
      <FunnelCta
        label={continueLabel}
        disabled={continueDisabled}
        onClick={onContinue}
      />
    </div>
  ) : null;

  return (
    <FunnelShell
      stepId={stepId}
      showBack={showBack}
      onBack={onBack}
      variant="quiz"
      footer={footerNode}
    >
      <div className={stepClassName}>
        <h1 className="quiz-step-headline">
          {headlineNode ??
            headline ??
            null}
        </h1>
        {hint ? (
          <p className="quiz-step-hint" id={resolvedHintId ?? undefined}>
            {hint}
          </p>
        ) : (
          <p className="quiz-step-hint quiz-step-hint--reserved" aria-hidden="true" />
        )}
        <div
          className="quiz-step-body"
          aria-describedby={hint && resolvedHintId ? resolvedHintId : undefined}
        >
          {children}
        </div>
      </div>
    </FunnelShell>
  );
}
