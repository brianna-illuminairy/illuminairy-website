'use client';

import { GOAL_FEASIBILITY_TIER_ORDER } from '@/lib/quiz-funnel/goal-achievability';

const AMBITIOUS_INDEX = GOAL_FEASIBILITY_TIER_ORDER.indexOf('ambitious');

export function AchievabilityStatBar({ stats }) {
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

export function AchievabilityPills({
  tierIndex,
  tierRanges,
  educational,
}) {
  const refIndex = educational ? AMBITIOUS_INDEX : tierIndex;

  return (
    <div className="qf-achv-scale">
      <div className="qf-achv-pills" role="list" aria-label="Score gain by effort tier">
        {tierRanges.map((range, index) => {
          const state = index < refIndex ? 'before' : index === refIndex ? 'active' : 'after';
          return (
            <div key={range.tier} className="qf-achv-pill-col" role="listitem">
              <div className={`qf-achv-pill qf-achv-pill--${state}`}>
                <span className="qf-achv-pill__label">{range.label}</span>
              </div>
              <span className="qf-achv-pill__pace-under">+{range.ptsPerWeek}/wk</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Shared achievability block — plan reveal, v1 plan card, Sophia example, share page.
 * Pills live in their own container; disclaimer sits outside.
 */
export function AchievabilityPlanBlock({
  stats,
  startingScoreLabel,
  startingScoreNote,
  tierIndex,
  tierRanges,
  educational = true,
  outcomesMeta,
  projectedRangeLine,
  ratingLabel = 'Goal score achievability rating',
}) {
  return (
    <div className="qf-goal-assess__callout">
      <AchievabilityStatBar stats={stats} />
      {startingScoreNote ? (
        <p className="qf-caption qf-achv-start-note">{startingScoreNote}</p>
      ) : null}
      <div className="qf-goal-assess__scale">
        <p className="qf-meta qf-achv-rating-label">{ratingLabel}</p>
        <AchievabilityPills
          tierIndex={tierIndex}
          tierRanges={tierRanges}
          educational={educational}
        />
        {outcomesMeta ? (
          <p className="qf-achv-outcomes-label">{outcomesMeta}</p>
        ) : null}
      </div>
      {projectedRangeLine ? (
        <p className="qf-caption qf-achv-range-line">{projectedRangeLine}</p>
      ) : null}
    </div>
  );
}

/** Stat bar + rating-pill block, shared by the plan reveal and the share page. */
export function AchievabilityRating({ assessment, label = 'Goal score achievability rating' }) {
  return (
    <div className="qf-goal-assess__callout">
      <AchievabilityPlanBlock
        stats={assessment.stats}
        startingScoreLabel={assessment.startingScoreLabel}
        tierIndex={assessment.tierIndex}
        tierRanges={assessment.tierRanges}
        educational={!assessment.stats.hasKnownGoal}
        ratingLabel={label}
      />
    </div>
  );
}
