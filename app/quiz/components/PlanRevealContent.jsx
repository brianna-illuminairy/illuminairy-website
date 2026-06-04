'use client';

import {
  GOAL_FEASIBILITY_TIER_ORDER,
  achievabilityEyebrow,
  buildGoalAchievabilityFallback,
} from '@/lib/quiz-funnel/goal-achievability';

const AMBITIOUS_INDEX = GOAL_FEASIBILITY_TIER_ORDER.indexOf('ambitious');

function AchievabilityStatBar({ stats }) {
  const cells = [
    { value: stats.scoreGap != null ? `+${stats.scoreGap}` : '—', label: 'Score gap', accent: true },
    { value: stats.testDateShort ?? 'Flexible', label: 'Test date', accent: false },
    { value: stats.daysToTest != null ? String(stats.daysToTest) : '—', label: 'Days to test', accent: true },
    { value: stats.ptsPerWeek != null ? `+${stats.ptsPerWeek}` : '—', label: 'Pts / wk', accent: false },
  ];
  return (
    <div className="qf-achv-stats" aria-hidden="true">
      {cells.map((cell) => (
        <div key={cell.label} className="qf-achv-stats__cell">
          <span className={`qf-achv-stats__value${cell.accent ? ' qf-achv-stats__value--accent' : ''}`}>
            {cell.value}
          </span>
          <span className="qf-achv-stats__label">{cell.label}</span>
        </div>
      ))}
    </div>
  );
}

function AchievabilityPills({ tierIndex, tierRanges, educational }) {
  // No real goal yet → highlight the average student (Ambitious) as the reference point.
  const refIndex = educational ? AMBITIOUS_INDEX : tierIndex;
  return (
    <div className="qf-achv-pills">
      {tierRanges.map((range, index) => {
        const state = index < refIndex ? 'before' : index === refIndex ? 'active' : 'after';
        return (
          <div key={range.tier} className={`qf-achv-pill qf-achv-pill--${state}`}>
            <span className="qf-achv-pill__label">{range.label}</span>
            {educational ? (
              <span className="qf-achv-pill__range">
                {range.maxGain == null
                  ? `+${range.minGain}+`
                  : `+${range.minGain}–${range.maxGain}`}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/**
 * @param {{
 *   plan: import('@/lib/quiz-funnel/plan-reveal').PlanRevealModel,
 *   title?: React.ReactNode,
 *   introNote?: string,
 *   q2?: string,
 * }} props
 */
export function PlanRevealContent({ plan, title, introNote, q2 }) {
  const assessment =
    plan.achievability ?? buildGoalAchievabilityFallback(plan);
  const eyebrow = achievabilityEyebrow(q2 ?? plan.q2);

  return (
    <div className="gap-22 qf-goal-assess">
      <div className="qf-goal-assess__hero">
        <p className="qf-meta qf-goal-assess__eyebrow">{eyebrow}</p>

        {title ?? (
          <>
            <h1 className="qf-h1 qf-goal-assess__headline-l1">{assessment.pointsLine}</h1>
            <p className="qf-h1 qf-goal-assess__headline-l2">
              {assessment.verdictLead}{' '}
              <em>{assessment.verdictEm}</em>.
            </p>
          </>
        )}
        {title}

        <p className="qf-lead">{assessment.stakesLead}</p>
      </div>

      <div className="qf-goal-assess__callout">
        <AchievabilityStatBar stats={assessment.stats} />
        <p className="qf-meta qf-achv-rating-label">Goal score achievability rating</p>
        <AchievabilityPills
          tierIndex={assessment.tierIndex}
          tierRanges={assessment.tierRanges}
          educational={!assessment.stats.hasKnownGoal}
        />
        <p className="qf-caption">{assessment.outcomesMeta}</p>
        {introNote ? <p className="qf-caption">{introNote}</p> : null}
      </div>

      <p className="qf-lead">{assessment.insightParagraph}</p>

      <div className="qf-card wash qf-goal-assess__stat">
        <p className="qf-lead">
          <strong>
            {assessment.hitRatePct}% {assessment.hitRateBefore}
            <em>{assessment.hitRateEmphasis}</em>
            {assessment.hitRateAfter}
          </strong>
        </p>
        <p className="qf-caption">{assessment.varyDisclaimer}</p>
      </div>
    </div>
  );
}
