'use client';

import { useEffect, useRef } from 'react';
import { captureQuizStep } from '@/lib/quiz-funnel/analytics';
import type { QuizAnswers } from './state';

export function useQuizAnalytics(
  stepId: string,
  stepIndex: number,
  answers: QuizAnswers,
  hasGapScreen: boolean
) {
  const lastStep = useRef<string | null>(null);

  useEffect(() => {
    if (!stepId || stepIndex < 0) return;
    if (lastStep.current === stepId) return;
    lastStep.current = stepId;

    captureQuizStep(stepId, stepIndex, answers, { hasGapScreen });
  }, [stepId, stepIndex, answers, hasGapScreen]);
}
