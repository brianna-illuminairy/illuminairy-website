'use client';

import { useEffect, useRef } from 'react';
import {
  captureQuizSessionStarted,
  captureQuizStarted,
  captureQuizStep,
} from '@/lib/quiz-funnel-b/analytics';
import type { QuizAnswers } from './state';

const QUIZ_STARTED_LIFETIME_KEY = 'illuminairy_qfb_started';
const QUIZ_SESSION_STARTED_KEY = 'illuminairy_qfb_session_started';

export function useQuizAnalytics(
  stepId: string,
  stepIndex: number,
  answers: QuizAnswers,
  enabled = true
) {
  const lastStep = useRef<string | null>(null);
  const sessionStarted = useRef(false);
  const lifetimeStarted = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    if (!stepId || stepIndex < 0) return;
    if (lastStep.current === stepId) return;
    lastStep.current = stepId;

    const meta = { stepId, stepIndex };

    if (!sessionStarted.current && typeof window !== 'undefined') {
      try {
        if (!sessionStorage.getItem(QUIZ_SESSION_STARTED_KEY)) {
          sessionStorage.setItem(QUIZ_SESSION_STARTED_KEY, '1');
          sessionStarted.current = true;
          captureQuizSessionStarted(answers as Record<string, unknown>, meta);
        } else {
          sessionStarted.current = true;
        }
      } catch {
        if (!sessionStarted.current) {
          sessionStarted.current = true;
          captureQuizSessionStarted(answers as Record<string, unknown>, meta);
        }
      }
    }

    if (!lifetimeStarted.current && typeof window !== 'undefined') {
      try {
        if (!localStorage.getItem(QUIZ_STARTED_LIFETIME_KEY)) {
          localStorage.setItem(QUIZ_STARTED_LIFETIME_KEY, '1');
          lifetimeStarted.current = true;
          captureQuizStarted(answers as Record<string, unknown>, meta);
        } else {
          lifetimeStarted.current = true;
        }
      } catch {
        if (!lifetimeStarted.current) {
          lifetimeStarted.current = true;
          captureQuizStarted(answers as Record<string, unknown>, meta);
        }
      }
    }

    captureQuizStep(stepId, stepIndex, answers, { hasGapScreen: false });
  }, [stepId, stepIndex, answers, enabled]);
}
