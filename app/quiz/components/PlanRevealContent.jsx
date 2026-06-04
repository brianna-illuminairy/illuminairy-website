'use client';

import {
  achievabilityEyebrow,
  buildGoalAchievabilityFallback,
} from '@/lib/quiz-funnel/goal-achievability';
import { AchievabilityStatBar, AchievabilityPills } from './AchievabilityRating';

/** Render the stakes lead with one phrase emphasized green. */
function renderStakesLead(text, emphasis) {
  if (!emphasis || !text || !text.includes(emphasis)) return text;
  const idx = text.indexOf(emphasis);
  return (
    <>
      {text.slice(0, idx)}
      <span className="qf-stakes-em">{emphasis}</span>
      {text.slice(idx + emphasis.length)}
    </>
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
          <h1 className="qf-h1" style={{ margin: 0 }}>
            {assessment.pointsLine}
            <br />
            {assessment.verdictLead} <em>{assessment.verdictEm}</em>.
          </h1>
        )}
        {title}

        <p className="qf-lead">{renderStakesLead(assessment.stakesLead, assessment.stakesEmphasis)}</p>
      </div>

      <AchievabilityStatBar stats={assessment.stats} />

      <div className="qf-goal-assess__scale">
        <p className="qf-meta qf-achv-rating-label">Goal score achievability rating</p>
        <AchievabilityPills
          tierIndex={assessment.tierIndex}
          tierRanges={assessment.tierRanges}
          educational={!assessment.stats.hasKnownGoal}
        />
        <p className="qf-meta qf-achv-outcomes-label">{assessment.outcomesMeta}</p>
        {introNote ? <p className="qf-caption">{introNote}</p> : null}
      </div>

      <p className="qf-lead">{assessment.insightParagraph}</p>

      <div className="qf-stat-callout">
        <span className="qf-stat-callout__pct">{assessment.hitRatePct}%</span>
        <p className="qf-stat-callout__text">
          {assessment.hitRateBefore}
          <strong>{assessment.hitRateEmphasis}</strong>
          {assessment.hitRateAfter}
        </p>
      </div>
    </div>
  );
}
