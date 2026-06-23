'use client';

type Props = {
  chips: string[];
};

function splitRows(items: string[]) {
  const rowA: string[] = [];
  const rowB: string[] = [];
  items.forEach((item, i) => {
    if (i % 2 === 0) rowA.push(item);
    else rowB.push(item);
  });
  return { rowA, rowB };
}

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

/** Two-row masked-email strip — fixed height, ~4 chips visible per row. */
export function BSocialProofChipMarquee({ chips }: Props) {
  const { rowA, rowB } = splitRows(chips);
  if (rowA.length === 0 && rowB.length === 0) return null;

  return (
    <div className="qfb-chip-marquee" aria-hidden="true">
      <ChipRow chips={rowA.length ? rowA : rowB} />
      {rowB.length > 0 ? <ChipRow chips={rowB} reverse /> : null}
    </div>
  );
}
