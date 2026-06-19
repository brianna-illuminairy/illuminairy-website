"use client";

import { useMemo } from "react";
import { ParentSize } from "@visx/responsive";
import { scaleLinear } from "@visx/scale";
import { Line } from "@visx/shape";
import { Group } from "@visx/group";
import { DATA_VIZ, DATA_VIZ_GRADIENT_ID } from "@/lib/data-viz/tokens";
import { formatScore, formatSignedDelta } from "@/lib/data-viz/format";
import { LinearGradient } from "@visx/gradient";

type VisxScoreDumbbellProps = {
  current: number;
  target: number;
  currentLabel?: string;
  targetLabel?: string;
  domain?: [number, number];
  ariaLabel: string;
  height?: number;
};

const margin = { top: 56, right: 16, bottom: 36, left: 16 };

function DumbbellInner({
  width,
  height,
  current,
  target,
  currentLabel = "Today",
  targetLabel = "Goal",
  domain = [1100, 1600],
  ariaLabel,
}: VisxScoreDumbbellProps & { width: number; height: number }) {
  const innerWidth = width - margin.left - margin.right;
  const railY = margin.top + 24;

  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        domain,
        range: [0, innerWidth],
      }),
    [domain, innerWidth]
  );

  const x0 = xScale(current);
  const x1 = xScale(target);
  const gap = target - current;

  return (
    <svg width={width} height={height} role="img" aria-label={ariaLabel}>
      <LinearGradient
        id={DATA_VIZ_GRADIENT_ID}
        from={DATA_VIZ.accent}
        to={DATA_VIZ.em}
        vertical={false}
      />
      <Group left={margin.left}>
        <text
          x={x0}
          y={margin.top - 22}
          textAnchor="middle"
          fill={DATA_VIZ.muted}
          fontSize={10}
          fontFamily="var(--font-dm-mono, 'DM Mono', monospace)"
          letterSpacing="0.12em"
        >
          {currentLabel.toUpperCase()}
        </text>
        <text
          x={x0}
          y={margin.top - 2}
          textAnchor="middle"
          fill={DATA_VIZ.ink}
          fontSize={28}
          fontFamily="var(--font-display, 'Source Serif 4', Georgia, serif)"
          fontWeight={600}
        >
          {formatScore(current)}
        </text>
        <text
          x={x1}
          y={margin.top - 22}
          textAnchor="middle"
          fill={DATA_VIZ.muted}
          fontSize={10}
          fontFamily="var(--font-dm-mono, 'DM Mono', monospace)"
          letterSpacing="0.12em"
        >
          {targetLabel.toUpperCase()}
        </text>
        <text
          x={x1}
          y={margin.top - 2}
          textAnchor="middle"
          fill={DATA_VIZ.em}
          fontSize={28}
          fontFamily="var(--font-display, 'Source Serif 4', Georgia, serif)"
          fontWeight={600}
        >
          ~{formatScore(target)}
        </text>
        <Line
          from={{ x: 0, y: railY }}
          to={{ x: innerWidth, y: railY }}
          stroke={DATA_VIZ.line}
          strokeWidth={1}
        />
        <Line
          from={{ x: x0, y: railY }}
          to={{ x: x1, y: railY }}
          stroke={`url(#${DATA_VIZ_GRADIENT_ID})`}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <text
          x={(x0 + x1) / 2}
          y={railY}
          textAnchor="middle"
          dy={5}
          fill={DATA_VIZ.em}
          fontSize={18}
          fontFamily="var(--font-display, 'Source Serif 4', Georgia, serif)"
          fontWeight={600}
        >
          {formatSignedDelta(gap)}
        </text>
        <circle cx={x0} cy={railY} r={7} fill={DATA_VIZ.accent} stroke={DATA_VIZ.surface} strokeWidth={2} />
        <circle cx={x1} cy={railY} r={7} fill={DATA_VIZ.em} stroke={DATA_VIZ.surface} strokeWidth={2} />
        <text
          x={0}
          y={height - margin.bottom + 14}
          fill={DATA_VIZ.muted}
          fontSize={9}
          fontFamily="var(--font-dm-mono, 'DM Mono', monospace)"
        >
          {formatScore(domain[0])}
        </text>
        <text
          x={innerWidth}
          y={height - margin.bottom + 14}
          textAnchor="end"
          fill={DATA_VIZ.muted}
          fontSize={9}
          fontFamily="var(--font-dm-mono, 'DM Mono', monospace)"
        >
          {formatScore(domain[1])}
        </text>
      </Group>
    </svg>
  );
}

export function VisxScoreDumbbell(props: VisxScoreDumbbellProps) {
  const height = props.height ?? 140;
  return (
    <div className="dv-dumbbell" style={{ width: "100%", height }}>
      <ParentSize>
        {({ width }) =>
          width > 0 ? <DumbbellInner width={width} height={height} {...props} /> : null
        }
      </ParentSize>
    </div>
  );
}
