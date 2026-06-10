export function AgendaTable({
  rows
}: {
  rows: readonly { time: string; segment: string; detail: string }[];
}) {
  return (
    <div className="danielle-week1__table-wrap">
      <table className="danielle-week1__table">
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
    <div className="danielle-week1__slides-block">
      <h4 className="danielle-week1__slides-title">{title}</h4>
      <iframe src={embedSrc} title={title} className="danielle-week1__slide-frame" />
    </div>
  );
}

export function MathDeck({
  order,
  title,
  when,
  why,
  src
}: {
  order: number;
  title: string;
  when: string;
  why: string;
  src: string;
}) {
  return (
    <article className="danielle-week1__deck">
      <p className="danielle-week1__deck-order">Deck {order}</p>
      <h3 className="danielle-week1__deck-title">{title}</h3>
      <p className="danielle-week1__deck-when">{when}</p>
      <p className="danielle-week1__deck-why">{why}</p>
      <SlideEmbed title={title} src={src} />
    </article>
  );
}
