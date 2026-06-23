'use client';

import { Suspense } from 'react';
import { QuizProvider } from './state';
import QuizRunner from './QuizRunner';

export function QuizClientRoot() {
  return (
    <QuizProvider>
      <Suspense fallback={null}>
        <QuizRunner />
      </Suspense>
    </QuizProvider>
  );
}
