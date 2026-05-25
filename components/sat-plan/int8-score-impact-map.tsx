"use client";

import { useEffect, useState } from "react";
import type { Int8ScoreImpactMapCopy } from "@/lib/sat-plan-funnel/int8-prep-comparison-copy";

type Int8ScoreImpactMapProps = {
  map: Int8ScoreImpactMapCopy;
};

export function Int8ScoreImpactMap({ map }: Int8ScoreImpactMapProps) {
  const [animate, setAnimate] = useState(false);
  const maxPoints = Math.max(...map.rows.map((row) => row.points), 1);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className="int8-score-impact-map quiz-step-trust-graphic"
      role="img"
      aria-label={map.ariaLabel}
    >
      <div className="quiz-step-trust-card int8-score-impact-map__card">
        <div className="int8-score-impact-map__header">
          <p className="int8-score-impact-map__title">{map.title}</p>
          <p className="int8-score-impact-map__legend">
            <span className="int8-score-impact-map__legend-swatch" aria-hidden />
            Priority · top 5
          </p>
        </div>

        <ol className="int8-score-impact-map__rows">
          {map.rows.map((row, index) => {
            const widthPct = Math.max(12, Math.round((row.points / maxPoints) * 100));
            const delayMs = 80 + index * 70;

            return (
              <li key={row.rank} className="int8-score-impact-map__row">
                <span className="int8-score-impact-map__rank">{row.rank}</span>
                <div className="int8-score-impact-map__track-wrap">
                  <p className="int8-score-impact-map__label">{row.label}</p>
                  <div className="int8-score-impact-map__track" aria-hidden>
                    <div
                      className="int8-score-impact-map__bar"
                      style={{
                        width: animate ? `${widthPct}%` : "0%",
                        transitionDelay: `${delayMs}ms`
                      }}
                    />
                  </div>
                </div>
                <span className="int8-score-impact-map__pts">+{row.points} pts</span>
              </li>
            );
          })}
        </ol>

        <div className="int8-score-impact-map__footer">
          <span className="int8-score-impact-map__footer-label">Already strong</span>
          <span className="int8-score-impact-map__skipped">
            <span className="int8-score-impact-map__skipped-swatch" aria-hidden />
            Skipped · {map.skippedCount} areas
          </span>
        </div>
      </div>
    </div>
  );
}
