"use client";

import { useMemo } from "react";
import { ParentSize } from "@visx/responsive";
import { scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { DATA_VIZ } from "@/lib/data-viz/tokens";
import { formatScore, formatSignedDelta } from "@/lib/data-viz/format";
import type { SatGapBridgeSegment } from "@/lib/data-viz/sat-types";
import { dimOpacity, useChartHover } from "@/lib/data-viz/use-chart-hover";
import { ChartDetailRail } from "@/components/data-viz/chart-detail-rail";

type VisxGapBridgeProps = {
  current: number;
  target: number;
  segments: SatGapBridgeSegment[];
  remainderLabel?: string;
  ariaLabel: string;
  height?: number;
  interactive?: boolean;
  detailIdle?: string;
};

const margin = { top: 48, right: 16, bottom: 48, left: 16 };
const barH = 22;

const SEGMENT_FILLS = [
  DATA_VIZ.accent,
  DATA_VIZ.aurora,
  "#5a9e7a",
  "#3d8b62",
  DATA_VIZ.em,
];

function BridgeInner({
  width,
  height,
  current,
  target,
  segments,
  remainderLabel = "Other / polish",
  ariaLabel,
  interactive,
  detailIdle = "Hover or tap a segment to see which skill it represents.",
}: VisxGapBridgeProps & { width: number; height: number }) {
  const hover = useChartHover<string>();
  const innerWidth = width - margin.left - margin.right;
  const gap = Math.max(target - current, 1);
  const segmentSum = segments.reduce((a, s) => a + s.points, 0);
  const remainder = Math.max(0, gap - segmentSum);

  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [current, target],
        range: [0, innerWidth],
      }),
    [current, target, innerWidth]
  );

  const xStart = xScale(current);
  const xEnd = xScale(target);
  const totalBarW = xEnd - xStart;
  const barY = margin.top + 18;

  const segmentLayout = segments.map((seg, i) => {
    const priorW = segments
      .slice(0, i)
      .reduce((acc, s) => acc + (s.points / gap) * totalBarW, 0);
    const segW = (seg.points / gap) * totalBarW;
    return { seg, x: xStart + priorW, segW };
  });

  const activeSeg = segments.find((s) => s.id === hover.activeId);

  return (
    <div
      className="dv-chart-interactive"
      onMouseLeave={interactive ? hover.clear : undefined}
    >
      <svg width={width} height={height} role="img" aria-label={ariaLabel}>
      <Group left={margin.left}>
        <text
          x={xStart}
          y={margin.top - 10}
          textAnchor="middle"
          fill={DATA_VIZ.ink}
          fontSize={22}
          fontFamily="var(--font-display, 'Source Serif 4', Georgia, serif)"
          fontWeight={600}
        >
          {formatScore(current)}
        </text>
        <text
          x={xEnd}
          y={margin.top - 10}
          textAnchor="middle"
          fill={DATA_VIZ.em}
          fontSize={22}
          fontFamily="var(--font-display, 'Source Serif 4', Georgia, serif)"
          fontWeight={600}
        >
          ~{formatScore(target)}
        </text>
        <text
          x={(xStart + xEnd) / 2}
          y={barY - 8}
          textAnchor="middle"
          fill={DATA_VIZ.em}
          fontSize={13}
          fontFamily="var(--font-display, 'Source Serif 4', Georgia, serif)"
          fontWeight={600}
        >
          {formatSignedDelta(gap)} total gap
        </text>
        <rect
          x={xStart}
          y={barY}
          width={totalBarW}
          height={barH}
          fill={DATA_VIZ.dim}
          rx={6}
        />
        {segmentLayout.map(({ seg, x, segW }, i) => {
          const dimmed = interactive && hover.isDimmed(seg.id);
          const active = interactive && hover.isActive(seg.id);
          return (
            <Group key={seg.id} opacity={dimOpacity(Boolean(dimmed))}>
              {interactive ? (
                <rect
                  className="dv-hit"
                  x={x}
                  y={barY - 6}
                  width={Math.max(segW, 2)}
                  height={barH + 12}
                  fill="transparent"
                  onMouseEnter={() => hover.activate(seg.id)}
                  onFocus={() => hover.activate(seg.id)}
                  onBlur={() => hover.clear()}
                  onClick={() => hover.activate(seg.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${seg.label}, ${formatSignedDelta(seg.points)} toward goal`}
                />
              ) : null}
              <Bar
                x={x}
                y={barY}
                width={Math.max(segW, 2)}
                height={barH}
                fill={SEGMENT_FILLS[i % SEGMENT_FILLS.length]}
                stroke={active ? DATA_VIZ.ink : "none"}
                strokeWidth={active ? 1.5 : 0}
                pointerEvents="none"
              />
              {segW > 40 ? (
                <text
                  x={x + segW / 2}
                  y={barY + barH / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={DATA_VIZ.surface}
                  fontSize={9}
                  fontWeight={600}
                  fontFamily="var(--font-dm-mono, 'DM Mono', monospace)"
                  pointerEvents="none"
                >
                  {formatSignedDelta(seg.points)}
                </text>
              ) : null}
            </Group>
          );
        })}
        {remainder > 0 ? (
          <text
            x={(xStart + xEnd) / 2}
            y={barY + barH + 20}
            textAnchor="middle"
            fill={DATA_VIZ.muted}
            fontSize={11}
            fontFamily="var(--aurora-body, sans-serif)"
          >
            {remainderLabel} · ~{formatSignedDelta(remainder)} modeled
          </text>
        ) : null}
        <text
          x={xStart}
          y={barY + barH + 36}
          fill={DATA_VIZ.muted}
          fontSize={9}
          fontFamily="var(--font-dm-mono, 'DM Mono', monospace)"
          letterSpacing="0.1em"
        >
          TODAY
        </text>
        <text
          x={xEnd}
          y={barY + barH + 36}
          textAnchor="end"
          fill={DATA_VIZ.muted}
          fontSize={9}
          fontFamily="var(--font-dm-mono, 'DM Mono', monospace)"
          letterSpacing="0.1em"
        >
          GOAL
        </text>
      </Group>
    </svg>
      {interactive ? (
        <ChartDetailRail
          label={activeSeg ? "Gap segment" : undefined}
          title={activeSeg ? `${activeSeg.label} · ${formatSignedDelta(activeSeg.points)}` : undefined}
          body={
            activeSeg
              ? `Modeled share of the ${formatSignedDelta(gap)}-point gap · Results vary`
              : undefined
          }
          idle={detailIdle}
        />
      ) : null}
    </div>
  );
}

export function VisxGapBridge(props: VisxGapBridgeProps) {
  const height = props.height ?? 150;
  const railH = props.interactive !== false ? 56 : 0;
  return (
    <div className="dv-bridge" style={{ width: "100%", height: height + railH }}>
      <ParentSize>
        {({ width }) =>
          width > 0 ? <BridgeInner width={width} height={height} {...props} /> : null
        }
      </ParentSize>
    </div>
  );
}
