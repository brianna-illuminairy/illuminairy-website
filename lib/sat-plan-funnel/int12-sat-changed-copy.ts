import {
  hasGroupClassPrep,
  isTestedHistory
} from "@/lib/sat-plan-funnel/funnel-routing";
import { studentVoice } from "@/lib/sat-plan-funnel/student-voice";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";
import { wrongReasonMatches } from "@/lib/sat-plan-funnel/wrong-options";

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

const CLOSING_PARTS: Int12CopyPart[] = [
  { text: "We train students on the same digital interface tools, like the " },
  { text: "Desmos calculator", bold: true },
  { text: ", they need to answer " },
  { text: "faster and more accurately on test day.", bold: true }
];

function bridgeForTime(answers: SatPlanAnswers): Int12CopyPart[] {
  const voice = studentVoice(answers);

  if (voice.isSelf) {
    return [
      {
        text: "If you ran out of time, knowing when to use the built-in calculator is often what turns a long problem into a quick one."
      }
    ];
  }

  if (voice.subject === "he") {
    return [
      {
        text: "If he ran out of time, knowing when to use the built-in calculator is often what turns a long problem into a quick one."
      }
    ];
  }

  if (voice.subject === "she") {
    return [
      {
        text: "If she ran out of time, knowing when to use the built-in calculator is often what turns a long problem into a quick one."
      }
    ];
  }

  return [
    {
      text: "If pacing was an issue, knowing when to use the built-in calculator is often what turns a long problem into a quick one."
    }
  ];
}

function bridgeForMath(answers: SatPlanAnswers): Int12CopyPart[] {
  const voice = studentVoice(answers);

  if (voice.isSelf) {
    return [
      {
        text: "If math held you back, not using the built-in calculator on Desmos-ready questions is one common reason scores stay flat."
      }
    ];
  }

  if (voice.subject === "he") {
    return [
      {
        text: "If math held him back, not using the built-in calculator on Desmos-ready questions is one common reason scores stay flat."
      }
    ];
  }

  if (voice.subject === "she") {
    return [
      {
        text: "If math held her back, not using the built-in calculator on Desmos-ready questions is one common reason scores stay flat."
      }
    ];
  }

  return [
    {
      text: "If math was a weak spot, not using the built-in calculator on Desmos-ready questions is one common reason scores stay flat."
    }
  ];
}

function bridgeForPaperClass(answers: SatPlanAnswers): Int12CopyPart[] {
  const voice = studentVoice(answers);

  if (voice.isSelf) {
    return [
      {
        text: "If most of your prep was on paper, test day on a laptop—including the built-in calculator—is a different skill set."
      }
    ];
  }

  return [
    {
      text: "If most of their prep was on paper, test day on a laptop—including the built-in calculator—is a different skill set."
    }
  ];
}

function buildBridgeParts(answers: SatPlanAnswers): Int12CopyPart[] | null {
  const wrong = answers.wrong_reasons;
  const tested = isTestedHistory(answers.test_history);
  const lowScore =
    tested &&
    answers.recent_score &&
    answers.recent_score !== "score_1300_plus";

  if (wrongReasonMatches(wrong, "time")) {
    return bridgeForTime(answers);
  }

  if (wrongReasonMatches(wrong, "math")) {
    return bridgeForMath(answers);
  }

  if (lowScore) {
    return bridgeForMath(answers);
  }

  if (hasGroupClassPrep(answers.prep_method)) {
    return bridgeForPaperClass(answers);
  }

  return null;
}

function buildClosingParts(answers: SatPlanAnswers): Int12CopyPart[] {
  const closing = CLOSING_PARTS.map((part) => ({ ...part }));
  const bridge = buildBridgeParts(answers);
  if (!bridge?.length) return closing;
  return [...bridge, { text: " " }, ...closing];
}

export function buildInt12SatChangedCopy(answers: SatPlanAnswers): Int12SatChangedCopy {
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
    statRows: STAT_ROWS.map((row) => ({
      ...row,
      parts: row.parts.map((part) => ({ ...part }))
    })),
    closingParts: buildClosingParts(answers)
  };
}
