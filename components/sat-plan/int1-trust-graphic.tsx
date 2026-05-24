import { satProgramOutcomes } from "@/lib/site";

function TrustOutcomeRing({ pct }: { pct: number }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const filled = (pct / 100) * circumference;

  return (
    <svg
      className="quiz-step-trust-ring"
      viewBox="0 0 64 64"
      width="64"
      height="64"
      aria-hidden="true"
    >
      <circle
        cx="32"
        cy="32"
        r={radius}
        fill="none"
        stroke="rgba(10, 10, 10, 0.12)"
        strokeWidth="6"
      />
      <circle
        cx="32"
        cy="32"
        r={radius}
        fill="none"
        stroke="var(--tomato)"
        strokeWidth="6"
        strokeLinecap="butt"
        strokeDasharray={`${filled} ${circumference - filled}`}
        transform="rotate(-90 32 32)"
      />
      <text x="32" y="36" textAnchor="middle" className="quiz-step-trust-ring-label">
        {pct}%
      </text>
    </svg>
  );
}

export function Int1TrustGraphic() {
  const {
    plansBuiltCount,
    avgPointsGained,
    programWeeks,
    targetHitRatePct,
    targetHitBefore,
    targetHitEmphasis,
    targetHitAfter
  } = satProgramOutcomes;

  return (
    <div
      className="quiz-step-trust-graphic"
      role="group"
      aria-label={`Program outcomes: ${plansBuiltCount} plus plans built, ${avgPointsGained} average points gained, ${programWeeks} week program, ${targetHitRatePct} percent target hit rate`}
    >
      <div className="quiz-step-trust-card">
        <div className="quiz-step-trust-metrics">
          <div className="quiz-step-trust-metric">
            <p className="quiz-step-trust-metric-value">
              {plansBuiltCount}
              <span className="quiz-step-trust-metric-plus">+</span>
            </p>
            <p className="quiz-step-trust-metric-label">Plans built</p>
          </div>
          <div className="quiz-step-trust-metric quiz-step-trust-metric--accent">
            <p className="quiz-step-trust-metric-value">{avgPointsGained}</p>
            <p className="quiz-step-trust-metric-label">Avg pts gained</p>
          </div>
          <div className="quiz-step-trust-metric">
            <p className="quiz-step-trust-metric-value">{programWeeks}</p>
            <p className="quiz-step-trust-metric-label">{programWeeks}wk</p>
          </div>
        </div>

        <div className="quiz-step-trust-outcome">
          <TrustOutcomeRing pct={targetHitRatePct} />
          <p className="quiz-step-trust-outcome-copy">
            {targetHitBefore}
            <strong>{targetHitEmphasis}</strong>
            {targetHitAfter}
          </p>
        </div>
      </div>
    </div>
  );
}
