import type { Int12StatRow } from "@/lib/sat-plan-funnel/int12-sat-changed-copy";
import { Int12RichCopy } from "@/components/sat-plan/int12-rich-copy";

type Int12StatRowsProps = {
  rows: Int12StatRow[];
};

export function Int12StatRows({ rows }: Int12StatRowsProps) {
  return (
    <div className="int12-stat-rows" role="list">
      {rows.map((row) => (
        <div key={row.index} className="int12-stat-rows__row" role="listitem">
          <div className="int12-stat-rows__meta">
            <span className="int12-stat-rows__index">{row.index}</span>
            <span className="int12-stat-rows__eyebrow">{row.eyebrow}</span>
          </div>
          <div className="int12-stat-rows__body">
            <span
              className={[
                "int12-stat-rows__value",
                row.valueSize === "compact"
                  ? "int12-stat-rows__value--compact"
                  : row.valueSize === "medium"
                    ? "int12-stat-rows__value--medium"
                    : null
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {row.value}
            </span>
            <p className="int12-stat-rows__text">
              <Int12RichCopy parts={row.parts} />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
