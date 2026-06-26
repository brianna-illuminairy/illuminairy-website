export type EePattern = "dos" | "ps-pos" | "ps-neg" | "trinomial";

export type EeTier = 1 | 2 | 3 | 4;

export type PatternSortItem = {
  id: string;
  tier: EeTier;
  expression: string;
  pattern: EePattern;
  explain: string;
};

export type FoilRole = "F" | "O" | "I" | "L";

export type FoilBuilderProblem = {
  id: string;
  tier: EeTier;
  product: string;
  expanded: string;
  steps: Record<FoilRole, { term: string; explain: string }>;
  distractors: string[];
};

export type MissingValueProblem = {
  id: string;
  tier: EeTier;
  expression: string;
  question: string;
  choices: { id: string; label: string }[];
  correctId: string;
  hint: string;
  explain: string;
};

export type CombineSimplifyProblem = {
  id: string;
  tier: EeTier;
  expression: string;
  question: string;
  choices: { id: string; label: string }[];
  correctId: string;
  hint: string;
  explain: string;
};

/** Five reps per tier · 20 total · ramps warm-up → stretch */
export const PATTERN_SORT_ITEMS: PatternSortItem[] = [
  {
    id: "ps-01",
    tier: 1,
    expression: "x² − 49",
    pattern: "dos",
    explain: "(x)² − (7)². Difference of squares."
  },
  {
    id: "ps-02",
    tier: 1,
    expression: "x² + 6x + 9",
    pattern: "ps-pos",
    explain: "x² + 2(3)(x) + 9 = (x + 3)²."
  },
  {
    id: "ps-03",
    tier: 1,
    expression: "x² − 6x + 9",
    pattern: "ps-neg",
    explain: "x² − 2(3)(x) + 9 = (x − 3)²."
  },
  {
    id: "ps-04",
    tier: 1,
    expression: "4x² − 9",
    pattern: "dos",
    explain: "(2x)² − (3)²."
  },
  {
    id: "ps-05",
    tier: 1,
    expression: "x² + 7x + 12",
    pattern: "trinomial",
    explain: "(x + 3)(x + 4). Middle term is not 2√(first·last)."
  },
  {
    id: "ps-06",
    tier: 2,
    expression: "x² + 10x + 25",
    pattern: "ps-pos",
    explain: "(x + 5)²."
  },
  {
    id: "ps-07",
    tier: 2,
    expression: "25x² − 16",
    pattern: "dos",
    explain: "(5x)² − (4)²."
  },
  {
    id: "ps-08",
    tier: 2,
    expression: "x² − 14x + 49",
    pattern: "ps-neg",
    explain: "(x − 7)²."
  },
  {
    id: "ps-09",
    tier: 2,
    expression: "x² + 11x + 24",
    pattern: "trinomial",
    explain: "Looks close to a perfect square, but 11 ≠ 2√24. Factor as (x + 3)(x + 8)."
  },
  {
    id: "ps-10",
    tier: 2,
    expression: "9x² − 49",
    pattern: "dos",
    explain: "(3x)² − (7)²."
  },
  {
    id: "ps-11",
    tier: 3,
    expression: "x² + 12x + 36",
    pattern: "ps-pos",
    explain: "(x + 6)²."
  },
  {
    id: "ps-12",
    tier: 3,
    expression: "4x² + 12x + 9",
    pattern: "ps-pos",
    explain: "Perfect square on 2x: (2x + 3)². Do not treat it as a basic trinomial."
  },
  {
    id: "ps-13",
    tier: 3,
    expression: "x² − 20x + 100",
    pattern: "ps-neg",
    explain: "(x − 10)²."
  },
  {
    id: "ps-14",
    tier: 3,
    expression: "x² + 13x + 36",
    pattern: "trinomial",
    explain: "(x + 4)(x + 9). 13 ≠ 2√36, so it is not a perfect square."
  },
  {
    id: "ps-15",
    tier: 3,
    expression: "49x² − 64",
    pattern: "dos",
    explain: "(7x)² − (8)²."
  },
  {
    id: "ps-16",
    tier: 4,
    expression: "9x² − 30x + 25",
    pattern: "ps-neg",
    explain: "(3x − 5)². Coefficient on x² hides the pattern."
  },
  {
    id: "ps-17",
    tier: 4,
    expression: "x² + 10x + 21",
    pattern: "trinomial",
    explain: "(x + 3)(x + 7). 10 ≠ 2√21."
  },
  {
    id: "ps-18",
    tier: 4,
    expression: "16x² − 49",
    pattern: "dos",
    explain: "(4x)² − (7)²."
  },
  {
    id: "ps-19",
    tier: 4,
    expression: "x² − 8x + 15",
    pattern: "trinomial",
    explain: "(x − 3)(x − 5). Both factors negative."
  },
  {
    id: "ps-20",
    tier: 4,
    expression: "4x² − 20x + 25",
    pattern: "ps-neg",
    explain: "(2x − 5)². Stretch: coefficient + negative middle."
  }
];

export const FOIL_BUILDER_PROBLEMS: FoilBuilderProblem[] = [
  {
    id: "foil-01",
    tier: 1,
    product: "(x + 3)(x + 5)",
    expanded: "x² + 8x + 15",
    steps: {
      F: { term: "x²", explain: "First: x · x = x²." },
      O: { term: "5x", explain: "Outer: x · 5 = 5x." },
      I: { term: "3x", explain: "Inner: 3 · x = 3x." },
      L: { term: "15", explain: "Last: 3 · 5 = 15." }
    },
    distractors: ["8x", "2x", "x", "8"]
  },
  {
    id: "foil-02",
    tier: 1,
    product: "(x + 2)(x + 4)",
    expanded: "x² + 6x + 8",
    steps: {
      F: { term: "x²", explain: "First: x · x." },
      O: { term: "4x", explain: "Outer: x · 4." },
      I: { term: "2x", explain: "Inner: 2 · x." },
      L: { term: "8", explain: "Last: 2 · 4." }
    },
    distractors: ["6x", "6", "2x", "4"]
  },
  {
    id: "foil-03",
    tier: 1,
    product: "(x + 1)(x + 7)",
    expanded: "x² + 8x + 7",
    steps: {
      F: { term: "x²", explain: "First: x · x." },
      O: { term: "7x", explain: "Outer: x · 7." },
      I: { term: "x", explain: "Inner: 1 · x." },
      L: { term: "7", explain: "Last: 1 · 7." }
    },
    distractors: ["8x", "8", "7", "2x"]
  },
  {
    id: "foil-04",
    tier: 1,
    product: "(x + 3)(x + k)",
    expanded: "x² + 8x + 15",
    steps: {
      F: { term: "x²", explain: "First: x · x." },
      O: { term: "kx", explain: "Outer: x · k." },
      I: { term: "3x", explain: "Inner: 3 · x." },
      L: { term: "3k", explain: "Last: 3 · k. Set 3k = 15 to find k." }
    },
    distractors: ["8x", "15", "3", "5x"]
  },
  {
    id: "foil-05",
    tier: 1,
    product: "(x − 2)(x + 5)",
    expanded: "x² + 3x − 10",
    steps: {
      F: { term: "x²", explain: "First: x · x." },
      O: { term: "5x", explain: "Outer: x · 5." },
      I: { term: "−2x", explain: "Inner: −2 · x." },
      L: { term: "−10", explain: "Last: −2 · 5." }
    },
    distractors: ["3x", "−10", "2x", "10"]
  },
  {
    id: "foil-06",
    tier: 2,
    product: "(x − 3)(x + 4)",
    expanded: "x² + x − 12",
    steps: {
      F: { term: "x²", explain: "First: x · x." },
      O: { term: "4x", explain: "Outer: x · 4." },
      I: { term: "−3x", explain: "Inner: −3 · x." },
      L: { term: "−12", explain: "Last: −3 · 4." }
    },
    distractors: ["x", "−12", "12", "7x"]
  },
  {
    id: "foil-07",
    tier: 2,
    product: "(2x + 1)(x + 4)",
    expanded: "2x² + 9x + 4",
    steps: {
      F: { term: "2x²", explain: "First: 2x · x." },
      O: { term: "8x", explain: "Outer: 2x · 4." },
      I: { term: "x", explain: "Inner: 1 · x." },
      L: { term: "4", explain: "Last: 1 · 4." }
    },
    distractors: ["9x", "2x", "4x", "6"]
  },
  {
    id: "foil-08",
    tier: 2,
    product: "(x + 4)(x − 1)",
    expanded: "x² + 3x − 4",
    steps: {
      F: { term: "x²", explain: "First: x · x." },
      O: { term: "−x", explain: "Outer: x · (−1)." },
      I: { term: "4x", explain: "Inner: 4 · x." },
      L: { term: "−4", explain: "Last: 4 · (−1)." }
    },
    distractors: ["3x", "−4", "4", "5x"]
  },
  {
    id: "foil-09",
    tier: 2,
    product: "(3x + 2)(x + 1)",
    expanded: "3x² + 5x + 2",
    steps: {
      F: { term: "3x²", explain: "First: 3x · x." },
      O: { term: "3x", explain: "Outer: 3x · 1." },
      I: { term: "2x", explain: "Inner: 2 · x." },
      L: { term: "2", explain: "Last: 2 · 1." }
    },
    distractors: ["5x", "3x", "6x", "5"]
  },
  {
    id: "foil-10",
    tier: 2,
    product: "(x − 5)(x − 2)",
    expanded: "x² − 7x + 10",
    steps: {
      F: { term: "x²", explain: "First: x · x." },
      O: { term: "−2x", explain: "Outer: x · (−2)." },
      I: { term: "−5x", explain: "Inner: −5 · x." },
      L: { term: "10", explain: "Last: (−5)(−2)." }
    },
    distractors: ["−7x", "10", "7x", "−10"]
  },
  {
    id: "foil-11",
    tier: 3,
    product: "(2x + 3)(x + 1)",
    expanded: "2x² + 5x + 3",
    steps: {
      F: { term: "2x²", explain: "First: 2x · x." },
      O: { term: "2x", explain: "Outer: 2x · 1." },
      I: { term: "3x", explain: "Inner: 3 · x." },
      L: { term: "3", explain: "Last: 3 · 1." }
    },
    distractors: ["5x", "2x", "6x", "5"]
  },
  {
    id: "foil-12",
    tier: 3,
    product: "(x + 6)(x − 4)",
    expanded: "x² + 2x − 24",
    steps: {
      F: { term: "x²", explain: "First: x · x." },
      O: { term: "−4x", explain: "Outer: x · (−4)." },
      I: { term: "6x", explain: "Inner: 6 · x." },
      L: { term: "−24", explain: "Last: 6 · (−4)." }
    },
    distractors: ["2x", "−24", "24", "10x"]
  },
  {
    id: "foil-13",
    tier: 3,
    product: "(4x + 1)(x + 2)",
    expanded: "4x² + 9x + 2",
    steps: {
      F: { term: "4x²", explain: "First: 4x · x." },
      O: { term: "8x", explain: "Outer: 4x · 2." },
      I: { term: "x", explain: "Inner: 1 · x." },
      L: { term: "2", explain: "Last: 1 · 2." }
    },
    distractors: ["9x", "8x", "4x", "6"]
  },
  {
    id: "foil-14",
    tier: 3,
    product: "(x + 2)(x + k)",
    expanded: "x² + 7x + 12",
    steps: {
      F: { term: "x²", explain: "First: x · x." },
      O: { term: "kx", explain: "Outer: x · k." },
      I: { term: "2x", explain: "Inner: 2 · x." },
      L: { term: "2k", explain: "Last: 2 · k. O + I: k + 2 = 7." }
    },
    distractors: ["7x", "12", "2k", "5x"]
  },
  {
    id: "foil-15",
    tier: 3,
    product: "(x − 1)(x − 8)",
    expanded: "x² − 9x + 8",
    steps: {
      F: { term: "x²", explain: "First: x · x." },
      O: { term: "−8x", explain: "Outer: x · (−8)." },
      I: { term: "−x", explain: "Inner: −1 · x." },
      L: { term: "8", explain: "Last: (−1)(−8)." }
    },
    distractors: ["−9x", "8", "9x", "−8"]
  },
  {
    id: "foil-16",
    tier: 4,
    product: "(3x − 2)(x + 5)",
    expanded: "3x² + 13x − 10",
    steps: {
      F: { term: "3x²", explain: "First: 3x · x." },
      O: { term: "15x", explain: "Outer: 3x · 5." },
      I: { term: "−2x", explain: "Inner: −2 · x." },
      L: { term: "−10", explain: "Last: (−2)(5)." }
    },
    distractors: ["13x", "15x", "−10", "3x"]
  },
  {
    id: "foil-17",
    tier: 4,
    product: "(2x − 1)(x − 3)",
    expanded: "2x² − 7x + 3",
    steps: {
      F: { term: "2x²", explain: "First: 2x · x." },
      O: { term: "−6x", explain: "Outer: 2x · (−3)." },
      I: { term: "−x", explain: "Inner: −1 · x." },
      L: { term: "3", explain: "Last: (−1)(−3)." }
    },
    distractors: ["−7x", "3", "7x", "−6x"]
  },
  {
    id: "foil-18",
    tier: 4,
    product: "(5x + 5)(4x + 5)",
    expanded: "20x² + 45x + 25",
    steps: {
      F: { term: "20x²", explain: "First: 5x · 4x." },
      O: { term: "25x", explain: "Outer: 5x · 5." },
      I: { term: "20x", explain: "Inner: 5 · 4x." },
      L: { term: "25", explain: "Last: 5 · 5." }
    },
    distractors: ["45x", "25x", "20x", "45"]
  },
  {
    id: "foil-19",
    tier: 4,
    product: "(x + a)(x + b)",
    expanded: "x² + 11x + 24",
    steps: {
      F: { term: "x²", explain: "First: x · x." },
      O: { term: "bx", explain: "Outer: x · b." },
      I: { term: "ax", explain: "Inner: a · x." },
      L: { term: "ab", explain: "Last: a · b. Need a + b = 11 and ab = 24." }
    },
    distractors: ["11x", "24", "ab", "ax"]
  },
  {
    id: "foil-20",
    tier: 4,
    product: "(2x + 3)(3x − 1)",
    expanded: "6x² + 7x − 3",
    steps: {
      F: { term: "6x²", explain: "First: 2x · 3x." },
      O: { term: "−2x", explain: "Outer: 2x · (−1)." },
      I: { term: "9x", explain: "Inner: 3 · 3x." },
      L: { term: "−3", explain: "Last: 3 · (−1)." }
    },
    distractors: ["7x", "9x", "−3", "6x"]
  }
];

export const MISSING_VALUE_PROBLEMS: MissingValueProblem[] = [
  {
    id: "mv-01",
    tier: 1,
    expression: "(x + 3)(x + k) = x² + 8x + 15",
    question: "Find k using O + I = 8x.",
    choices: [
      { id: "3", label: "3" },
      { id: "5", label: "5" },
      { id: "8", label: "8" },
      { id: "15", label: "15" }
    ],
    correctId: "5",
    hint: "O + I: k + 3 = 8.",
    explain: "k + 3 = 8, so k = 5. Check L: 3(5) = 15."
  },
  {
    id: "mv-02",
    tier: 1,
    expression: "(x + 3)(x + k) = x² + 8x + 15",
    question: "Find k using L = 15.",
    choices: [
      { id: "3", label: "3" },
      { id: "5", label: "5" },
      { id: "8", label: "8" },
      { id: "12", label: "12" }
    ],
    correctId: "5",
    hint: "L = 3k. Set 3k = 15.",
    explain: "3k = 15, so k = 5."
  },
  {
    id: "mv-03",
    tier: 1,
    expression: "(2x + 3)(x + 1)",
    question: "What is the coefficient of x after O + I?",
    choices: [
      { id: "3", label: "3" },
      { id: "4", label: "4" },
      { id: "5", label: "5" },
      { id: "6", label: "6" }
    ],
    correctId: "5",
    hint: "O = 2x · 1 = 2x. I = 3 · x = 3x.",
    explain: "O + I = 2x + 3x = 5x. Coefficient is 5."
  },
  {
    id: "mv-04",
    tier: 1,
    expression: "(x + 3)(x + k) = x² + 7x + 12",
    question: "Find k.",
    choices: [
      { id: "3", label: "3" },
      { id: "4", label: "4" },
      { id: "6", label: "6" },
      { id: "7", label: "7" }
    ],
    correctId: "4",
    hint: "O + I: 3 + k = 7, or L: 3k = 12.",
    explain: "k = 4. Check L: 3(4) = 12."
  },
  {
    id: "mv-05",
    tier: 1,
    expression: "12x + 48 = a(x + b)",
    question: "What is ab?",
    choices: [
      { id: "4", label: "4" },
      { id: "12", label: "12" },
      { id: "48", label: "48" },
      { id: "60", label: "60" }
    ],
    correctId: "48",
    hint: "Pull out the GCF of 12 and 48 first.",
    explain: "12x + 48 = 12(x + 4). a = 12, b = 4, ab = 48."
  },
  {
    id: "mv-06",
    tier: 2,
    expression: "(x + 4)(x + k) = x² + 9x + 20",
    question: "Find k.",
    choices: [
      { id: "4", label: "4" },
      { id: "5", label: "5" },
      { id: "9", label: "9" },
      { id: "20", label: "20" }
    ],
    correctId: "5",
    hint: "O + I: 4 + k = 9.",
    explain: "k = 5. Check L: 4(5) = 20."
  },
  {
    id: "mv-07",
    tier: 2,
    expression: "(x − 2)(x + k) = x² + 3x − 10",
    question: "Find k.",
    choices: [
      { id: "−2", label: "−2" },
      { id: "3", label: "3" },
      { id: "5", label: "5" },
      { id: "10", label: "10" }
    ],
    correctId: "5",
    hint: "O + I: −2 + k = 3.",
    explain: "k = 5. Check L: (−2)(5) = −10."
  },
  {
    id: "mv-08",
    tier: 2,
    expression: "(5x + 5)(4x + 5) = 20x² + kx + 25",
    question: "Find k (combine O + I).",
    choices: [
      { id: "20", label: "20" },
      { id: "25", label: "25" },
      { id: "45", label: "45" },
      { id: "50", label: "50" }
    ],
    correctId: "45",
    hint: "O = 25x. I = 20x.",
    explain: "k = 25 + 20 = 45."
  },
  {
    id: "mv-09",
    tier: 2,
    expression: "(3x + 2)(x + 1) = 3x² + kx + 2",
    question: "Find k.",
    choices: [
      { id: "3", label: "3" },
      { id: "4", label: "4" },
      { id: "5", label: "5" },
      { id: "6", label: "6" }
    ],
    correctId: "5",
    hint: "O = 3x. I = 2x.",
    explain: "k = 3 + 2 = 5."
  },
  {
    id: "mv-10",
    tier: 2,
    expression: "6x + 18 = a(x + b)",
    question: "What is a + b?",
    choices: [
      { id: "5", label: "5" },
      { id: "6", label: "6" },
      { id: "9", label: "9" },
      { id: "24", label: "24" }
    ],
    correctId: "9",
    hint: "Factor out 6: 6(x + 3).",
    explain: "a = 6, b = 3, so a + b = 9."
  },
  {
    id: "mv-11",
    tier: 3,
    expression: "(2x + 1)(x + k) = 2x² + 9x + 4",
    question: "Find k.",
    choices: [
      { id: "1", label: "1" },
      { id: "4", label: "4" },
      { id: "8", label: "8" },
      { id: "9", label: "9" }
    ],
    correctId: "4",
    hint: "O + I: 2k + 1 = 9, or L: k = 4.",
    explain: "k = 4. Check L: 1(4) = 4."
  },
  {
    id: "mv-12",
    tier: 3,
    expression: "(x − 3)(x − k) = x² − 8x + 15",
    question: "Find k.",
    choices: [
      { id: "3", label: "3" },
      { id: "5", label: "5" },
      { id: "8", label: "8" },
      { id: "15", label: "15" }
    ],
    correctId: "5",
    hint: "O + I: −3 − k = −8.",
    explain: "k = 5. Check L: (−3)(−5) = 15."
  },
  {
    id: "mv-13",
    tier: 3,
    expression: "(4x + 1)(x + 2) = 4x² + kx + 2",
    question: "Find k.",
    choices: [
      { id: "6", label: "6" },
      { id: "8", label: "8" },
      { id: "9", label: "9" },
      { id: "10", label: "10" }
    ],
    correctId: "9",
    hint: "O = 8x. I = x.",
    explain: "k = 8 + 1 = 9."
  },
  {
    id: "mv-14",
    tier: 3,
    expression: "(x + 6)(x + k) = x² + 2x − 24",
    question: "Find k.",
    choices: [
      { id: "−4", label: "−4" },
      { id: "2", label: "2" },
      { id: "4", label: "4" },
      { id: "6", label: "6" }
    ],
    correctId: "−4",
    hint: "O + I: 6 + k = 2.",
    explain: "k = −4. Check L: 6(−4) = −24."
  },
  {
    id: "mv-15",
    tier: 3,
    expression: "15x + 45 = a(x + b)",
    question: "What is ab?",
    choices: [
      { id: "15", label: "15" },
      { id: "45", label: "45" },
      { id: "48", label: "48" },
      { id: "135", label: "135" }
    ],
    correctId: "45",
    hint: "15(x + 3).",
    explain: "a = 15, b = 3, ab = 45."
  },
  {
    id: "mv-16",
    tier: 4,
    expression: "(3x − 2)(x + k) = 3x² + 13x − 10",
    question: "Find k.",
    choices: [
      { id: "−2", label: "−2" },
      { id: "2", label: "2" },
      { id: "5", label: "5" },
      { id: "13", label: "13" }
    ],
    correctId: "5",
    hint: "O + I: 3k − 2 = 13.",
    explain: "3k = 15, so k = 5. Check L: (−2)(5) = −10."
  },
  {
    id: "mv-17",
    tier: 4,
    expression: "(2x − 1)(x − k) = 2x² − 7x + 3",
    question: "Find k.",
    choices: [
      { id: "1", label: "1" },
      { id: "3", label: "3" },
      { id: "5", label: "5" },
      { id: "7", label: "7" }
    ],
    correctId: "3",
    hint: "O + I: −2k − 1 = −7.",
    explain: "k = 3. Check L: (−1)(−3) = 3."
  },
  {
    id: "mv-18",
    tier: 4,
    expression: "(x + a)(x + b) = x² + 11x + 24, a < b",
    question: "What is b?",
    choices: [
      { id: "3", label: "3" },
      { id: "6", label: "6" },
      { id: "8", label: "8" },
      { id: "11", label: "11" }
    ],
    correctId: "8",
    hint: "Find two numbers with sum 11 and product 24.",
    explain: "3 and 8. With a < b, b = 8."
  },
  {
    id: "mv-19",
    tier: 4,
    expression: "(2x + 3)(3x − 1) = 6x² + kx − 3",
    question: "Find k.",
    choices: [
      { id: "5", label: "5" },
      { id: "7", label: "7" },
      { id: "9", label: "9" },
      { id: "11", label: "11" }
    ],
    correctId: "7",
    hint: "O = −2x. I = 9x.",
    explain: "k = −2 + 9 = 7."
  },
  {
    id: "mv-20",
    tier: 4,
    expression: "4x² + 24x + 36 = c(x + d)²",
    question: "What is c?",
    choices: [
      { id: "2", label: "2" },
      { id: "4", label: "4" },
      { id: "6", label: "6" },
      { id: "9", label: "9" }
    ],
    correctId: "4",
    hint: "Factor out 4, then spot (x + 3)² inside.",
    explain: "4x² + 24x + 36 = 4(x² + 6x + 9) = 4(x + 3)². So c = 4."
  }
];

export const COMBINE_SIMPLIFY_PROBLEMS: CombineSimplifyProblem[] = [
  {
    id: "cs-01",
    tier: 1,
    expression: "2(x + 3) + 3(x + 1)",
    question: "Simplify (distribute, then combine like terms).",
    choices: [
      { id: "a", label: "5x + 9" },
      { id: "b", label: "5x + 6" },
      { id: "c", label: "6x + 9" },
      { id: "d", label: "x + 9" }
    ],
    correctId: "a",
    hint: "2x + 6 + 3x + 3.",
    explain: "2x + 3x = 5x and 6 + 3 = 9."
  },
  {
    id: "cs-02",
    tier: 1,
    expression: "x² + 3x + 2x + 6",
    question: "Combine like terms.",
    choices: [
      { id: "a", label: "x² + 5x + 6" },
      { id: "b", label: "x² + 6x + 5" },
      { id: "c", label: "2x² + 5x + 6" },
      { id: "d", label: "x² + 5x + 5" }
    ],
    correctId: "a",
    hint: "Only the x terms combine.",
    explain: "3x + 2x = 5x. Answer: x² + 5x + 6."
  },
  {
    id: "cs-03",
    tier: 1,
    expression: "(x + 2)(x + 3)",
    question: "Which is the simplified expanded form?",
    choices: [
      { id: "a", label: "x² + 5x + 6" },
      { id: "b", label: "x² + 6x + 5" },
      { id: "c", label: "x² + 5x + 5" },
      { id: "d", label: "2x² + 5x + 6" }
    ],
    correctId: "a",
    hint: "FOIL, then combine O + I.",
    explain: "F = x², O + I = 5x, L = 6."
  },
  {
    id: "cs-04",
    tier: 1,
    expression: "3x² + x² + 2x − x",
    question: "Combine like terms.",
    choices: [
      { id: "a", label: "4x² + x" },
      { id: "b", label: "4x² + 3x" },
      { id: "c", label: "3x² + x" },
      { id: "d", label: "4x² − x" }
    ],
    correctId: "a",
    hint: "Group x² terms and x terms separately.",
    explain: "3x² + x² = 4x² and 2x − x = x."
  },
  {
    id: "cs-05",
    tier: 1,
    expression: "4x + 2(x − 3)",
    question: "Simplify.",
    choices: [
      { id: "a", label: "6x − 6" },
      { id: "b", label: "6x + 6" },
      { id: "c", label: "4x − 6" },
      { id: "d", label: "2x − 6" }
    ],
    correctId: "a",
    hint: "Distribute the 2 first.",
    explain: "4x + 2x − 6 = 6x − 6."
  },
  {
    id: "cs-06",
    tier: 2,
    expression: "2(x + 4) − (x − 2)",
    question: "Simplify (watch the minus sign).",
    choices: [
      { id: "a", label: "x + 10" },
      { id: "b", label: "x + 6" },
      { id: "c", label: "3x + 6" },
      { id: "d", label: "x + 2" }
    ],
    correctId: "a",
    hint: "−(x − 2) becomes −x + 2.",
    explain: "2x + 8 − x + 2 = x + 10."
  },
  {
    id: "cs-07",
    tier: 2,
    expression: "x(x + 5) + 3(x + 2)",
    question: "Expand and combine.",
    choices: [
      { id: "a", label: "x² + 8x + 6" },
      { id: "b", label: "x² + 5x + 6" },
      { id: "c", label: "4x² + 8x + 6" },
      { id: "d", label: "x² + 8x + 5" }
    ],
    correctId: "a",
    hint: "x² + 5x + 3x + 6.",
    explain: "x² + 8x + 6."
  },
  {
    id: "cs-08",
    tier: 2,
    expression: "(x + 1)² − x²",
    question: "Expand both pieces, then simplify.",
    choices: [
      { id: "a", label: "2x + 1" },
      { id: "b", label: "2x − 1" },
      { id: "c", label: "1" },
      { id: "d", label: "x² + 2x + 1" }
    ],
    correctId: "a",
    hint: "(x + 1)² = x² + 2x + 1.",
    explain: "x² + 2x + 1 − x² = 2x + 1."
  },
  {
    id: "cs-09",
    tier: 2,
    expression: "5x − 2(x + 3) + 4",
    question: "Simplify.",
    choices: [
      { id: "a", label: "3x − 2" },
      { id: "b", label: "3x + 10" },
      { id: "c", label: "7x − 2" },
      { id: "d", label: "3x − 10" }
    ],
    correctId: "a",
    hint: "−2(x + 3) = −2x − 6.",
    explain: "5x − 2x − 6 + 4 = 3x − 2."
  },
  {
    id: "cs-10",
    tier: 2,
    expression: "x² + 5x + 3x + 15",
    question: "Combine like terms.",
    choices: [
      { id: "a", label: "x² + 8x + 15" },
      { id: "b", label: "x² + 5x + 18" },
      { id: "c", label: "2x² + 8x + 15" },
      { id: "d", label: "x² + 3x + 20" }
    ],
    correctId: "a",
    hint: "5x and 3x are like terms.",
    explain: "x² + 8x + 15."
  },
  {
    id: "cs-11",
    tier: 3,
    expression: "(x + 2)(x + 3) + (x − 1)(x + 1)",
    question: "Expand both products, then combine.",
    choices: [
      { id: "a", label: "2x² + 5x + 7" },
      { id: "b", label: "2x² + 5x + 5" },
      { id: "c", label: "x² + 5x + 7" },
      { id: "d", label: "2x² + 7x + 5" }
    ],
    correctId: "b",
    hint: "Second product is difference of squares: x² − 1.",
    explain: "x² + 5x + 6 + x² − 1 = 2x² + 5x + 5."
  },
  {
    id: "cs-12",
    tier: 3,
    expression: "(x + 4)² − (x + 1)(x + 7)",
    question: "Expand, then combine like terms.",
    choices: [
      { id: "a", label: "9" },
      { id: "b", label: "x + 9" },
      { id: "c", label: "2x + 9" },
      { id: "d", label: "x + 16" }
    ],
    correctId: "a",
    hint: "(x + 4)² = x² + 8x + 16. The second product is x² + 8x + 7.",
    explain: "x² + 8x + 16 − (x² + 8x + 7) = 9."
  },
  {
    id: "cs-13",
    tier: 3,
    expression: "2(x + 1)² − 2x²",
    question: "Expand, then simplify.",
    choices: [
      { id: "a", label: "4x + 2" },
      { id: "b", label: "2x + 2" },
      { id: "c", label: "4x" },
      { id: "d", label: "2x² + 4x + 2" }
    ],
    correctId: "a",
    hint: "2(x² + 2x + 1) = 2x² + 4x + 2.",
    explain: "2x² + 4x + 2 − 2x² = 4x + 2."
  },
  {
    id: "cs-14",
    tier: 3,
    expression: "(x + 3)(x − 2) + (x + 5)(x − 4)",
    question: "Expand both, then combine like terms.",
    choices: [
      { id: "a", label: "2x² + 2x − 26" },
      { id: "b", label: "2x² + 2x − 14" },
      { id: "c", label: "x² + 2x − 26" },
      { id: "d", label: "2x² + 4x − 26" }
    ],
    correctId: "a",
    hint: "First: x² + x − 6. Second: x² + x − 20.",
    explain: "(x² + x − 6) + (x² + x − 20) = 2x² + 2x − 26."
  },
  {
    id: "cs-15",
    tier: 3,
    expression: "3(2x − 1) − 2(x + 4)",
    question: "Distribute, then combine.",
    choices: [
      { id: "a", label: "4x − 11" },
      { id: "b", label: "4x − 3" },
      { id: "c", label: "8x − 11" },
      { id: "d", label: "4x + 11" }
    ],
    correctId: "a",
    hint: "6x − 3 − 2x − 8.",
    explain: "6x − 2x = 4x and −3 − 8 = −11."
  },
  {
    id: "cs-16",
    tier: 4,
    expression: "(2x + 1)(x + 3) − (x − 2)(x + 5)",
    question: "Expand both products, then combine.",
    choices: [
      { id: "a", label: "x² + 4x + 13" },
      { id: "b", label: "x² + 6x + 13" },
      { id: "c", label: "2x² + 4x + 13" },
      { id: "d", label: "x² + 4x + 3" }
    ],
    correctId: "a",
    hint: "First product: 2x² + 7x + 3. Second: x² + 3x − 10.",
    explain: "(2x² + 7x + 3) − (x² + 3x − 10) = x² + 4x + 13."
  },
  {
    id: "cs-17",
    tier: 4,
    expression: "(x + 2)² + (x − 2)² − 2x²",
    question: "Expand, combine, then simplify.",
    choices: [
      { id: "a", label: "8" },
      { id: "b", label: "4x" },
      { id: "c", label: "2x² + 8" },
      { id: "d", label: "4x² + 8" }
    ],
    correctId: "a",
    hint: "Each square has middle term ±4x. Those cancel when you add.",
    explain: "(x² + 4x + 4) + (x² − 4x + 4) − 2x² = 8."
  },
  {
    id: "cs-18",
    tier: 4,
    expression: "x(2x + 3) − (x − 1)(x + 4)",
    question: "Expand, then combine like terms.",
    choices: [
      { id: "a", label: "x² + 7" },
      { id: "b", label: "x² + 3x + 7" },
      { id: "c", label: "3x² + 7" },
      { id: "d", label: "x² − x + 7" }
    ],
    correctId: "a",
    hint: "x(2x + 3) = 2x² + 3x. The second product is x² + 3x − 4.",
    explain: "2x² + 3x − (x² + 3x − 4) = x² + 7."
  },
  {
    id: "cs-19",
    tier: 4,
    expression: "4(x + 1)(x − 1) + 2(x + 3)²",
    question: "Use identities, then combine.",
    choices: [
      { id: "a", label: "2x² + 12x + 14" },
      { id: "b", label: "6x² + 12x + 14" },
      { id: "c", label: "2x² + 12x + 10" },
      { id: "d", label: "4x² + 12x + 14" }
    ],
    correctId: "b",
    hint: "4(x + 1)(x − 1) = 4(x² − 1). And 2(x + 3)² = 2(x² + 6x + 9).",
    explain: "4x² − 4 + 2x² + 12x + 18 = 6x² + 12x + 14."
  },
  {
    id: "cs-20",
    tier: 4,
    expression: "(3x − 2)(x + 4) − (x + 1)(x − 5)",
    question: "Full expand-and-combine (SAT speed rep).",
    choices: [
      { id: "a", label: "2x² + 14x − 3" },
      { id: "b", label: "2x² + 13x − 3" },
      { id: "c", label: "3x² + 14x − 3" },
      { id: "d", label: "2x² + 14x + 3" }
    ],
    correctId: "a",
    hint: "First: 3x² + 10x − 8. Second: x² − 4x − 5.",
    explain: "(3x² + 10x − 8) − (x² − 4x − 5) = 2x² + 14x − 3."
  }
];