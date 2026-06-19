export type {
  MissDiff,
  QuestionCell,
  ModuleMap,
  SectionMap,
} from "@/lib/diagnostic/report-types";
import type { MissDiff, QuestionCell, SectionMap } from "@/lib/diagnostic/report-types";

function cells(total: number, misses: Record<number, MissDiff>): QuestionCell[] {
  const out: QuestionCell[] = [];
  for (let i = 1; i <= total; i++) {
    out.push({ n: i, miss: misses[i] });
  }
  return out;
}

export const QUESTION_MAP: SectionMap[] = [
  {
    title: "Reading & Writing · 47 of 54",
    summary: "47 of 54",
    modules: [
      {
        label: "Module 1 · 25 / 27 correct",
        correct: 25,
        total: 27,
        cells: cells(27, { 18: "M", 22: "E" }),
      },
      {
        label: "Module 2 · 22 / 27 correct",
        correct: 22,
        total: 27,
        cells: cells(27, { 12: "H", 14: "H", 20: "H", 22: "M", 23: "M" }),
      },
    ],
  },
  {
    title: "Math · 38 of 44",
    summary: "38 of 44",
    modules: [
      {
        label: "Module 1 · 21 / 22 correct",
        correct: 21,
        total: 22,
        cells: cells(22, { 9: "M" }),
      },
      {
        label: "Module 2 · 17 / 22 correct",
        correct: 17,
        total: 22,
        cells: cells(22, { 12: "M", 13: "H", 16: "H", 20: "H", 22: "H" }),
      },
    ],
  },
];

export const DIFFICULTY_READOUT = [
  {
    label: "Reading and Writing · 47 of 54",
    easy: 88,
    medium: 87,
    hard: 87,
  },
  {
    label: "Math · 38 of 44",
    easy: 100,
    medium: 88,
    hard: 73,
  },
] as const;

export const RW_MISS_TABLE = [
  { mod: "1", q: "22", topic: "Transitions", diff: "easy" as const, correct: "b", marked: "c" },
  { mod: "1", q: "18", topic: "Boundaries", diff: "med" as const, correct: "c", marked: "a" },
  {
    mod: "2",
    q: "22",
    topic: "Form, Structure & Sense (Subject-Verb)",
    diff: "med" as const,
    correct: "c",
    marked: "a",
  },
  { mod: "2", q: "23", topic: "Transitions", diff: "med" as const, correct: "c", marked: "d" },
  { mod: "2", q: "12", topic: "Command of Evidence", diff: "hard" as const, correct: "d", marked: "b" },
  { mod: "2", q: "14", topic: "Command of Evidence", diff: "hard" as const, correct: "b", marked: "a" },
  { mod: "2", q: "20", topic: "Boundaries", diff: "hard" as const, correct: "b", marked: "d" },
];

export const MATH_MISS_TABLE = [
  {
    mod: "1",
    q: "9",
    topic: "Nonlinear equations in one variable",
    diff: "med" as const,
    correct: "d",
    marked: "c",
  },
  {
    mod: "2",
    q: "12",
    topic: "Area and volume",
    diff: "med" as const,
    correct: "a",
    marked: "b",
  },
  {
    mod: "2",
    q: "13",
    topic: "Equivalent expressions (factoring)",
    diff: "hard" as const,
    correct: "4",
    marked: "13.15",
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
    topic: "Nonlinear functions (factor theorem)",
    diff: "hard" as const,
    correct: "b",
    marked: "d",
  },
  {
    mod: "2",
    q: "22",
    topic: "Ratios, rates, proportional relationships",
    diff: "hard" as const,
    correct: "c",
    marked: "b",
  },
];

export const RW_PRIORITY = [
  { topic: "Transitions", pts: "52 pts" },
  { topic: "Boundaries", pts: "33 pts" },
  { topic: "Command of Evidence", pts: "22 pts" },
  { topic: "Subject Verb Agreement", pts: "16 pts" },
];

export const MATH_PRIORITY = [
  { topic: "Factoring and factor theorem", pts: "48 pts" },
  { topic: "Surface area / non-formula geometry", pts: "16 pts" },
];
