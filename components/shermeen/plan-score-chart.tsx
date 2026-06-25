import {
  SHERMEEN_PHASE1_START_SCORE,
  SHERMEEN_PHASE1_TARGET_HIGH,
  SHERMEEN_PLAN_CHART_CAPTION,
  SHERMEEN_PLAN_CHART_POINTS,
  scoreToChartY,
} from "@/lib/shermeen/plan-projection";

export function ShermeenPlanScoreChart() {
  const goalY = scoreToChartY(SHERMEEN_PHASE1_TARGET_HIGH);
  const polyline = SHERMEEN_PLAN_CHART_POINTS.map((point) => {
    const y = scoreToChartY(point.score);
    return `${point.x},${y}`;
  }).join(" ");

  return (
    <>
      <svg className="chart" viewBox="0 0 740 320" role="img" aria-label="Phase 1 score projection">
        <line x1="40" y1="280" x2="700" y2="280" stroke="#e6e3da" strokeWidth="1" />
        <line
          x1="40"
          y1={goalY}
          x2="700"
          y2={goalY}
          stroke="#2f6e47"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          opacity="0.55"
        />
        <text x="44" y={goalY - 8} fill="#2f6e47" fontSize="11" fontWeight="600">
          PHASE 1 · {SHERMEEN_PHASE1_TARGET_HIGH}
        </text>
        <polyline
          points={polyline}
          fill="none"
          stroke="#2f6e47"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {SHERMEEN_PLAN_CHART_POINTS.map((point) => {
          const y = scoreToChartY(point.score);
          return (
            <g key={point.weekLabel}>
              <circle cx={point.x} cy={y} r="5" fill="#fff" stroke="#2f6e47" strokeWidth="2" />
              <text x={point.x} y={y - 14} textAnchor="middle" fill="#1a4d2f" fontSize="13" fontWeight="600">
                {point.scoreLabel}
              </text>
              <text x={point.x} y="304" textAnchor="middle" fill="rgba(18,26,43,0.55)" fontSize="10">
                {point.weekLabel}
              </text>
            </g>
          );
        })}
        <text x="44" y="296" fill="rgba(18,26,43,0.55)" fontSize="10">
          {SHERMEEN_PHASE1_START_SCORE}
        </text>
      </svg>
      <p className="chart-caption">{SHERMEEN_PLAN_CHART_CAPTION}</p>
    </>
  );
}
