'use client';

import {
  achievabilityEyebrow,
  buildGoalAchievabilityFallback,
} from '@/lib/quiz-funnel/goal-achievability';
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

        <p className="qf-lead">{renderStakesLead(assessment.stakesLead, assessment.stakesEmphasis)}</p>
      </div>

      {answers && onEditAnswer ? (
        <AchievabilityInputChips
          answers={answers}
          startingScoreLabel={assessment.startingScoreLabel}
          onEditAnswer={onEditAnswer}
        />
      ) : null}

      <AchievabilityPlanBlock
        stats={assessment.stats}
        startingScoreLabel={assessment.startingScoreLabel}
        startingScoreNote={assessment.startingScoreNote}
        tierIndex={assessment.tierIndex}
        tierRanges={assessment.tierRanges}
        educational
        outcomesMeta={assessment.outcomesMeta}
        projectedRangeLine={assessment.projectedRangeLine}
      />

      {introNote ? <p className="qf-caption">{introNote}</p> : null}

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
