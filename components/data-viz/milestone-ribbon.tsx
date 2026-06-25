"use client";

import { ChartDetailRail } from "@/components/data-viz/chart-detail-rail";
import { useChartHover } from "@/lib/data-viz/use-chart-hover";

export type MilestoneWeek = {
  week: number;
  skill: string;
  points?: number | null;
  highlight?: boolean;
};

export type MilestonePin = {
  week: number;
  label: string;
  test?: boolean;
};

type MilestoneRibbonProps = {
  weeks: MilestoneWeek[];
  pins: MilestonePin[];
  ariaLabel: string;
  interactive?: boolean;
  detailIdle?: string;
};

export function MilestoneRibbon({
  weeks,
  pins,
  ariaLabel,
  interactive = true,
  detailIdle = "Hover or tap a week to see the focus skill.",
}: MilestoneRibbonProps) {
  const hover = useChartHover<string>();
  const maxWeek = Math.max(...weeks.map((w) => w.week), ...pins.map((p) => p.week), 1);
  const weekSlots = Array.from({ length: maxWeek }, (_, i) =>
    weeks.find((w) => w.week === i + 1)
  );
  const activeWeek = weeks.find((w) => String(w.week) === hover.activeId);
  const activePin = activeWeek ? pins.find((p) => p.week === activeWeek.week) : undefined;

  return (
    <div
      className="dv-chart-interactive"
      onMouseLeave={interactive ? hover.clear : undefined}
    >
      <div className="dv-ribbon" role="img" aria-label={ariaLabel}>
        <div
          className="dv-ribbon__weeks"
          style={{ gridTemplateColumns: `repeat(${maxWeek}, minmax(72px, 1fr))` }}
        >
          {weekSlots.map((w, i) => (
            <span key={i + 1}>Wk {i + 1}</span>
          ))}
        </div>
        <div className="dv-ribbon__track" aria-hidden />
        <div
          className="dv-ribbon__cards"
          style={{ gridTemplateColumns: `repeat(${maxWeek}, minmax(72px, 1fr))` }}
        >
          {weekSlots.map((w, i) => {
            const weekNum = i + 1;
            if (!w) {
              return <div key={weekNum} className="dv-ribbon__card dv-ribbon__card--empty" aria-hidden />;
            }
            const id = String(w.week);
            const active = interactive && hover.isActive(id);
            const dimmed = interactive && hover.isDimmed(id);
            return (
              <div
                key={w.week}
                className={`dv-ribbon__card${w.highlight ? " dv-ribbon__card--hi" : ""}${active ? " dv-ribbon__card--active" : ""}${dimmed ? " dv-ribbon__card--dim" : ""}`}
                onMouseEnter={interactive ? () => hover.activate(id) : undefined}
                onFocus={interactive ? () => hover.activate(id) : undefined}
                onBlur={interactive ? () => hover.clear() : undefined}
                onClick={interactive ? () => hover.activate(id) : undefined}
                tabIndex={interactive ? 0 : undefined}
                role={interactive ? "button" : undefined}
              >
                <p className="dv-ribbon__skill">{w.skill}</p>
                {w.points != null ? (
                  <p className="dv-ribbon__pts">{w.points > 0 ? `+${w.points}` : "—"}</p>
                ) : null}
              </div>
            );
          })}
        </div>
        <div
          className="dv-ribbon__pins"
          style={{ gridTemplateColumns: `repeat(${maxWeek}, minmax(72px, 1fr))` }}
        >
          {Array.from({ length: maxWeek }, (_, i) => {
            const week = i + 1;
            const pin = pins.find((p) => p.week === week);
            return (
              <div key={week} className={`dv-ribbon__pin${pin ? " dv-ribbon__pin--on" : ""}`}>
                {pin ? pin.label : null}
              </div>
            );
          })}
        </div>
      </div>
      {interactive ? (
        <ChartDetailRail
          label={activeWeek ? `Week ${activeWeek.week}` : undefined}
          title={activeWeek?.skill}
          body={
            activeWeek
              ? [
                  activeWeek.points != null && activeWeek.points > 0
                    ? `+${activeWeek.points} pts focus`
                    : null,
                  activePin ? activePin.label : null,
                ]
                  .filter(Boolean)
                  .join(" · ")
              : undefined
          }
          idle={detailIdle}
        />
      ) : null}
    </div>
  );
}
