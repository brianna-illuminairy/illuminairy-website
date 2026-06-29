export function AgendaTable({
  rows,
}: {
  rows: readonly { time: string; segment: string; detail: string }[];
}) {
  return (
    <div className="skye-lesson-deck__table-wrap">
      <table className="skye-lesson-deck__table">
        <thead>
          <tr>
            <th>When</th>
            <th>Segment</th>
            <th>What happens</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.time}-${row.segment}`}>
              <td>{row.time}</td>
              <td>{row.segment}</td>
              <td>{row.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SlideEmbed({ title, src }: { title: string; src: string }) {
  const embedSrc = `${src}?embed=1`;

  return (
    <div className="skye-lesson-deck__slides-block">
      <h4 className="skye-lesson-deck__slides-title">{title}</h4>
      <iframe src={embedSrc} title={title} className="skye-lesson-deck__slide-frame" />
    </div>
  );
}
