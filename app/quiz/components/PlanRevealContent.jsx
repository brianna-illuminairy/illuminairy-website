'use client';

import {
  achievabilityEyebrow,
  buildGoalAchievabilityFallback,
} from '@/lib/quiz-funnel/goal-achievability';
import { AchievabilityStatBar, AchievabilityPills } from './AchievabilityRating';

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

      <AchievabilityStatBar stats={assessment.stats} />

      <div className="qf-goal-assess__scale">
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

      <div>
        <div className="qf-stat-callout">
          <span className="qf-stat-callout__pct">{assessment.hitRatePct}%</span>
          <p className="qf-stat-callout__text">
            {assessment.hitRateBefore}
            <strong>{assessment.hitRateEmphasis}</strong>
            {assessment.hitRateAfter}
          </p>
        </div>
        <p className="qf-caption" style={{ marginTop: 8 }}>{assessment.varyDisclaimer}</p>
      </div>
    </div>
  );
}
