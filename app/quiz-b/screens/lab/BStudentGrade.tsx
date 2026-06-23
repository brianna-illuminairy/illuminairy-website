'use client';

import { QFScreen, QFOption, QFQuestionHead } from '@/app/quiz/components/QFShell';
import {
  PLAN_B_GRADE_OPTIONS,
  PLAN_B_GRADE_SCHOOL_YEAR,
  planBGradeQuestion,
} from '@/lib/quiz-funnel-b/grade-copy';

type Props = {
  value?: string;
  qWho?: string;
  onSelect: (value: string) => void;
  onBack: () => void;
};

export function BStudentGrade({ value, qWho, onSelect, onBack }: Props) {
  return (
    <QFScreen stepIdx={2} onBack={onBack}>
      <QFQuestionHead title={planBGradeQuestion(qWho)} />
      <p className="qf-meta" style={{ marginTop: -8, marginBottom: 16, color: 'var(--qf-ink-mid)' }}>
        {PLAN_B_GRADE_SCHOOL_YEAR}
      </p>
      <div className="qf-options">
        {PLAN_B_GRADE_OPTIONS.map((option) => (
          <QFOption
            key={option.id}
            selected={value === option.id}
            onClick={() => onSelect(option.id)}
          >
            {option.label}
          </QFOption>
        ))}
      </div>
    </QFScreen>
  );
}
