export function StatRow({
  items
}: {
  items: { num: string; lbl: string; accent?: boolean }[];
}) {
  return (
    <div className="stat-grid">
      {items.map((s) => (
        <div className="stat" key={s.lbl}>
          <div className={`num ${s.accent ? "accent" : ""}`}>{s.num}</div>
          <div className="lbl">{s.lbl}</div>
        </div>
      ))}
    </div>
  );
}
