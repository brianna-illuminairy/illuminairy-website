import { normalizePrepMethods } from "@/lib/sat-plan-funnel/prep-options";
import {
  basedOnWhatYouShared,
  wrongMirrorSnippet
} from "@/lib/sat-plan-funnel/diagnosis-copy";
import { subjectPronouns } from "@/lib/sat-plan-funnel/subject-pronouns";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";

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
  prepLine: string | null;
  wrongLine: string | null;
};

function prepPersonalizationLines(
  prepIds: ReturnType<typeof normalizePrepMethods>,
  testTaker?: string
): string[] {
  const { subject } = subjectPronouns(testTaker);
  const lines: string[] = [];

  if (prepIds.includes("prep_bluebook") || prepIds.includes("prep_youtube")) {
    lines.push(
      "Practice on paper or scattered videos does not teach the full digital interface — scrolling, highlighting, and Desmos under time pressure."
    );
  }
  if (prepIds.includes("prep_class")) {
    lines.push("Many classes still run paper drills; test day is on a laptop.");
  }
  if (prepIds.includes("prep_khan") || prepIds.includes("prep_app")) {
    lines.push(
      `Apps help — but if ${subject} never trains timed digital reps, test day still feels foreign.`
    );
  }
  if (prepIds.includes("prep_tutor")) {
    lines.push(
      "Even a strong tutor can stall without a diagnostic, timed Digital full tests, and a written plan you can track week to week."
    );
  }

  return lines;
}

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
    value: "75s → 15s",
    valueSize: "compact",
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

export function buildInt12SatChangedCopy(answers: SatPlanAnswers): Int12SatChangedCopy {
  const prepIds = normalizePrepMethods(answers.prep_method);
  const prepBits = prepPersonalizationLines(prepIds, answers.test_taker);
  const wrongBit = wrongMirrorSnippet(answers.wrong_reasons);
  const mirror = basedOnWhatYouShared(answers.test_taker);

  const prepLine =
    prepBits.length > 0
      ? `${mirror} — ${prepBits[0]}`
      : null;

  const wrongLine = wrongBit
    ? `You also flagged that ${wrongBit}. Digital-native reps address that directly.`
    : null;

  return {
    headlinePrefix: "The SAT is ",
    headlineAccent: "Digital.",
    subheadParts: [
      { text: "You wouldn't train for a baseball game on a football field. " },
      { text: "So why prep for a digital test on paper?", bold: true }
    ],
    statRows: STAT_ROWS,
    closingParts: [
      { text: "We train students on the same digital interface tools, like the " },
      { text: "Desmos calculator", bold: true },
      { text: ", they need to answer " },
      { text: "faster and more accurately on test day.", bold: true }
    ],
    prepLine,
    wrongLine
  };
}
