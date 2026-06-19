"use client";

import { Group } from "@visx/group";
import { LinearGradient } from "@visx/gradient";
import { ParentSize } from "@visx/responsive";
import { scaleLinear } from "@visx/scale";
import { useMemo } from "react";
import { ChartDetailRail } from "@/components/data-viz/chart-detail-rail";
import { formatScore, formatSignedDelta } from "@/lib/data-viz/format";
import { DATA_VIZ, DATA_VIZ_GRADIENT_ID } from "@/lib/data-viz/tokens";
import { dimOpacity, useChartHover } from "@/lib/data-viz/use-chart-hover";

export type SpectrumTier = {
  id: string;
  label: string;
  ptsPerWeek: number;
  score: number;
};

type VisxSpectrumBandProps = {
  tiers: SpectrumTier[];
  activeTierId: string;
  markerPosition?: number;
  ariaLabel: string;
  height?: number;
  interactive?: boolean;
  detailIdle?: string;
};

function SpectrumInner({
  width,
  height,
  tiers,
  activeTierId,
  markerPosition,
  ariaLabel,
  interactive,
  detailIdle = "Hover or tap a tier to compare effort and projected score.",
}: VisxSpectrumBandProps & { width: number; height: number }) {
  const hover = useChartHover<string>();
  const innerWidth = width - 32;
  const bandY = 36;
  const activeIndex = tiers.findIndex((t) => t.id === activeTierId);
  const markerPct =
    markerPosition ??
    (activeIndex >= 0 ? (activeIndex + 0.5) / tiers.length : 0.5);

  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [0, 1],
        range: [0, innerWidth],
      }),
    [innerWidth]
  );

  const markerX = xScale(markerPct);
  const activeTier = tiers.find((t) => t.id === hover.activeId);

  return (
    <div
      className="dv-chart-interactive"
      onMouseLeave={interactive ? hover.clear : undefined}
    >
      <svg width={width} height={height} role="img" aria-label={ariaLabel}>
      <defs>
        <linearGradient id="dv-spectrum-fill" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={DATA_VIZ.accent} stopOpacity={0.12} />
          <stop offset="55%" stopColor={DATA_VIZ.aurora} stopOpacity={0.22} />
          <stop offset="100%" stopColor={DATA_VIZ.glow} stopOpacity={0.35} />
        </linearGradient>
      </defs>
      <LinearGradient
        id={DATA_VIZ_GRADIENT_ID}
        from={DATA_VIZ.accent}
        to={DATA_VIZ.em}
        vertical={false}
      />
      <Group left={16}>
        <rect
          x={0}
          y={bandY}
          width={innerWidth}
          height={12}
          rx={6}
          fill="url(#dv-spectrum-fill)"
          stroke="rgba(119, 200, 154, 0.25)"
        />
        <circle
          cx={markerX}
          cy={bandY + 6}
          r={7}
          fill={DATA_VIZ.em}
          stroke={DATA_VIZ.surface}
          strokeWidth={3}
        />
        {tiers.map((tier, i) => {
          const cx = xScale((i + 0.5) / tiers.length);
          const active = tier.id === activeTierId;
          const hovered = interactive && hover.isActive(tier.id);
          const dimmed = interactive && hover.isDimmed(tier.id);
          return (
            <Group key={tier.id} left={cx} opacity={dimOpacity(Boolean(dimmed))}>
              {interactive ? (
                <rect
                  className="dv-hit"
                  x={-48}
                  y={bandY - 8}
                  width={96}
                  height={88}
                  fill="transparent"
                  onMouseEnter={() => hover.activate(tier.id)}
                  onFocus={() => hover.activate(tier.id)}
                  onBlur={() => hover.clear()}
                  onClick={() => hover.activate(tier.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${tier.label}, ${formatSignedDelta(tier.ptsPerWeek)} per week, about ${formatScore(tier.score)}`}
                />
              ) : null}
              <text
                x={0}
                y={bandY + 40}
                textAnchor="middle"
                fill={active || hovered ? DATA_VIZ.em : DATA_VIZ.muted}
                fontSize={12}
                fontFamily="var(--aurora-body, 'Hanken Grotesk', sans-serif)"
                fontWeight={600}
                textDecoration={active || hovered ? "underline" : undefined}
                style={{ textUnderlineOffset: 4, textDecorationColor: DATA_VIZ.aurora }}
                pointerEvents="none"
              >
                {tier.label}
              </text>
              <text
                x={0}
                y={bandY + 56}
                textAnchor="middle"
                fill={DATA_VIZ.muted}
                fontSize={10}
                fontFamily="var(--font-dm-mono, 'DM Mono', monospace)"
                pointerEvents="none"
              >
                {formatSignedDelta(tier.ptsPerWeek)}/wk
              </text>
              <text
                x={0}
                y={bandY + 76}
                textAnchor="middle"
                fill={active || hovered ? DATA_VIZ.em : DATA_VIZ.ink}
                fontSize={18}
                fontFamily="var(--font-display, 'Source Serif 4', Georgia, serif)"
                fontWeight={600}
                pointerEvents="none"
              >
                {formatScore(tier.score)}
              </text>
            </Group>
          );
        })}
      </Group>
    </svg>
      {interactive ? (
        <ChartDetailRail
          label={activeTier ? "Effort tier" : undefined}
          title={
            activeTier
              ? `${activeTier.label} · ~${formatScore(activeTier.score)}`
              : undefined
          }
          body={
            activeTier
              ? `${formatSignedDelta(activeTier.ptsPerWeek)} per week · modeled · Results vary`
              : undefined
          }
          idle={detailIdle}
        />
      ) : null}
    </div>
  );
}

export function VisxSpectrumBand(props: VisxSpectrumBandProps) {
  const height = props.height ?? 130;
  const railH = props.interactive !== false ? 56 : 0;
  return (
    <div className="dv-spectrum" style={{ width: "100%", height: height + railH }}>
      <ParentSize>
        {({ width }) =>
          width > 0 ? <SpectrumInner width={width} height={height} {...props} /> : null
        }
      </ParentSize>
    </div>
  );
}
