import {
  DIFFICULTY_READOUT,
  QUESTION_MAP,
  SHERMEEN_HERO,
} from "@/lib/shermeen/diagnostic-report-data";
import {
  DifficultyReadout as SharedDifficultyReadout,
  DiagnosticHero as SharedDiagnosticHero,
  MissTable,
  PatternCard,
  PriorityList,
  QuestionPerformanceMap as SharedQuestionPerformanceMap,
  SectionHead,
  type DifficultyRow,
} from "@/components/diagnostic/report-visuals";

export {
  MissTable,
  PatternCard,
  PriorityList,
  SectionHead,
};

export function DiagnosticHero() {
  return <SharedDiagnosticHero {...SHERMEEN_HERO} />;
}

export function QuestionPerformanceMap() {
  return (
    <SharedQuestionPerformanceMap sections={QUESTION_MAP} totalCorrect={64} totalQuestions={98} />
  );
}

export function DifficultyReadout() {
  return <SharedDifficultyReadout rows={DIFFICULTY_READOUT as readonly DifficultyRow[]} />;
}

export {
  ShermeenHabitsGrid,
  ShermeenMathFormulaReference,
  WorkedExampleM2Q20,
  WorkedExampleM2Q9,
  WorkedExampleQ9,
} from "./diagnostic-visuals-extras";
