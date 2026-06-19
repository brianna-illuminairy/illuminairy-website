"use client";

import { useMemo } from "react";
import { ParentSize } from "@visx/responsive";
import { scaleLinear, scalePoint } from "@visx/scale";
import { LinePath, AreaClosed, Circle } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { LinearGradient } from "@visx/gradient";
import { GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { DATA_VIZ, DATA_VIZ_AREA_GRADIENT_ID, DATA_VIZ_GRADIENT_ID } from "@/lib/data-viz/tokens";
import { formatScore, formatSignedDelta } from "@/lib/data-viz/format";
import { dimOpacity, useChartHover } from "@/lib/data-viz/use-chart-hover";
import { ChartDetailRail } from "@/components/data-viz/chart-detail-rail";

export type HorizonPathPoint = {
  id: string;
  label: string;
  score: number;
};

type VisxHorizonPathProps = {
  points: HorizonPathPoint[];
  stretchGoal?: number;
  ariaLabel: string;
  height?: number;
  interactive?: boolean;
  detailIdle?: string;
};

const defaultMargin = { top: 36, right: 24, bottom: 44, left: 8 };

function HorizonPathInner({
  width,
  height,
  points,
  stretchGoal,
  ariaLabel,
  interactive,
  detailIdle = "Hover or tap a checkpoint for score detail.",
}: VisxHorizonPathProps & { width: number; height: number }) {
  const hover = useChartHover<string>();
  const innerHeight = height - defaultMargin.top - defaultMargin.bottom;
  const innerWidth = width - defaultMargin.left - defaultMargin.right;

  const scores = points.map((p) => p.score);
  const yMin = Math.min(...scores, stretchGoal ?? Infinity) - 40;
  const yMax = Math.max(...scores, stretchGoal ?? -Infinity) + 30;

  const xScale = useMemo(
    () =>
      scalePoint<string>({
        domain: points.map((p) => p.id),
        range: [0, innerWidth],
        padding: 0.12,
      }),
    [points, innerWidth]
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [yMin, yMax],
        range: [innerHeight, 0],
        nice: true,
      }),
    [yMin, yMax, innerHeight]
  );

  const pathData = points.map((p) => ({
    x: xScale(p.id) ?? 0,
    y: yScale(p.score),
    score: p.score,
    label: p.label,
  }));

  const last = points[points.length - 1];
  const activePoint = points.find((p) => p.id === hover.activeId);
  const startScore = points[0]?.score ?? 0;

  return (
    <div
      className="dv-chart-interactive"
      onMouseLeave={interactive ? hover.clear : undefined}
    >
      <svg width={width} height={height} role="img" aria-label={ariaLabel}>
      <LinearGradient
        id={DATA_VIZ_GRADIENT_ID}
        from={DATA_VIZ.accent}
        to={DATA_VIZ.em}
        vertical={false}
      />
      <LinearGradient
        id={DATA_VIZ_AREA_GRADIENT_ID}
        from={DATA_VIZ.aurora}
        to={DATA_VIZ.field}
        fromOpacity={0.28}
        toOpacity={0.02}
      />
      <Group top={defaultMargin.top} left={defaultMargin.left}>
        <GridRows
          scale={yScale}
          width={innerWidth}
          stroke={DATA_VIZ.grid}
          strokeDasharray="2,6"
          numTicks={3}
        />
        {stretchGoal != null ? (
          <>
            <line
              x1={0}
              x2={innerWidth}
              y1={yScale(stretchGoal)}
              y2={yScale(stretchGoal)}
              stroke={DATA_VIZ.silver}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <text
              x={innerWidth}
              y={yScale(stretchGoal) - 8}
              textAnchor="end"
              fill={DATA_VIZ.muted}
              fontSize={10}
              fontFamily="var(--font-dm-mono, 'DM Mono', monospace)"
              letterSpacing="0.12em"
            >
              STRETCH {formatScore(stretchGoal)}
            </text>
          </>
        ) : null}
        <AreaClosed
          data={pathData}
          x={(d) => d.x}
          y={(d) => d.y}
          yScale={yScale}
          curve={curveMonotoneX}
          fill={`url(#${DATA_VIZ_AREA_GRADIENT_ID})`}
        />
        <LinePath
          data={pathData}
          x={(d) => d.x}
          y={(d) => d.y}
          curve={curveMonotoneX}
          stroke={`url(#${DATA_VIZ_GRADIENT_ID})`}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {pathData.map((d, i) => {
          const id = points[i].id;
          const dimmed = interactive && hover.isDimmed(id);
          const active = interactive && hover.isActive(id);
          const opacity = dimOpacity(Boolean(dimmed));
          const r = active ? 9 : i === pathData.length - 1 ? 6 : 5;

          return (
            <Group key={id} opacity={opacity}>
              {interactive ? (
                <Circle
                  className="dv-hit"
                  cx={d.x}
                  cy={d.y}
                  r={16}
                  fill="transparent"
                  onMouseEnter={() => hover.activate(id)}
                  onFocus={() => hover.activate(id)}
                  onBlur={() => hover.clear()}
                  onClick={() => hover.activate(id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${points[i].label}, score ${formatScore(d.score)}`}
                />
              ) : null}
              <Circle
                cx={d.x}
                cy={d.y}
                r={r}
                fill={i === 0 ? DATA_VIZ.accent : DATA_VIZ.em}
                stroke={active ? DATA_VIZ.glow : DATA_VIZ.surface}
                strokeWidth={active ? 3 : 2}
                pointerEvents="none"
              />
            </Group>
          );
        })}
        {pathData.map((d, i) => {
          const id = points[i].id;
          const dimmed = interactive && hover.isDimmed(id);
          const active = interactive && hover.isActive(id);
          return (
            <text
              key={`${id}-score`}
              x={d.x}
              y={d.y - 14}
              textAnchor="middle"
              fill={active || i === pathData.length - 1 ? DATA_VIZ.em : DATA_VIZ.ink}
              fontSize={active ? 22 : i === pathData.length - 1 ? 20 : 16}
              fontFamily="var(--font-display, 'Source Serif 4', Georgia, serif)"
              fontWeight={600}
              opacity={dimOpacity(Boolean(dimmed))}
              pointerEvents="none"
            >
              {i === pathData.length - 1 ? `~${formatScore(d.score)}` : formatScore(d.score)}
            </text>
          );
        })}
        {pathData.map((d, i) => (
          <text
            key={`${points[i].id}-lbl`}
            x={d.x}
            y={innerHeight + 28}
            textAnchor="middle"
            fill={DATA_VIZ.muted}
            fontSize={10}
            fontFamily="var(--font-dm-mono, 'DM Mono', monospace)"
            letterSpacing="0.1em"
          >
            {points[i].label}
          </text>
        ))}
        {pathData.length >= 2 ? (
          <text
            x={(pathData[0].x + pathData[pathData.length - 1].x) / 2}
            y={(pathData[0].y + pathData[pathData.length - 1].y) / 2 - 6}
            textAnchor="middle"
            fill={DATA_VIZ.em}
            fontSize={14}
            fontFamily="var(--font-display, 'Source Serif 4', Georgia, serif)"
            fontWeight={600}
          >
            {formatSignedDelta(last.score - points[0].score)}
          </text>
        ) : null}
      </Group>
    </svg>
      {interactive ? (
        <ChartDetailRail
          label={activePoint ? "Checkpoint" : undefined}
          title={
            activePoint
              ? `${activePoint.label} · ${formatScore(activePoint.score)}`
              : undefined
          }
          body={
            activePoint
              ? `${formatSignedDelta(activePoint.score - startScore)} from start · illustrative projection · Results vary`
              : undefined
          }
          idle={detailIdle}
        />
      ) : null}
    </div>
  );
}

export function VisxHorizonPath({
  points,
  stretchGoal,
  ariaLabel,
  height = 220,
  interactive = true,
  detailIdle,
}: VisxHorizonPathProps) {
  const railH = interactive ? 56 : 0;
  return (
    <div className="dv-horizon" style={{ width: "100%", height: height + railH }}>
      <ParentSize>
        {({ width }) =>
          width > 0 ? (
            <HorizonPathInner
              width={width}
              height={height}
              points={points}
              stretchGoal={stretchGoal}
              ariaLabel={ariaLabel}
            />
          ) : null
        }
      </ParentSize>
    </div>
  );
}
