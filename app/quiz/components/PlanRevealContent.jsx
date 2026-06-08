'use client';

import { resolveGoalAchievabilityForDisplay } from '@/lib/quiz-funnel/goal-achievability';
import { AchievabilityPlanBlock } from './AchievabilityRating';
import { AchievabilityInputChips } from './AchievabilityInputChips';

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
 *   answers?: Record<string, unknown>,
 *   onEditAnswer?: (answerKey: string, value: string) => void,
 * }} props
 */
export function PlanRevealContent({ plan, title, introNote, q2, answers, onEditAnswer }) {
  const assessment = resolveGoalAchievabilityForDisplay(plan);
  return (
    <div className="gap-14 qf-goal-assess">
      <div className="qf-goal-assess__hero">
        {title ?? (
          <h1 className="qf-h1" style={{ margin: 0 }}>
            {assessment.pointsLine}
            <br />
            {assessment.verdictLead} <em>{assessment.verdictEm}</em>.
          </h1>
        )}

        <p className="qf-lead qf-goal-assess__stakes">{renderStakesLead(assessment.stakesLead, assessment.stakesEmphasis)}</p>

        {answers && onEditAnswer ? (
          <AchievabilityInputChips
            answers={answers}
            startingScoreLabel={assessment.startingScoreLabel}
            onEditAnswer={onEditAnswer}
          />
        ) : null}
      </div>

      <AchievabilityPlanBlock
        stats={assessment.stats}
        startingScoreLabel={assessment.startingScoreLabel}
        tierIndex={assessment.tierIndex}
        tierRanges={assessment.tierRanges}
        educational
        outcomesMeta={assessment.outcomesMeta}
      />

      <div className="qf-stat-callout qf-goal-assess__hit-rate">
        <span className="qf-stat-callout__pct">{assessment.hitRatePct}%</span>
        <p className="qf-stat-callout__text">
          {assessment.hitRateBefore}
          <strong>{assessment.hitRateEmphasis}</strong>
          {assessment.hitRateAfter}
        </p>
      </div>

      {introNote ? <p className="qf-caption">{introNote}</p> : null}
    </div>
  );
}
