import {
  SHERMEEN_PHASE1_START_SCORE,
  SHERMEEN_PHASE1_TARGET_HIGH,
  SHERMEEN_PLAN_CHART_CAPTION,
  SHERMEEN_PLAN_CHART_POINTS,
  scoreToChartY,
} from "@/lib/shermeen/plan-projection";

export function ShermeenPlanScoreChart() {
  const goalY = scoreToChartY(SHERMEEN_PHASE1_TARGET_HIGH);
  const points = SHERMEEN_PLAN_CHART_POINTS.map((point) => ({
    ...point,
    y: scoreToChartY(point.score),
  }));
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const last = points[points.length - 1];
  const first = points[0];
  const areaPath = `M${first.x},${first.y} ${points
    .slice(1)
    .map((point) => `L${point.x},${point.y}`)
    .join(" ")} L${last.x},300 L${first.x},300 Z`;

  return (
    <>
      <div className="chart">
        <svg viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Phase 1 score projection">
          <line x1="60" y1={goalY} x2="680" y2={goalY} stroke="#C9C0AC" strokeWidth="1" strokeDasharray="5 5" />
          <text x="680" y={goalY - 8} textAnchor="end" fontSize="12" fill="#9a927e" letterSpacing="1">
            PHASE 1 · {SHERMEEN_PHASE1_TARGET_HIGH}
          </text>
          <path d={areaPath} fill="#2F8B5530" />
          <polyline
            points={polyline}
            fill="none"
            stroke="#234F37"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {points.map((point, index) => (
            <circle
              key={point.weekLabel}
              cx={point.x}
              cy={point.y}
              r={index === 0 || index === points.length - 1 ? 5 : 6}
              fill={index === points.length - 1 ? "#234F37" : "#2F8B55"}
            />
          ))}
          <text
            x={first.x - 2}
            y="291"
            fontFamily='var(--font-display, "Source Serif 4"), Georgia, serif'
            fontSize="20"
            fontWeight="600"
            fill="#121A2B"
          >
            {SHERMEEN_PHASE1_START_SCORE}
          </text>
          {points.slice(1).map((point) => (
            <text
              key={`${point.weekLabel}-score`}
              x={point.x}
              y={point.y - (point.x === last.x ? 16 : 14)}
              textAnchor={point.x === last.x ? "end" : "middle"}
              fontFamily={
                point.x === last.x ? 'var(--font-display, "Source Serif 4"), Georgia, serif' : undefined
              }
              fontSize={point.x === last.x ? 22 : 14}
              fontWeight={point.x === last.x ? 600 : 700}
              fill={point.x === last.x ? "#1A4D2F" : "#234F37"}
            >
              {point.scoreLabel}
            </text>
          ))}
          <g fontSize="10" fill="#9a927e" letterSpacing="1" textAnchor="middle">
            {points.map((point) => (
              <text key={`${point.weekLabel}-axis`} x={point.x} y="320">
                {point.weekLabel}
              </text>
            ))}
          </g>
        </svg>
      </div>
      <p className="note">{SHERMEEN_PLAN_CHART_CAPTION}</p>
    </>
  );
}
