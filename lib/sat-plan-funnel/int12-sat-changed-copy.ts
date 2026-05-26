export type Int12CopyPart = {
  text: string;
  bold?: boolean;
};

export type Int12StatRow = {
  index: string;
  eyebrow: string;
  value: string;
  valueSize?: "default" | "compact" | "medium";
  parts: Int12CopyPart[];
};

export type Int12SatChangedCopy = {
  headlinePrefix: string;
  headlineAccent: string;
  subheadParts: Int12CopyPart[];
  statRows: Int12StatRow[];
  closingParts: Int12CopyPart[];
};

const STAT_ROWS: Int12StatRow[] = [
  {
    index: "01",
    eyebrow: "THE PRESSURE",
    value: "53%",
    parts: [
      { text: "of students " },
      { text: "feel rushed or run out of time on SAT Math.", bold: true }
    ]
  },
  {
    index: "02",
    eyebrow: "THE HIDDEN EDGE",
    value: "60s",
    parts: [
      { text: "Math problems that take over a minute by hand " },
      {
        text: "can be solved in under 15 seconds using the built-in calculator.",
        bold: true
      }
    ]
  },
  {
    index: "03",
    eyebrow: "WHAT IT'S WORTH",
    value: "50+ pts",
    valueSize: "medium",
    parts: [
      { text: "Leaving just 4 Math questions unanswered ", bold: true },
      { text: "can lower an SAT score by 50+ points." }
    ]
  }
];

export function buildInt12SatChangedCopy(): Int12SatChangedCopy {
  return {
    headlinePrefix: "The SAT is ",
    headlineAccent: "Digital.",
    subheadParts: [
      {
        text: "Many SAT classes still use prep book drills; test day is on a laptop. "
      },
      { text: "You wouldn't train for a baseball game on a football field. " },
      { text: "So why prep for a digital test on paper?", bold: true }
    ],
    statRows: STAT_ROWS.map((row) => ({ ...row, parts: row.parts.map((part) => ({ ...part })) })),
    closingParts: [
      { text: "We train students on the same digital interface tools, like the " },
      { text: "Desmos calculator", bold: true },
      { text: ", they need to answer " },
      { text: "faster and more accurately on test day.", bold: true }
    ]
  };
}
