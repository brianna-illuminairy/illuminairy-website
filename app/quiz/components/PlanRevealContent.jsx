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
