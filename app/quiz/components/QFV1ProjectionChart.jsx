'use client';

import { useEffect, useMemo, useState } from 'react';

const CW = 320;
const CH = 188;
const PAD_X = 20;
const END_X = 300;
const PLOT_TOP = 22;
const BASELINE_Y = 168;
const GAIN_START_S = 0.45;
const GAIN_STEP_S = 0.44;
const DOT_START_S = 0.2;
const DOT_STEP_S = 0.35;

function plotY(score, current, displayTarget, goalTarget) {
  const top = Math.max(displayTarget, goalTarget ?? displayTarget);
  const gap = Math.max(top - current, 1);
  const pad = Math.max(30, Math.round(gap * 0.08));
  const min = current - pad * 0.35;
  const max = top + pad;
  const span = Math.max(max - min, 1);
  const plotH = BASELINE_Y - PLOT_TOP;
  return PLOT_TOP + plotH - ((score - min) / span) * plotH;
}

function animationTiming(segmentCount) {
  const gainDelays = Array.from(
    { length: segmentCount },
    (_, i) => `${GAIN_START_S + i * GAIN_STEP_S}s`
  );
  const dotDelays = Array.from(
    { length: segmentCount + 1 },
    (_, i) => `${DOT_START_S + i * DOT_STEP_S}s`
  );
  const endDelay = `${GAIN_START_S + segmentCount * GAIN_STEP_S}s`;
  const animDoneMs = Math.round((GAIN_START_S + segmentCount * GAIN_STEP_S + 0.75) * 1000);
  return { gainDelays, dotDelays, endDelay, animDoneMs };
}

/** Cumulative scores at each skill boundary — must end at displayTarget. */
function pointsFromScores(current, displayTarget, skillPts, goalTarget, segments) {
  const segW = (END_X - PAD_X) / segments;
  const xs = Array.from({ length: segments + 1 }, (_, i) => PAD_X + segW * i);
  const scores = [current];
  let running = current;
  for (const pts of skillPts) {
    running += pts;
    scores.push(running);
  }
  scores[scores.length - 1] = displayTarget;
  return xs.map((x, i) => ({
    x,
    y: plotY(scores[i], current, displayTarget, goalTarget),
  }));
}

function pathFromPoints(pts) {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
}

function gainLabelY(y1, y2) {
  const mid = (y1 + y2) / 2;
  const above = mid - 12;
  return above >= PLOT_TOP + 10 ? above : mid + 10;
}

export function QFV1ProjectionChart({
  current,
  displayTarget,
  goalTarget,
  skillPts,
  gapExceedsModeled = false,
  onAnimationComplete,
}) {
  const [playing, setPlaying] = useState(true);
  const segments = skillPts.length;

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const timing = useMemo(() => animationTiming(segments), [segments]);
  const segW = (END_X - PAD_X) / Math.max(segments, 1);

  const geometry = useMemo(() => {
    const pts = pointsFromScores(
      current,
      displayTarget,
      skillPts,
      goalTarget,
      segments
    );
    const linePath = pathFromPoints(pts);
    const areaPath = `${linePath} L ${END_X} ${BASELINE_Y} L ${PAD_X} ${BASELINE_Y} Z`;
    const projectedY = plotY(displayTarget, current, displayTarget, goalTarget);
    const goalY =
      goalTarget != null && goalTarget > displayTarget
        ? plotY(goalTarget, current, displayTarget, goalTarget)
        : null;
    const gains = skillPts.map((gain, i) => {
      const x = PAD_X + segW * (i + 0.5);
      return {
        x,
        y: gainLabelY(pts[i].y, pts[i + 1].y),
        pts: gain,
      };
    });
    const dividers = Array.from({ length: segments - 1 }, (_, i) => PAD_X + segW * (i + 1));
    const startPt = pts[0];
    const targetLabel =
      gapExceedsModeled && goalTarget != null
        ? `GOAL ${goalTarget}`
        : `TARGET ${displayTarget}`;
    return {
      pts,
      linePath,
      areaPath,
      projectedY,
      goalY,
      gains,
      dividers,
      targetLabel,
      /** Left of first skill point (origin), vertically aligned with start dot */
      startScore: { x: PAD_X - 8, y: startPt.y },
    };
  }, [current, displayTarget, goalTarget, skillPts, gapExceedsModeled, segments, segW]);

  useEffect(() => {
    if (reducedMotion) {
      setPlaying(false);
      onAnimationComplete?.();
      return;
    }
    setPlaying(true);
    const done = window.setTimeout(() => {
      setPlaying(false);
      onAnimationComplete?.();
    }, timing.animDoneMs);
    return () => window.clearTimeout(done);
  }, [
    current,
    displayTarget,
    skillPts,
    reducedMotion,
    onAnimationComplete,
    timing.animDoneMs,
  ]);

  const chartClass = [
    'qfp2-chart',
    playing && !reducedMotion ? 'qfp2-chart--playing' : 'qfp2-chart--done',
    reducedMotion ? 'qfp2-chart--reduced' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const skillsClass = [
    'qfp2-skills',
    segments >= 7 ? 'qfp2-skills--7' : segments >= 6 ? 'qfp2-skills--6' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="qf-graph qfp2-wrap">
      <div className={chartClass}>
        <svg
          viewBox={`0 0 ${CW} ${CH}`}
          className="qfp2-svg"
          role="img"
          aria-label={`Score projection from ${current} toward ${displayTarget}`}
        >
          <defs>
            <linearGradient id="qfp2-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2F6E47" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2F6E47" stopOpacity="0" />
            </linearGradient>
          </defs>

          {geometry.goalY != null ? (
            <line
              x1={PAD_X}
              x2={END_X}
              y1={geometry.goalY}
              y2={geometry.goalY}
              stroke="rgba(20,32,46,0.12)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ) : null}

          <line
            x1={PAD_X}
            x2={END_X}
            y1={geometry.projectedY}
            y2={geometry.projectedY}
            stroke="rgba(20,32,46,0.18)"
            strokeWidth="1"
            strokeDasharray="3 3"
            className="qfp2-target-line"
          />
          <text
            x={END_X}
            y={geometry.projectedY}
            className="qfp2-target-label"
            textAnchor="end"
            dominantBaseline="middle"
          >
            {geometry.targetLabel}
          </text>

          {geometry.dividers.map((x) => (
            <line
              key={x}
              x1={x}
              x2={x}
              y1={PLOT_TOP}
              y2={BASELINE_Y - 22}
              stroke="rgba(20,32,46,0.06)"
              strokeWidth="1"
            />
          ))}

          <path className="qfp2-area" d={geometry.areaPath} fill="url(#qfp2-fill)" />
          <path
            className="qfp2-line"
            d={geometry.linePath}
            pathLength="1"
            fill="none"
            stroke="#2F6E47"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {geometry.gains.map((g, i) => (
            <text
              key={i}
              className="qfp2-gain"
              x={g.x}
              y={g.y}
              textAnchor="middle"
              style={
                playing && !reducedMotion
                  ? { animationDelay: timing.gainDelays[i] }
                  : undefined
              }
            >
              +{g.pts}
            </text>
          ))}

          {geometry.pts.slice(0, -1).map((p, i) => (
            <circle
              key={i}
              className={`qfp2-dot${i === 0 ? ' qfp2-dot--start' : ''}`}
              cx={p.x}
              cy={p.y}
              r="4"
              style={
                playing && !reducedMotion
                  ? { animationDelay: timing.dotDelays[i] }
                  : undefined
              }
            />
          ))}

          <g
            className="qfp2-end"
            style={
              playing && !reducedMotion
                ? { animationDelay: timing.endDelay }
                : undefined
            }
          >
            <circle
              cx={END_X}
              cy={geometry.pts[geometry.pts.length - 1].y}
              r="15"
              fill="none"
              stroke="#2F6E47"
              strokeOpacity="0.22"
              strokeWidth="1.5"
            />
            <circle
              cx={END_X}
              cy={geometry.pts[geometry.pts.length - 1].y}
              r="6.5"
              className="qfp2-end__core"
            />
          </g>

          <text
            x={geometry.startScore.x}
            y={geometry.startScore.y}
            className="qfp2-score qfp2-score--start"
            textAnchor="end"
            dominantBaseline="middle"
          >
            {current}
          </text>
        </svg>

        <div className={skillsClass} aria-hidden="true">
          {skillPts.map((_, i) => (
            <span key={i} className="qfp2-skill">
              Skill {i + 1}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
