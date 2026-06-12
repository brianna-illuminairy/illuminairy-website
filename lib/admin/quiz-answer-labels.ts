/**
 * Admin-side, human-readable labels for SAT funnel quiz answers.
 *
 * Decoupled from `lib/quiz-funnel/*` copy (which uses React fragments and
 * <em> tags meant for the funnel). When the funnel adds new options, mirror
 * them here so the CRM keeps showing real words instead of raw IDs.
 *
 * Sources:
 *   app/quiz/screens/Questions.jsx
 *   lib/quiz-funnel/opening-copy.ts
 *   lib/quiz-funnel/stakes-copy.ts
 *   lib/quiz-funnel/doubts-copy.ts
 */

/** Step IDs sometimes show up as answer keys (e.g. from per-step touch events). */
const STEP_KEY_ALIASES: Record<string, string> = {
  "q1-parent-child": "qWho",
  "q-who": "qWho",
  "q-score-lower": "qScoreLower",
  "q-doubts": "qDoubts"
};

const QUESTION_LABEL: Record<string, string> = {
  qWho: "Who needs help",
  qScoreLower: "Score lower than goal?",
  q1: "What's most urgent",
  q2: "Why the SAT matters",
  q3: "Times taken",
  q4: "Most recent score",
  q5: "Next SAT date",
  q6: "What's the problem",
  q7: "What they've tried",
  q8: "Goal score",
  q9: "GPA",
  qDoubts: "Doubts heard",
  kidName: "Student first name",
  name: "Student first name",

  // Funnel metadata
  planChoice: "Plan picked",
  sat_lp_variant: "Landing page variant",
  promised_gain_pts: "Promised gain (pts)",
  showed_gpa_gap: "Saw GPA-gap screen",
  weeks_until_test: "Weeks until next test"
};

const OPTION_LABELS: Record<string, Record<string, string>> = {
  qWho: {
    child: "My child",
    self: "Me"
  },
  qScoreLower: {
    yes: "Yes",
    "planning-ahead": "Not yet — planning ahead"
  },
  q1: {
    "score-low": "SAT score is too low",
    "test-soon": "Next test is coming up",
    "app-soon": "Application deadlines coming",
    "get-ahead": "Need to start early"
  },
  q2: {
    "top-choice": "Top-choice school",
    merit: "Merit scholarships",
    selective: "Stay competitive at selective colleges",
    "app-rounds": "Early application rounds"
  },
  q3: {
    "sat-1": "SAT once",
    "sat-2": "SAT twice",
    "sat-3+": "SAT three+ times",
    "psat-only": "PSAT only",
    none: "Hasn't taken it yet"
  },
  q4: {
    u1000: "Under 1100",
    "1100-1200": "1100–1200",
    "1200-1300": "1200–1300",
    "1300-1400": "1300–1400",
    "1400plus": "1400+",
    na: "No official SAT yet"
  },
  q5: {
    aug22: "August 22, 2026",
    sept12: "September 12, 2026",
    oct3: "October 3, 2026",
    nov7: "November 7, 2026",
    dec5: "December 5, 2026",
    tbd: "Not sure yet"
  },
  q6: {
    math: "Math",
    reading: "Reading & writing",
    "self-study": "Self-study isn't working",
    "no-plan": "No clear plan",
    wont: "They won't study",
    "too-busy": "Too busy"
  },
  q7: {
    khan: "Khan / Bluebook / YouTube",
    group: "In-person group class",
    online: "Online course",
    app: "SAT app",
    book: "SAT prep book",
    nothing: "Didn't prepare much"
  },
  q8: {
    "1250": "1250",
    "1300": "1300",
    "1350": "1350",
    "1400": "1400",
    "1450": "1450+",
    tbd: "Not sure yet"
  },
  q9: {
    "u3.0": "Under 3.0",
    "3.0-3.3": "3.0–3.3",
    "3.3-3.5": "3.3–3.5",
    "3.5-3.7": "3.5–3.7",
    "3.7-3.9": "3.7–3.9",
    "4.0+": "4.0+"
  },
  qDoubts: {
    "not-test-taker": "Not a good test taker",
    "studied-no-help": "Studied, didn't help",
    "cant-raise": "Can't raise score that much",
    "bad-at-sat": "Just bad at the SAT",
    "no-months": "Doesn't want to study for months",
    "no-top-choice": "No way into top school"
  },
  planChoice: {
    full: "SAT Accelerator (full)",
    foundations: "Foundations",
    consult: "Consultation only"
  }
};

/** Order quiz answers appear in the admin UI. */
export const QUIZ_KEY_ORDER = [
  "qWho",
  "qScoreLower",
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "qDoubts",
  "q8",
  "q9",
  "kidName"
];

/** Order funnel-metadata fields appear in a separate footer section. */
export const META_KEY_ORDER = [
  "planChoice",
  "sat_lp_variant",
  "promised_gain_pts",
  "weeks_until_test",
  "showed_gpa_gap"
];

/**
 * Keys we never render in the Quiz Answers tab — either duplicates of what's
 * in the Overview tab or always-true noise.
 */
export const HIDDEN_QUIZ_KEYS = new Set([
  "funnel",
  "confirmTcpa",
  "parentName",
  "parentEmail",
  "parentPhone",
  "name",
  "achievability"
]);

/** Map a step ID like `q-score-lower` to its canonical answer key (`qScoreLower`). */
export function canonicalAnswerKey(key: string): string {
  return STEP_KEY_ALIASES[key] ?? key;
}

/**
 * Collapse alias keys onto their canonical key. If both exist, the canonical
 * answer (the structured one written at lead submission) wins.
 */
export function collapseAnswerAliases(
  answers: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...answers };
  for (const [alias, canon] of Object.entries(STEP_KEY_ALIASES)) {
    if (alias in out) {
      if (!(canon in out)) out[canon] = out[alias];
      delete out[alias];
    }
  }
  return out;
}

export function getQuestionLabel(key: string): string {
  const canon = canonicalAnswerKey(key);
  return QUESTION_LABEL[canon] ?? canon;
}

export function formatAnswerValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  const canon = canonicalAnswerKey(key);
  const opts = OPTION_LABELS[canon];

  if (Array.isArray(value)) {
    if (value.length === 0) return "None";
    return value
      .map((v) => {
        if (typeof v === "string" && opts && opts[v]) return opts[v];
        return String(v);
      })
      .join(", ");
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string" && opts && opts[value]) return opts[value];
  return String(value);
}
