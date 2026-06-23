'use client';

import { useEffect, useRef } from 'react';
import type { QuizAnswers } from '@/app/quiz-c/state';
import {
  captureScoreReviewStarted,
  captureScoreReviewStepViewed,
} from '@/lib/score-review-funnel/analytics';

const STARTED_KEY = 'qsr_started';

export function useQuizAnalytics(
  stepId: string,
  stepIndex: number,
  _answers: QuizAnswers,
  hydrated: boolean
) {
  const stepTrackedRef = useRef<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!hydrated) return;
    if (stepTrackedRef.current === stepId) return;
    stepTrackedRef.current = stepId;
    captureScoreReviewStepViewed(stepId, stepIndex);
  }, [hydrated, stepId, stepIndex]);

  useEffect(() => {
    if (!hydrated || startedRef.current) return;
    startedRef.current = true;
    try {
      if (localStorage.getItem(STARTED_KEY)) return;
      localStorage.setItem(STARTED_KEY, '1');
    } catch {
      // ignore
    }
    captureScoreReviewStarted(stepId, stepIndex);
  }, [hydrated, stepId, stepIndex]);
}
