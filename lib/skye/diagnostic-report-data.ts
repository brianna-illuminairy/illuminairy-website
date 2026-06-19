export type {
  MissDiff,
  QuestionCell,
  ModuleMap,
  SectionMap,
} from "@/lib/diagnostic/report-types";
import type { MissDiff, QuestionCell } from "@/lib/diagnostic/report-types";

function cells(total: number, misses: Record<number, MissDiff>): QuestionCell[] {
  const out: QuestionCell[] = [];
  for (let i = 1; i <= total; i++) {
    out.push({ n: i, miss: misses[i] });
  }
  return out;
}

export const QUESTION_MAP = [
  {
    title: "Reading & Writing · 34 of 54",
    summary: "34 of 54",
    modules: [
      {
        label: "Module 1 · 14 / 27 correct",
        correct: 14,
        total: 27,
        cells: cells(27, {
          1: "M",
          2: "H",
          6: "H",
          8: "M",
          13: "H",
          17: "M",
          18: "M",
          21: "M",
          22: "E",
          23: "E",
          24: "E",
          26: "E",
          27: "M",
        }),
      },
      {
        label: "Module 2 · 20 / 27 correct",
        correct: 20,
        total: 27,
        cells: cells(27, {
          1: "E",
          3: "M",
          5: "M",
          8: "M",
          16: "M",
          24: "E",
        }),
      },
    ],
  },
  {
    title: "Math · 29 of 44",
    summary: "29 of 44",
    modules: [
      {
        label: "Module 1 · 11 / 22 correct",
        correct: 11,
        total: 22,
        cells: cells(22, {
          5: "E",
          7: "E",
          9: "M",
          11: "M",
          13: "M",
          14: "M",
          16: "H",
          17: "M",
          18: "H",
          21: "H",
          22: "H",
        }),
      },
      {
        label: "Module 2 · 18 / 22 correct",
        correct: 18,
        total: 22,
        cells: cells(22, {
          2: "E",
          11: "M",
          18: "M",
          22: "H",
        }),
      },
    ],
  },
];

export const DIFFICULTY_READOUT = [
  {
    label: "Reading and Writing · 34 of 54",
    easy: 67,
    medium: 52,
    hard: 77,
  },
  {
    label: "Math · 29 of 44",
    easy: 86,
    medium: 56,
    hard: 73,
  },
] as const;

export const RW_MISS_TABLE = [
  { mod: "1", q: "1", topic: "Words in Context", diff: "med" as const, correct: "b", marked: "c" },
  { mod: "1", q: "2", topic: "Words in Context", diff: "hard" as const, correct: "b", marked: "a" },
  { mod: "1", q: "6", topic: "Text Structure and Purpose", diff: "hard" as const, correct: "b", marked: "a" },
  { mod: "1", q: "8", topic: "Central Ideas and Details", diff: "med" as const, correct: "b", marked: "d" },
  { mod: "1", q: "13", topic: "Command of Evidence", diff: "hard" as const, correct: "a", marked: "c" },
  { mod: "1", q: "17", topic: "Boundaries", diff: "med" as const, correct: "d", marked: "c" },
  { mod: "1", q: "18", topic: "Boundaries", diff: "med" as const, correct: "c", marked: "a" },
  { mod: "1", q: "21", topic: "Form, Structure, and Sense", diff: "med" as const, correct: "a", marked: "d" },
  { mod: "1", q: "22", topic: "Transitions", diff: "easy" as const, correct: "b", marked: "d" },
  { mod: "1", q: "23", topic: "Transitions", diff: "easy" as const, correct: "a", marked: "d" },
  { mod: "1", q: "24", topic: "Transitions", diff: "easy" as const, correct: "b", marked: "c" },
  { mod: "1", q: "26", topic: "Rhetorical Synthesis", diff: "easy" as const, correct: "d", marked: "b" },
  { mod: "1", q: "27", topic: "Rhetorical Synthesis", diff: "med" as const, correct: "a", marked: "c" },
  { mod: "2", q: "1", topic: "Words in Context", diff: "easy" as const, correct: "a", marked: "b" },
  { mod: "2", q: "3", topic: "Words in Context", diff: "med" as const, correct: "b", marked: "a" },
  { mod: "2", q: "5", topic: "Text Structure and Purpose", diff: "med" as const, correct: "a", marked: "c" },
  { mod: "2", q: "8", topic: "Central Ideas and Details", diff: "med" as const, correct: "b", marked: "d" },
  { mod: "2", q: "16", topic: "Boundaries", diff: "med" as const, correct: "b", marked: "a" },
  { mod: "2", q: "24", topic: "Transitions", diff: "easy" as const, correct: "b", marked: "a" },
];

export const MATH_MISS_TABLE = [
  { mod: "1", q: "5", topic: "Systems of two linear equations", diff: "easy" as const, correct: "b", marked: "c" },
  { mod: "1", q: "7", topic: "Nonlinear equations", diff: "easy" as const, correct: "b", marked: "d" },
  { mod: "1", q: "9", topic: "Nonlinear equations", diff: "med" as const, correct: "d", marked: "c" },
  { mod: "1", q: "11", topic: "Exponential functions", diff: "med" as const, correct: "b", marked: "c" },
  { mod: "1", q: "13", topic: "Circle measures (radians)", diff: "med" as const, correct: "c", marked: "a" },
  { mod: "1", q: "14", topic: "Linear functions (intercepts)", diff: "med" as const, correct: "c", marked: "a" },
  { mod: "1", q: "16", topic: "Radical equations", diff: "hard" as const, correct: "b", marked: "a" },
  { mod: "1", q: "17", topic: "Linear functions (slope)", diff: "med" as const, correct: "c", marked: "b" },
  { mod: "1", q: "18", topic: "Perpendicular lines", diff: "hard" as const, correct: "d", marked: "b" },
  { mod: "1", q: "21", topic: "Circle measures (arc length)", diff: "hard" as const, correct: "b", marked: "a" },
  { mod: "1", q: "22", topic: "Tangent line and parabola", diff: "hard" as const, correct: "b", marked: "a" },
  { mod: "2", q: "2", topic: "Equation manipulation", diff: "easy" as const, correct: "b", marked: "a" },
  { mod: "2", q: "11", topic: "Linear functions (slope)", diff: "med" as const, correct: "c", marked: "b" },
  { mod: "2", q: "18", topic: "Exponential functions", diff: "med" as const, correct: "b", marked: "c" },
  { mod: "2", q: "22", topic: "Function transformations", diff: "hard" as const, correct: "b", marked: "a" },
];

export const SKYE_HERO = {
  studentName: "Skye",
  totalRange: "1090–1140",
  rwRange: "540–560",
  mathRange: "550–580",
  note: "Skye scored 1090–1140 on her June 18 full-length diagnostic. Reading and writing (540–560) and math (550–580) are close, but Module 1 routing in both sections capped her second-module difficulty mix.",
};

export const SKYE_FORMULAS = [
  { label: "Slope from two points", formula: "m = (y₂ − y₁) / (x₂ − x₁)" },
  { label: "Quadratic formula", formula: "x = (−b ± √(b² − 4ac)) / (2a)" },
  { label: "Discriminant", formula: "b² − 4ac = 0 means exactly one solution" },
  { label: "Radians to degrees", formula: "degrees = radians × 180 / π" },
  { label: "Arc length", formula: "arc = (central angle ÷ 360) × circumference" },
  { label: "Exponential form", formula: "f(x) = a · b^x" },
  { label: "Perpendicular slope", formula: "negative reciprocal of the other line's slope" },
];
