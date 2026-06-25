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
        label: "Module 1 · 21 / 27 correct",
        correct: 21,
        total: 27,
        cells: cells(27, {
          10: "E",
          11: "E",
          15: "M",
          20: "E",
          23: "E",
          24: "E",
          26: "E",
        }),
      },
      {
        label: "Module 2 · 13 / 27 correct",
        correct: 13,
        total: 27,
        cells: cells(27, {
          2: "M",
          6: "M",
          8: "H",
          10: "M",
          11: "H",
          14: "H",
          15: "H",
          17: "H",
          18: "M",
          20: "H",
          21: "M",
          22: "M",
          23: "M",
          24: "H",
        }),
      },
    ],
  },
  {
    title: "Math · 30 of 44",
    summary: "30 of 44",
    modules: [
      {
        label: "Module 1 · 16 / 22 correct",
        correct: 16,
        total: 22,
        cells: cells(22, {
          9: "M",
          11: "M",
          13: "M",
          14: "M",
          20: "H",
          21: "H",
        }),
      },
      {
        label: "Module 2 · 14 / 22 correct",
        correct: 14,
        total: 22,
        cells: cells(22, {
          1: "E",
          2: "M",
          4: "M",
          6: "M",
          8: "M",
          9: "M",
          10: "M",
          14: "M",
          16: "H",
          20: "H",
          22: "H",
        }),
      },
    ],
  },
];

export const DIFFICULTY_READOUT = [
  {
    label: "Reading and Writing · 34 of 54 correct",
    easy: 38,
    medium: 65,
    hard: 70,
  },
  {
    label: "Math · 30 of 44 correct",
    easy: 92,
    medium: 50,
    hard: 67,
  },
] as const;

export const RW_MISS_TABLE = [
  { mod: "1", q: "10", topic: "Command of Evidence", diff: "easy" as const, correct: "a", marked: "b" },
  { mod: "1", q: "11", topic: "Command of Evidence", diff: "easy" as const, correct: "a", marked: "b" },
  { mod: "1", q: "15", topic: "Inferences", diff: "med" as const, correct: "d", marked: "b" },
  { mod: "1", q: "20", topic: "Form, Structure, and Sense", diff: "easy" as const, correct: "b", marked: "d" },
  { mod: "1", q: "23", topic: "Transitions", diff: "easy" as const, correct: "a", marked: "b" },
  { mod: "1", q: "24", topic: "Transitions", diff: "easy" as const, correct: "b", marked: "c" },
  { mod: "1", q: "26", topic: "Rhetorical Synthesis", diff: "easy" as const, correct: "d", marked: "a" },
  { mod: "2", q: "2", topic: "Words in Context", diff: "med" as const, correct: "a", marked: "b" },
  { mod: "2", q: "6", topic: "Text Structure and Purpose", diff: "med" as const, correct: "b", marked: "a" },
  { mod: "2", q: "8", topic: "Text Structure and Purpose", diff: "hard" as const, correct: "d", marked: "b" },
  { mod: "2", q: "10", topic: "Central Ideas and Details", diff: "med" as const, correct: "a", marked: "b" },
  { mod: "2", q: "11", topic: "Central Ideas and Details", diff: "hard" as const, correct: "b", marked: "c" },
  { mod: "2", q: "14", topic: "Command of Evidence", diff: "hard" as const, correct: "b", marked: "c" },
  { mod: "2", q: "15", topic: "Command of Evidence", diff: "hard" as const, correct: "c", marked: "a" },
  { mod: "2", q: "17", topic: "Inferences", diff: "hard" as const, correct: "a", marked: "c" },
  { mod: "2", q: "18", topic: "Boundaries", diff: "med" as const, correct: "d", marked: "a" },
  { mod: "2", q: "20", topic: "Boundaries", diff: "hard" as const, correct: "b", marked: "c" },
  { mod: "2", q: "21", topic: "Form, Structure, and Sense", diff: "med" as const, correct: "b", marked: "a" },
  { mod: "2", q: "22", topic: "Form, Structure, and Sense", diff: "med" as const, correct: "c", marked: "a" },
  { mod: "2", q: "23", topic: "Transitions", diff: "med" as const, correct: "c", marked: "d" },
  { mod: "2", q: "24", topic: "Transitions", diff: "hard" as const, correct: "a", marked: "d" },
];

export const MATH_MISS_TABLE = [
  {
    mod: "1",
    q: "9",
    topic: "Nonlinear equations in one variable",
    diff: "med" as const,
    correct: "d",
    marked: "a",
  },
  {
    mod: "1",
    q: "11",
    topic: "Nonlinear functions",
    diff: "med" as const,
    correct: "b",
    marked: "d",
  },
  {
    mod: "1",
    q: "13",
    topic: "Circles",
    diff: "med" as const,
    correct: "c",
    marked: "b",
  },
  {
    mod: "1",
    q: "14",
    topic: "Linear functions (intercepts)",
    diff: "med" as const,
    correct: "a",
    marked: "d",
  },
  {
    mod: "1",
    q: "20",
    topic: "Probability and conditional probability",
    diff: "hard" as const,
    correct: "a",
    marked: "b",
  },
  {
    mod: "1",
    q: "21",
    topic: "Circles (arc length)",
    diff: "hard" as const,
    correct: "b",
    marked: "c",
  },
  {
    mod: "2",
    q: "1",
    topic: "One-variable data",
    diff: "easy" as const,
    correct: "b",
    marked: "a",
  },
  {
    mod: "2",
    q: "2",
    topic: "Nonlinear equations in one variable",
    diff: "med" as const,
    correct: "a",
    marked: "c",
  },
  {
    mod: "2",
    q: "4",
    topic: "Linear functions",
    diff: "med" as const,
    correct: "b",
    marked: "c",
  },
  {
    mod: "2",
    q: "6",
    topic: "Nonlinear functions",
    diff: "med" as const,
    correct: "b",
    marked: "d",
  },
  {
    mod: "2",
    q: "8",
    topic: "Systems of two linear equations",
    diff: "med" as const,
    correct: "−2.112",
    marked: "(blank)",
  },
  {
    mod: "2",
    q: "9",
    topic: "Equivalent expressions",
    diff: "med" as const,
    correct: "d",
    marked: "c",
  },
  {
    mod: "2",
    q: "10",
    topic: "Circles",
    diff: "med" as const,
    correct: "342",
    marked: "(blank)",
  },
  {
    mod: "2",
    q: "14",
    topic: "Nonlinear functions",
    diff: "med" as const,
    correct: "6",
    marked: "(blank)",
  },
  {
    mod: "2",
    q: "16",
    topic: "Linear equations in two variables",
    diff: "hard" as const,
    correct: "a",
    marked: "b",
  },
  {
    mod: "2",
    q: "20",
    topic: "Nonlinear functions",
    diff: "hard" as const,
    correct: "b",
    marked: "c",
  },
  {
    mod: "2",
    q: "22",
    topic: "Ratios, rates, and proportional relationships",
    diff: "hard" as const,
    correct: "c",
    marked: "b",
  },
];

export const SHERMEEN_HERO = {
  studentName: "Shermeen Sohail",
  totalRange: "1100–1150",
  rwRange: "540–560",
  mathRange: "560–590",
  note:
    "Shermeen's proctored diagnostic landed between 1100 and 1150. Math was the stronger section (560–590) and Reading and Writing was slightly lower (540–560). Before this test, her unproctored Blue Book practice average was about 1080.",
};
