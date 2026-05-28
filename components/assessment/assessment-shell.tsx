"use client";

import type { ReactNode } from "react";
import { AssessmentLogo } from "@/components/assessment/assessment-logo";
import { ASSESSMENT_STEPS } from "@/lib/assessment-funnel/state";
import type { AssessmentStep } from "@/lib/assessment-funnel/types";

type AssessmentShellProps = {
  stepId: AssessmentStep;
  children: ReactNode;
  footer?: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  variant?: "quiz";
};

export function AssessmentShell({
  stepId,
  children,
  footer = null,
  showBack = false,
  onBack,
  variant = "quiz"
}: AssessmentShellProps) {
  const meta = ASSESSMENT_STEPS[stepId] ?? { progress: 0, label: null };
  const progress = meta.progress ?? 0;

  return (
    <div className={["funnel-shell", `funnel-shell--${variant}`].filter(Boolean).join(" ")}>
      <header className="funnel-header">
        <div className="funnel-header-row">
          {showBack ? (
            <button type="button" className="funnel-back" onClick={onBack}>
              ← Back
            </button>
          ) : (
            <span className="funnel-header-spacer" aria-hidden />
          )}
          <AssessmentLogo compact size="sm" />
        </div>
      </header>

      {progress > 0 ? (
        <div
          className="funnel-progress"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="funnel-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      ) : null}

      {meta.label ? (
        <p className="funnel-step-label">{meta.label.toUpperCase()}</p>
      ) : (
        <p className="funnel-step-label" aria-hidden="true">
          &nbsp;
        </p>
      )}

      <main className="funnel-main">
        <div className="funnel-quiz-body">{children}</div>
      </main>

      {footer ? <div className="funnel-dock">{footer}</div> : null}
    </div>
  );
}
