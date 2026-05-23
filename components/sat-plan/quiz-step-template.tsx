"use client";

import type { ReactNode } from "react";
import { FunnelCta } from "@/components/sat-plan/funnel-cta";
import { FunnelShell } from "@/components/sat-plan/funnel-shell";
import type { SatPlanStep } from "@/lib/sat-plan-funnel/types";

type QuizStepTemplateProps = {
  stepId: SatPlanStep;
  headline: string;
  hint?: string | null;
  hintId?: string | null;
  children: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  continueLabel?: string;
  onContinue?: (() => void) | null;
  continueDisabled?: boolean;
  footer?: ReactNode | null;
  bodyClassName?: string;
};

export function QuizStepTemplate({
  stepId,
  headline,
  hint = null,
  hintId = null,
  children,
  showBack = true,
  onBack,
  continueLabel = "Continue",
  onContinue = null,
  continueDisabled = false,
  footer = null,
  bodyClassName = ""
}: QuizStepTemplateProps) {
  const resolvedHintId = hintId ?? (hint ? `quiz-step-hint-${stepId}` : null);

  const footerNode =
    footer !== null ? (
      footer
    ) : onContinue ? (
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
      <div className={["quiz-step", bodyClassName].filter(Boolean).join(" ")}>
        <h1 className="quiz-step-headline">{headline}</h1>
        {hint ? (
          <p className="quiz-step-hint" id={resolvedHintId ?? undefined}>
            {hint}
          </p>
        ) : null}
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
