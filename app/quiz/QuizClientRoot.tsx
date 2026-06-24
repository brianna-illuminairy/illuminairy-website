'use client';

import dynamic from 'next/dynamic';
import { useCallback } from 'react';
import { QuizProvider } from './state';
import type { QuizSnapshot } from '@/lib/quiz-funnel/quiz-cookie';

const QuizRunner = dynamic(() => import('./QuizRunner'), { ssr: false });

type QuizClientRootProps = {
  initialSnapshot: QuizSnapshot | null;
  dismissEntryShell?: boolean;
};

export function QuizClientRoot({ initialSnapshot, dismissEntryShell = false }: QuizClientRootProps) {
  const onRunnerMounted = useCallback(() => {
    if (!dismissEntryShell) return;
    document.getElementById('plan-a-entry-ssr')?.remove();
  }, [dismissEntryShell]);

  return (
    <QuizProvider initialSnapshot={initialSnapshot}>
      <QuizRunner onMounted={onRunnerMounted} />
    </QuizProvider>
  );
}
