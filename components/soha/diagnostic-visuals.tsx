import {
  DIFFICULTY_READOUT,
  QUESTION_MAP,
} from "@/lib/soha/diagnostic-report-data";
import {
  Callout,
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
  Callout,
  MissTable,
  PatternCard,
  PriorityList,
  SectionHead,
};

export function DiagnosticHero() {
  return (
    <SharedDiagnosticHero
      studentName="Soha Naveed"
      totalRange="1380–1430"
      rwRange="670–690"
      mathRange="710–740"
      note="Soha is performing in the upper 1300s to the lower 1400s, we estimate her current performance is between 1380 and 1430. Her math is stronger than her reading and writing, she scored 710-740 on math and a 670-690 on reading and writing."
    />
  );
}

export function QuestionPerformanceMap() {
  return (
    <SharedQuestionPerformanceMap sections={QUESTION_MAP} totalCorrect={85} totalQuestions={98} />
  );
}

export function DifficultyReadout() {
  return <SharedDifficultyReadout rows={DIFFICULTY_READOUT as readonly DifficultyRow[]} />;
}

export { WorkedExample } from "./diagnostic-visuals-soha-extras";
export { HabitsGrid } from "./diagnostic-visuals-soha-extras";
