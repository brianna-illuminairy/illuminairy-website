'use client';

type Props = {
  chips: string[];
  staticLayout?: boolean;
};

function ChipRow({ chips, reverse }: { chips: string[]; reverse?: boolean }) {
  if (chips.length === 0) return null;
  const loop = [...chips, ...chips];

  return (
    <div className={'qfb-chip-marquee__row' + (reverse ? ' qfb-chip-marquee__row--reverse' : '')}>
      <div className="qfb-chip-marquee__track" aria-hidden="true">
        {loop.map((chip, i) => (
          <span key={`${chip}-${i}`} className="qfb-email-capture__chip">
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Static wrapped chips (Brighterly-style) or slow marquee rows. */
export function BSocialProofChipMarquee({ chips, staticLayout = true }: Props) {
  if (chips.length === 0) return null;

  if (staticLayout) {
    return (
      <div className="qfb-chip-marquee qfb-chip-marquee--static" aria-hidden="true">
        <div className="qfb-chip-marquee__row">
          <div className="qfb-chip-marquee__track">
            {chips.map((chip) => (
              <span key={chip} className="qfb-email-capture__chip">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const rowA: string[] = [];
  const rowB: string[] = [];
  chips.forEach((item, i) => {
    if (i % 2 === 0) rowA.push(item);
    else rowB.push(item);
  });

  return (
    <div className="qfb-chip-marquee" aria-hidden="true">
      <ChipRow chips={rowA.length ? rowA : rowB} />
      {rowB.length > 0 ? <ChipRow chips={rowB} reverse /> : null}
    </div>
  );
}
