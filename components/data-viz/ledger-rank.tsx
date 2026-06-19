"use client";

import { ChartDetailRail } from "@/components/data-viz/chart-detail-rail";
import { useChartHover } from "@/lib/data-viz/use-chart-hover";

export type LedgerRow = {
  rank: number;
  name: string;
  note?: string;
  points: number;
};

type LedgerRankProps = {
  rows: LedgerRow[];
  footerLeft?: string;
  footerTotal?: number;
  ariaLabel: string;
  interactive?: boolean;
  detailIdle?: string;
};

export function LedgerRank({
  rows,
  footerLeft,
  footerTotal,
  ariaLabel,
  interactive = true,
  detailIdle = "Hover or tap a row for skill detail.",
}: LedgerRankProps) {
  const hover = useChartHover<string>();

  const activeRow = rows.find((r) => String(r.rank) === hover.activeId);

  return (
    <div
      className="dv-chart-interactive"
      onMouseLeave={interactive ? hover.clear : undefined}
    >
      <ol className="dv-ledger" role="img" aria-label={ariaLabel}>
        {rows.map((row) => {
          const id = String(row.rank);
          const active = interactive && hover.isActive(id);
          const dimmed = interactive && hover.isDimmed(id);
          return (
            <li
              key={row.rank}
              className={`${active ? " dv-ledger__row--active" : ""}${dimmed ? " dv-ledger__row--dim" : ""}`}
              onMouseEnter={interactive ? () => hover.activate(id) : undefined}
              onFocus={interactive ? () => hover.activate(id) : undefined}
              onBlur={interactive ? () => hover.clear() : undefined}
              onClick={interactive ? () => hover.activate(id) : undefined}
              tabIndex={interactive ? 0 : undefined}
              role={interactive ? "button" : undefined}
            >
              <span className="dv-ledger__idx">{String(row.rank).padStart(2, "0")}</span>
              <div>
                <p className="dv-ledger__name">{row.name}</p>
                {row.note ? <p className="dv-ledger__note">{row.note}</p> : null}
              </div>
              <span className="dv-ledger__pts">+{row.points}</span>
            </li>
          );
        })}
        {footerLeft || footerTotal != null ? (
          <li className="dv-ledger__footer">
            <span>{footerLeft}</span>
            {footerTotal != null ? (
              <span className="dv-ledger__pts">+{footerTotal}</span>
            ) : null}
          </li>
        ) : null}
      </ol>
      {interactive ? (
        <ChartDetailRail
          label={activeRow ? `Rank ${activeRow.rank}` : undefined}
          title={activeRow?.name}
          body={
            activeRow
              ? `${activeRow.note ? `${activeRow.note} · ` : ""}+${activeRow.points} modeled recoverable`
              : undefined
          }
          idle={detailIdle}
        />
      ) : null}
    </div>
  );
}
