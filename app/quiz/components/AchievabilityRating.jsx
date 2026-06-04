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

export function AchievabilityPills({ tierIndex, tierRanges, educational }) {
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

/** Stat bar + rating-pill block, shared by the plan reveal and the share page. */
export function AchievabilityRating({ assessment, label = 'Goal score achievability rating' }) {
  return (
    <div className="qf-goal-assess__callout">
      <AchievabilityStatBar stats={assessment.stats} />
      <p className="qf-meta qf-achv-rating-label">{label}</p>
      <AchievabilityPills
        tierIndex={assessment.tierIndex}
        tierRanges={assessment.tierRanges}
        educational={!assessment.stats.hasKnownGoal}
      />
    </div>
  );
}
