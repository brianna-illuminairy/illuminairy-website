"use client";

import { useEffect, useState } from "react";

export type ContrastBar = {
  points: number;
  label: string;
  fill: string;
  valueColor: string;
  accentLabel?: boolean;
  delayMs?: number;
};

type ContrastBarChartProps = {
  title: string;
  bars: ContrastBar[];
  ariaLabel: string;
  className?: string;
  /** Shorter plot for 390×844 interstitials (default 112). */
  plotHeightPx?: number;
};

const DEFAULT_PLOT_HEIGHT_PX = 112;
const DEFAULT_DELAYS = [80, 220, 360];

const LOW_BAR_COLOR = "var(--tomato)";
const GOOD_BAR_COLOR = "#2f8b55";

export function ContrastBarChart({
  title,
  bars,
  ariaLabel,
  className = "int8-prep-chart",
  plotHeightPx = DEFAULT_PLOT_HEIGHT_PX
}: ContrastBarChartProps) {
  const [animate, setAnimate] = useState(false);
  const maxPoints = Math.max(...bars.map((bar) => bar.points), 1);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const scaleHeight = (points: number) =>
    Math.max(10, Math.round((points / maxPoints) * plotHeightPx));

  return (
    <div
      className={`quiz-step-trust-graphic ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      <div className="quiz-step-trust-card int8-prep-chart__card">
        <p className="int8-prep-chart__title">{title}</p>

        <div className="int8-prep-chart__bars">
          <div className="int8-prep-chart__baseline" aria-hidden />

          {bars.map((bar, index) => {
            const delayMs = bar.delayMs ?? DEFAULT_DELAYS[index] ?? 80 + index * 140;
            const heightPx = scaleHeight(bar.points);
            const barHeight = animate ? heightPx : 0;

            return (
              <div key={bar.label} className="int8-prep-chart__column">
                <div
                  className="int8-prep-chart__bar-slot"
                  style={{ height: plotHeightPx }}
                >
                  <div className="int8-prep-chart__bar-stack">
                    <p
                      className="int8-prep-chart__value"
                      style={{
                        color: bar.valueColor,
                        opacity: animate && barHeight > 0 ? 1 : 0,
                        transition: `opacity 0.35s ease ${delayMs + 180}ms`
                      }}
                    >
                      ~{bar.points}
                    </p>
                    <div
                      className="int8-prep-chart__bar"
                      style={{
                        height: barHeight,
                        background: bar.fill,
                        transition: `height 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms`
                      }}
                    />
                  </div>
                </div>

                <p
                  className={[
                    "int8-prep-chart__label",
                    bar.accentLabel ? "int8-prep-chart__label--accent" : ""
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {bar.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { GOOD_BAR_COLOR, LOW_BAR_COLOR };
