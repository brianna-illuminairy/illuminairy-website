export type MissDiff = "E" | "M" | "H";

export type QuestionCell = { n: number; miss?: MissDiff };

export type ModuleMap = {
  label: string;
  correct: number;
  total: number;
  cells: QuestionCell[];
};

export type SectionMap = {
  title: string;
  summary: string;
  modules: ModuleMap[];
};
