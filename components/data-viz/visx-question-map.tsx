"use client";

import { useMemo } from "react";
import { ParentSize } from "@visx/responsive";
import { scaleBand } from "@visx/scale";
import { Group } from "@visx/group";
import { DATA_VIZ } from "@/lib/data-viz/tokens";
import { dimOpacity, useChartHover } from "@/lib/data-viz/use-chart-hover";
import { ChartDetailRail } from "@/components/data-viz/chart-detail-rail";
import type { SatQuestionSection } from "@/lib/data-viz/sat-types";

type VisxQuestionMapProps = {
  sections: SatQuestionSection[];
  ariaLabel: string;
  cellSize?: number;
  interactive?: boolean;
  detailIdle?: string;
};

const ROW_H = 28;
const SECTION_GAP = 20;
const HIT_R = 14;

type LayoutSection = {
  section: SatQuestionSection;
  y: number;
  modules: { mod: SatQuestionSection["modules"][number]; y: number }[];
};

type CellRef = {
  id: string;
  sectionTitle: string;
  moduleLabel: string;
  cell: SatQuestionSection["modules"][number]["cells"][number];
};

function buildLayout(sections: SatQuestionSection[]): LayoutSection[] {
  let y = 0;
  const out: LayoutSection[] = [];
  for (const section of sections) {
    const sectionY = y;
    y += 22;
    const modules = section.modules.map((mod) => {
      const rowY = y;
      y += ROW_H + 6;
      return { mod, y: rowY };
    });
    y += SECTION_GAP;
    out.push({ section, y: sectionY, modules });
  }
  return out;
}

function totalHeight(sections: SatQuestionSection[]): number {
  const layout = buildLayout(sections);
  if (layout.length === 0) return 8;
  const last = layout[layout.length - 1];
  const lastMod = last.modules[last.modules.length - 1];
  return lastMod.y + ROW_H + 8;
}

function flattenCells(sections: SatQuestionSection[]): CellRef[] {
  const out: CellRef[] = [];
  for (const section of sections) {
    for (const mod of section.modules) {
      for (const cell of mod.cells) {
        out.push({
          id: `${section.title}-${mod.label}-${cell.n}`,
          sectionTitle: section.title,
          moduleLabel: mod.label,
          cell,
        });
      }
    }
  }
  return out;
}

function MapInner({
  width,
  sections,
  ariaLabel,
  cellSize = 14,
  interactive,
  detailIdle = "Hover or tap a missed question for skill and answer detail.",
}: VisxQuestionMapProps & { width: number }) {
  const hover = useChartHover<string>();
  const maxCells = Math.max(
    ...sections.flatMap((s) => s.modules.map((m) => m.cells.length)),
    1
  );

  const xScale = useMemo(
    () =>
      scaleBand<number>({
        domain: Array.from({ length: maxCells }, (_, i) => i),
        range: [0, width - 8],
        padding: 0.15,
      }),
    [maxCells, width]
  );

  const layout = buildLayout(sections);
  const height = totalHeight(sections);
  const allCells = flattenCells(sections);
  const active = allCells.find((c) => c.id === hover.activeId);
  const activeCell = active?.cell;

  const diffLabel =
    activeCell?.miss === "E"
      ? "Easy"
      : activeCell?.miss === "M"
        ? "Medium"
        : activeCell?.miss === "H"
          ? "Hard"
          : null;

  return (
    <div
      className="dv-chart-interactive"
      onMouseLeave={interactive ? hover.clear : undefined}
    >
      <svg width={width} height={height} role="img" aria-label={ariaLabel}>
        {layout.map(({ section, y: sectionY, modules }) => (
          <Group key={section.title} top={sectionY}>
            <text
              x={0}
              y={12}
              fill={DATA_VIZ.ink}
              fontSize={12}
              fontWeight={600}
              fontFamily="var(--aurora-body, sans-serif)"
            >
              {section.title}
            </text>
            {modules.map(({ mod, y: rowY }) => (
              <Group key={mod.label} top={rowY}>
                <text
                  x={0}
                  y={-6}
                  fill={DATA_VIZ.em}
                  fontSize={9}
                  fontFamily="var(--font-dm-mono, 'DM Mono', monospace)"
                  letterSpacing="0.12em"
                >
                  {mod.label.toUpperCase()}
                </text>
                {mod.cells.map((cell, i) => {
                  const cx = (xScale(i) ?? 0) + (xScale.bandwidth() ?? 0) / 2;
                  const miss = cell.miss;
                  const cellId = `${section.title}-${mod.label}-${cell.n}`;
                  const dimmed =
                    interactive &&
                    hover.activeId != null &&
                    hover.activeId !== cellId &&
                    Boolean(miss);
                  const active = interactive && hover.isActive(cellId);
                  const opacity = dimOpacity(Boolean(dimmed));

                  return (
                    <Group key={cell.n} left={cx - cellSize / 2} top={4} opacity={opacity}>
                      {interactive && miss ? (
                        <circle
                          className="dv-hit"
                          cx={cellSize / 2}
                          cy={cellSize / 2}
                          r={HIT_R}
                          fill="transparent"
                          onMouseEnter={() => hover.activate(cellId)}
                          onFocus={() => hover.activate(cellId)}
                          onBlur={() => hover.clear()}
                          onClick={() => hover.activate(cellId)}
                          tabIndex={0}
                          role="button"
                          aria-label={`Question ${cell.n}, ${cell.topic ?? "missed"}, ${miss === "E" ? "Easy" : miss === "M" ? "Medium" : "Hard"} difficulty`}
                        />
                      ) : null}
                      <circle
                        cx={cellSize / 2}
                        cy={cellSize / 2}
                        r={active ? cellSize / 2 + 2 : cellSize / 2}
                        fill={miss ? "rgba(0, 87, 168, 0.22)" : DATA_VIZ.surface}
                        stroke={active ? DATA_VIZ.em : miss ? DATA_VIZ.accent : DATA_VIZ.aurora}
                        strokeWidth={active ? 2 : miss ? 1 : 1.5}
                      />
                      {miss ? (
                        <text
                          x={cellSize / 2}
                          y={cellSize / 2 + 3}
                          textAnchor="middle"
                          fill={DATA_VIZ.accent}
                          fontSize={7}
                          fontFamily="var(--font-dm-mono, 'DM Mono', monospace)"
                          pointerEvents="none"
                        >
                          {miss}
                        </text>
                      ) : null}
                    </Group>
                  );
                })}
              </Group>
            ))}
          </Group>
        ))}
      </svg>
      {interactive ? (
        <ChartDetailRail
          label={active ? active.moduleLabel : undefined}
          title={
            activeCell?.miss
              ? `Question ${activeCell.n}${activeCell.topic ? ` · ${activeCell.topic}` : ""}`
              : undefined
          }
          body={
            activeCell?.miss
              ? `${diffLabel ?? activeCell.miss} miss${activeCell.detail ? ` · ${activeCell.detail}` : ""}`
              : undefined
          }
          idle={detailIdle}
        />
      ) : null}
    </div>
  );
}

export function VisxQuestionMap({
  interactive = true,
  detailIdle,
  ...props
}: VisxQuestionMapProps) {
  const railH = interactive ? 56 : 0;

  return (
    <div className="dv-qmap" style={{ width: "100%", paddingBottom: railH }}>
      <ParentSize>
        {({ width }) =>
          width > 0 ? (
            <MapInner width={width} interactive={interactive} detailIdle={detailIdle} {...props} />
          ) : null
        }
      </ParentSize>
    </div>
  );
}
