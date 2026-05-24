"use client";

import type { ReactNode } from "react";
import { SAT_PLAN_STEPS } from "@/lib/sat-plan-funnel/state";
import type { SatPlanStep } from "@/lib/sat-plan-funnel/types";

type FunnelShellProps = {
  stepId: SatPlanStep;
  children: ReactNode;
  footer?: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  variant?: "quiz";
};

export function FunnelShell({
  stepId,
  children,
  footer = null,
  showBack = false,
  onBack,
  variant = "quiz"
}: FunnelShellProps) {
  const meta = SAT_PLAN_STEPS[stepId] ?? { progress: 0, label: null };
  const progress = meta.progress ?? 0;

  return (
    <div
      className={["funnel-shell", `funnel-shell--${variant}`].filter(Boolean).join(" ")}
    >
      <header className="funnel-header">
        {showBack ? (
          <div className="funnel-back-row">
            <button type="button" className="funnel-back" onClick={onBack} aria-label="Back">
              ← Back
            </button>
          </div>
        ) : null}
        <div className="funnel-brand-row">
          <span className="funnel-word">illuminairy</span>
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
        <p className={`funnel-step-label${meta.labelUpper ? " funnel-step-label--qnum" : ""}`}>
          {meta.labelUpper ? meta.label.toUpperCase() : meta.label}
        </p>
      ) : (
        <p className="funnel-step-label funnel-step-label--qnum funnel-step-label--reserved" aria-hidden="true">
          &nbsp;
        </p>
      )}

      <main className="funnel-main">
        <div className="funnel-quiz-body">
          {children}
          {footer ? <footer className="funnel-footer">{footer}</footer> : null}
        </div>
      </main>
    </div>
  );
}
