"use client";

import { useMemo } from "react";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Line } from "@visx/shape";
import { Group } from "@visx/group";
import { GridColumns } from "@visx/grid";
import { LinearGradient } from "@visx/gradient";
import { DATA_VIZ, DATA_VIZ_GRADIENT_ID } from "@/lib/data-viz/tokens";
import { formatSignedDelta } from "@/lib/data-viz/format";
import { dimOpacity, useChartHover } from "@/lib/data-viz/use-chart-hover";
import { ChartDetailRail } from "@/components/data-viz/chart-detail-rail";
import type { SatSkillImpact } from "@/lib/data-viz/sat-types";

type VisxSkillLollipopProps = {
  skills: SatSkillImpact[];
  maxPoints?: number;
  ariaLabel: string;
  height?: number;
  interactive?: boolean;
  detailIdle?: string;
};

const margin = { top: 8, right: 48, bottom: 8, left: 140 };

function LollipopInner({
  width,
  height,
  skills,
  maxPoints,
  ariaLabel,
  interactive,
  detailIdle = "Hover or tap a skill to see detail.",
}: VisxSkillLollipopProps & { width: number; height: number }) {
  const hover = useChartHover<string>();
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const max = maxPoints ?? Math.max(...skills.map((s) => s.points), 1);

  const yScale = useMemo(
    () =>
      scaleBand<string>({
        domain: skills.map((s) => s.id),
        range: [0, innerHeight],
        padding: 0.35,
      }),
    [skills, innerHeight]
  );

  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [0, max],
        range: [0, innerWidth],
        nice: true,
      }),
    [max, innerWidth]
  );

  const activeSkill = skills.find((s) => s.id === hover.activeId);

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
        <Group top={margin.top} left={margin.left}>
          <GridColumns
            scale={xScale}
            height={innerHeight}
            stroke={DATA_VIZ.grid}
            strokeDasharray="2,6"
            numTicks={4}
          />
          {skills.map((skill) => {
            const y = (yScale(skill.id) ?? 0) + (yScale.bandwidth() ?? 0) / 2;
            const xEnd = xScale(skill.points);
            const bandTop = yScale(skill.id) ?? 0;
            const bandH = yScale.bandwidth() ?? 0;
            const dimmed = interactive && hover.isDimmed(skill.id);
            const active = interactive && hover.isActive(skill.id);
            const opacity = dimOpacity(Boolean(dimmed));

            return (
              <Group key={skill.id} opacity={opacity}>
                {interactive ? (
                  <rect
                    className="dv-hit"
                    x={-margin.left}
                    y={bandTop - 4}
                    width={innerWidth + margin.left + margin.right}
                    height={bandH + 8}
                    fill="transparent"
                    onMouseEnter={() => hover.activate(skill.id)}
                    onFocus={() => hover.activate(skill.id)}
                    onBlur={() => hover.clear()}
                    onClick={() => hover.activate(skill.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${skill.name}, ${formatSignedDelta(skill.points)} modeled recoverable`}
                  />
                ) : null}
                <text
                  x={-12}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fill={active ? DATA_VIZ.em : DATA_VIZ.ink}
                  fontSize={13}
                  fontWeight={600}
                  fontFamily="var(--aurora-body, 'Hanken Grotesk', sans-serif)"
                >
                  {skill.name}
                </text>
                <Line
                  from={{ x: 0, y }}
                  to={{ x: xEnd, y }}
                  stroke={DATA_VIZ.line}
                  strokeWidth={1}
                />
                <Line
                  from={{ x: 0, y }}
                  to={{ x: xEnd, y }}
                  stroke={`url(#${DATA_VIZ_GRADIENT_ID})`}
                  strokeWidth={active ? 3 : 2}
                  strokeLinecap="round"
                />
                <circle
                  cx={xEnd}
                  cy={y}
                  r={active ? 7 : 5}
                  fill={DATA_VIZ.em}
                  stroke={active ? DATA_VIZ.glow : "none"}
                  strokeWidth={2}
                />
                <text
                  x={xEnd + 10}
                  y={y}
                  dominantBaseline="middle"
                  fill={DATA_VIZ.em}
                  fontSize={active ? 18 : 16}
                  fontWeight={600}
                  fontFamily="var(--font-display, 'Source Serif 4', Georgia, serif)"
                >
                  {formatSignedDelta(skill.points)}
                </text>
              </Group>
            );
          })}
        </Group>
      </svg>
      {interactive ? (
        <ChartDetailRail
          label={activeSkill ? "Ranked skill" : undefined}
          title={activeSkill?.name}
          body={
            activeSkill
              ? `${activeSkill.note ? `${activeSkill.note} · ` : ""}${formatSignedDelta(activeSkill.points)} modeled recoverable · Results vary`
              : undefined
          }
          idle={detailIdle}
        />
      ) : null}
    </div>
  );
}

export function VisxSkillLollipop({
  skills,
  maxPoints,
  ariaLabel,
  height,
  interactive = true,
  detailIdle,
}: VisxSkillLollipopProps) {
  const plotH = height ?? Math.max(160, skills.length * 36 + 24);
  const railH = interactive ? 56 : 0;
  const h = plotH + railH;

  return (
    <div className="dv-lollipop" style={{ width: "100%", height: h }}>
      <ParentSize>
        {({ width }) =>
          width > 0 ? (
            <LollipopInner
              width={width}
              height={plotH}
              skills={skills}
              maxPoints={maxPoints}
              ariaLabel={ariaLabel}
              interactive={interactive}
              detailIdle={detailIdle}
            />
          ) : null
        }
      </ParentSize>
    </div>
  );
}
