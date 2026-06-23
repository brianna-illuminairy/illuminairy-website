'use client';

import { QuizProvider } from './state';
import QuizRunner from './QuizRunner';
import type { LabQuizSnapshot } from '@/lib/quiz-funnel-b/quiz-cookie';

export function QuizClientRoot({ initialSnapshot }: { initialSnapshot: LabQuizSnapshot | null }) {
  return (
    <QuizProvider initialSnapshot={initialSnapshot}>
      <QuizRunner />
    </QuizProvider>
  );
}
