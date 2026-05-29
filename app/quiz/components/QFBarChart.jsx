/** Vertical bar chart — readable labels for mobile (no micro mono). */
export function QFBarChart({
  bars,
  max,
  chartH = 140,
  caption = 'Average point gain on SAT retest',
}) {
  return (
    <div className="qf-bar-chart">
      <div className="qf-bar-chart__grid" style={{ height: chartH + 56 }}>
        {bars.map((b) => {
          const heightPx = (b.val / max) * chartH;
          return (
            <div key={b.lbl} className="qf-bar-chart__col">
              <div
                className={[
                  'qf-bar-chart__value',
                  b.hot ? 'qf-bar-chart__value--hot' : '',
                ].filter(Boolean).join(' ')}
              >
                +{b.val}
              </div>
              <div
                className="qf-bar-chart__bar"
                style={{ height: heightPx, background: b.color }}
              />
              <div className="qf-bar-chart__baseline" />
              <div
                className={[
                  'qf-bar-chart__label',
                  b.hot ? 'qf-bar-chart__label--hot' : '',
                ].filter(Boolean).join(' ')}
              >
                {b.lbl}
              </div>
            </div>
          );
        })}
      </div>
      {caption ? <p className="qf-chart-caption">{caption}</p> : null}
    </div>
  );
}
