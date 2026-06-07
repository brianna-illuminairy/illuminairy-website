'use client';

import { useEffect, useRef } from 'react';
import { captureQuizStarted, captureQuizStep } from '@/lib/quiz-funnel/analytics';
import { QUIZ_ENTRY_STEP } from '@/lib/quiz-funnel/funnel-steps';
import type { QuizAnswers } from './state';

const QUIZ_STARTED_KEY = 'illuminairy_quiz_started';

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

    if (stepId === QUIZ_ENTRY_STEP && typeof window !== 'undefined') {
      try {
        if (!sessionStorage.getItem(QUIZ_STARTED_KEY)) {
          sessionStorage.setItem(QUIZ_STARTED_KEY, '1');
          captureQuizStarted(answers as Record<string, unknown>);
        }
      } catch {
        captureQuizStarted(answers as Record<string, unknown>);
      }
    }

    captureQuizStep(stepId, stepIndex, answers, { hasGapScreen });
  }, [stepId, stepIndex, answers, hasGapScreen]);
}
