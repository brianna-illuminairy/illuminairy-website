'use client';

import dynamic from 'next/dynamic';
import { QuizProvider } from './state';
import type { QuizSnapshot } from '@/lib/quiz-funnel/quiz-cookie';

const QuizRunnerNoSSR = dynamic(() => import('./QuizRunner'), {
  ssr: false,
  loading: () => (
    <div className="qf-page" style={{ color: 'var(--qf-ink)' }}>
      <div className="qf-body">
        <div className="qf-body-inner">
          <p className="qf-lead muted">Loading your plan...</p>
        </div>
      </div>
    </div>
  ),
});

export function QuizClientRoot({ initialSnapshot }: { initialSnapshot: QuizSnapshot | null }) {
  return (
    <QuizProvider initialSnapshot={initialSnapshot}>
      <QuizRunnerNoSSR />
    </QuizProvider>
  );
}
