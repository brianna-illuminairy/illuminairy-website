"use client";

import { useMemo } from "react";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { LinearGradient } from "@visx/gradient";
import { DATA_VIZ, DATA_VIZ_GRADIENT_ID } from "@/lib/data-viz/tokens";
import { formatPercent } from "@/lib/data-viz/format";
import { dimOpacity, useChartHover } from "@/lib/data-viz/use-chart-hover";
import { ChartDetailRail } from "@/components/data-viz/chart-detail-rail";

export type TideBand = {
  label: string;
  value: number;
};

export type TideSection = {
  title: string;
  bands: TideBand[];
};

type VisxTideReadoutProps = {
  sections: TideSection[];
  ariaLabel: string;
  height?: number;
  interactive?: boolean;
  detailIdle?: string;
};

const margin = { top: 8, right: 8, bottom: 8, left: 8 };

function bandId(sectionTitle: string, bandLabel: string) {
  return `${sectionTitle}::${bandLabel}`;
}

function TideInner({
  width,
  height,
  sections,
  ariaLabel,
  interactive,
  detailIdle = "Hover or tap a difficulty band for accuracy detail.",
}: VisxTideReadoutProps & { width: number; height: number }) {
  const hover = useChartHover<string>();
  const sectionHeight = (height - margin.top - margin.bottom) / sections.length;

  let activeSection = "";
  let activeBand: TideBand | undefined;
  if (hover.activeId) {
    const [sec, band] = hover.activeId.split("::");
    activeSection = sec;
    activeBand = sections
      .find((s) => s.title === sec)
      ?.bands.find((b) => b.label === band);
  }

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
        {sections.map((section, si) => {
          const top = margin.top + si * sectionHeight;
          const innerH = sectionHeight - 28;
          const innerW = width - margin.left - margin.right - 8;

          const xScale = scaleBand<string>({
            domain: section.bands.map((b) => b.label),
            range: [0, innerW],
            padding: 0.35,
          });

          const barScale = scaleLinear<number>({
            domain: [0, 100],
            range: [0, Math.min(72, innerW / 3 - 12)],
          });

          return (
            <Group key={section.title} top={top} left={margin.left + 4}>
              <text
                x={0}
                y={12}
                fill={DATA_VIZ.muted}
                fontSize={10}
                fontFamily="var(--font-dm-mono, 'DM Mono', monospace)"
                letterSpacing="0.14em"
              >
                {section.title.toUpperCase()}
              </text>
              {section.bands.map((band) => {
                const id = bandId(section.title, band.label);
                const cx = (xScale(band.label) ?? 0) + (xScale.bandwidth() ?? 0) / 2;
                const barW = barScale(band.value);
                const dimmed = interactive && hover.isDimmed(id);
                const active = interactive && hover.isActive(id);
                const opacity = dimOpacity(Boolean(dimmed));

                return (
                  <Group key={band.label} left={cx} opacity={opacity}>
                    {interactive ? (
                      <rect
                        className="dv-hit"
                        x={-40}
                        y={20}
                        width={80}
                        height={56}
                        fill="transparent"
                        onMouseEnter={() => hover.activate(id)}
                        onFocus={() => hover.activate(id)}
                        onBlur={() => hover.clear()}
                        onClick={() => hover.activate(id)}
                        tabIndex={0}
                        role="button"
                        aria-label={`${section.title}, ${band.label}, ${formatPercent(band.value)} correct`}
                      />
                    ) : null}
                    <text
                      x={0}
                      y={36}
                      textAnchor="middle"
                      fill={active ? DATA_VIZ.em : DATA_VIZ.ink}
                      fontSize={active ? 32 : 28}
                      fontFamily="var(--font-display, 'Source Serif 4', Georgia, serif)"
                      fontWeight={600}
                      pointerEvents="none"
                    >
                      {formatPercent(band.value)}
                    </text>
                    <rect
                      x={-36}
                      y={48}
                      width={72}
                      height={3}
                      fill={DATA_VIZ.dim}
                      rx={2}
                      pointerEvents="none"
                    />
                    <Bar
                      x={-barW / 2}
                      y={48}
                      width={barW}
                      height={active ? 4 : 3}
                      fill={`url(#${DATA_VIZ_GRADIENT_ID})`}
                      rx={2}
                      pointerEvents="none"
                    />
                    <text
                      x={0}
                      y={68}
                      textAnchor="middle"
                      fill={active ? DATA_VIZ.em : DATA_VIZ.muted}
                      fontSize={9}
                      fontFamily="var(--font-dm-mono, 'DM Mono', monospace)"
                      letterSpacing="0.12em"
                      pointerEvents="none"
                    >
                      {band.label.toUpperCase()}
                    </text>
                  </Group>
                );
              })}
            </Group>
          );
        })}
      </svg>
      {interactive ? (
        <ChartDetailRail
          label={activeBand ? activeSection : undefined}
          title={activeBand ? `${activeBand.label} · ${formatPercent(activeBand.value)}` : undefined}
          body={
            activeBand
              ? "Share of questions at this difficulty answered correctly on the diagnostic."
              : undefined
          }
          idle={detailIdle}
        />
      ) : null}
    </div>
  );
}

export function VisxTideReadout({
  sections,
  ariaLabel,
  height = 200,
  interactive = true,
  detailIdle,
}: VisxTideReadoutProps) {
  const stableSections = useMemo(() => sections, [sections]);
  const railH = interactive ? 56 : 0;

  return (
    <div className="dv-tide" style={{ width: "100%", height: height + railH }}>
      <ParentSize>
        {({ width }) =>
          width > 0 ? (
            <TideInner
              width={width}
              height={height}
              sections={stableSections}
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
