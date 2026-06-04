'use client';

import {
  PLAN_HANDOFF_CALL_BODY,
  PLAN_HANDOFF_CALL_DURATION,
  PLAN_HANDOFF_CALL_TITLE,
  PLAN_HANDOFF_EYEBROW,
  PLAN_HANDOFF_HEADLINE,
  PLAN_HANDOFF_SUBHEADLINE,
} from '@/lib/quiz-funnel/plan-handoff-copy';

/**
 * @param {{ answers?: Record<string, unknown> }} props
 */
export function QFPlanHandoff({ answers: _answers = {} }) {
  return (
    <div className="gap-22 qf-plan-handoff">
      <p className="qf-meta qf-plan-handoff__eyebrow">
        <span className="qf-plan-handoff__check" aria-hidden="true">
          ✓
        </span>{' '}
        {PLAN_HANDOFF_EYEBROW}
      </p>

      <h1 className="qf-h1" style={{ marginBottom: 0 }}>
        {PLAN_HANDOFF_HEADLINE}
      </h1>

      <p className="qf-lead" style={{ margin: 0 }}>
        {PLAN_HANDOFF_SUBHEADLINE}
      </p>

      <div className="qf-card wash qf-plan-handoff__call">
        <div className="qf-plan-handoff__call-head">
          <span className="qf-plan-handoff__call-title">{PLAN_HANDOFF_CALL_TITLE}</span>
          <span className="qf-meta qf-plan-handoff__call-duration">
            {PLAN_HANDOFF_CALL_DURATION}
          </span>
        </div>

        <p className="qf-plan-handoff__call-body">{PLAN_HANDOFF_CALL_BODY}</p>
      </div>
    </div>
  );
}
