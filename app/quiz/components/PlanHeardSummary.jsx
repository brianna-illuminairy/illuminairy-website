'use client';

import {
  HEARD_SECTION_SKIP_TITLE,
  HEARD_SUMMARY_HEADLINE,
} from '@/lib/quiz-funnel/heard-summary-copy';
import { buildInputGroups } from '@/lib/quiz-funnel/plan-reveal';

function HeardRow({ label, value }) {
  return (
    <div className="qf-heard-summary__row">
      <span className="qf-heard-summary__label">{label}</span>
      <span className="qf-heard-summary__value">{value}</span>
    </div>
  );
}

/**
 * @param {{ answers?: Record<string, unknown> }} props
 */
export function PlanHeardSummary({ answers = {} }) {
  const groups = buildInputGroups(answers);

  return (
    <div className="qf-heard-summary">
      <div className="qf-heard-summary__intro">
        <h1 className="qf-h1" style={{ marginBottom: 0 }}>
          {HEARD_SUMMARY_HEADLINE}
        </h1>
      </div>

      <div className="qf-heard-summary__card">
        {groups.map((group) => {
          const showTitle = group.title && group.title !== HEARD_SECTION_SKIP_TITLE;
          return (
            <div key={group.title} className="qf-heard-summary__block">
              {showTitle ? (
                <p className="qf-heard-summary__section">{group.title}</p>
              ) : null}
              {group.rows.map((row) => (
                <HeardRow key={`${group.title}-${row.label}`} label={row.label} value={row.value} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
