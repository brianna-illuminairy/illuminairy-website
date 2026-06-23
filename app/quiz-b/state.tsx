'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useLayoutEffect,
  type ReactNode,
  type Dispatch,
} from 'react';
import { scheduleLabProgressSync } from '@/lib/quiz-funnel-b/quiz-progress-sync';
import type { LabQuizSnapshot } from '@/lib/quiz-funnel-b/quiz-cookie';
import { hasQuizProgress } from '@/lib/quiz-funnel-b/quiz-cookie';
import {
  persistQuizSnapshot,
  resolveHydratedQuizSnapshot,
  type StoredLabQuizAnswers,
} from '@/lib/quiz-funnel-b/quiz-storage';

export type QuizAnswers = {
  qWho?: string;
  qScoreLower?: string;
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
  q6: string[];
  q7: string[];
  q8?: string;
  q9?: string;
  qSchoolReferral?: string;
  bKhanStruggle?: string;
  bSatTutorBefore?: string;
  parentName: string;
  parentEmail: string;
  parentZip: string;
  parentPhone: string;
  childEmail: string;
  kidName: string;
  phoneVerifiedAt?: string;
  claimCommitment: boolean;
  lessonLinkShared: boolean;
  devicePreference?: string;
  confirmTcpa: boolean;
  strategyCallStart?: string;
  [key: string]: string | string[] | boolean | undefined;
};

const initialState: QuizAnswers = {
  q6: [],
  q7: [],
  parentName: '',
  parentEmail: '',
  parentZip: '',
  parentPhone: '',
  childEmail: '',
  kidName: '',
  claimCommitment: false,
  lessonLinkShared: false,
  confirmTcpa: false,
};

type QuizAction =
  | { type: 'SET_Q'; key: string; value?: string }
  | { type: 'TOGGLE_Q'; key: string; id: string }
  | { type: 'SET_FIELD'; key: string; value: unknown }
  | { type: 'HYDRATE'; data?: Partial<QuizAnswers>; lastStep?: string | null }
  | { type: 'LOAD'; data: Partial<QuizAnswers>; lastStep?: string | null }
  | { type: 'SET_LAST_STEP'; step: string };

type QuizStoreState = {
  answers: QuizAnswers;
  lastStep: string | null;
  hydrated: boolean;
};

const emptyStore = (): QuizStoreState => ({
  answers: initialState,
  lastStep: null,
  hydrated: false,
});

function mergeStoredAnswers(data: Partial<QuizAnswers> | StoredLabQuizAnswers): QuizAnswers {
  return { ...initialState, ...(data as Partial<QuizAnswers>) };
}

function storeReducer(state: QuizStoreState, action: QuizAction): QuizStoreState {
  switch (action.type) {
    case 'SET_Q':
      return { ...state, answers: { ...state.answers, [action.key]: action.value } };
    case 'TOGGLE_Q': {
      const prev = (state.answers[action.key] as string[]) || [];
      const next = prev.includes(action.id)
        ? prev.filter((x) => x !== action.id)
        : [...prev, action.id];
      return { ...state, answers: { ...state.answers, [action.key]: next } };
    }
    case 'SET_FIELD':
      return {
        ...state,
        answers: { ...state.answers, [action.key]: action.value as QuizAnswers[string] },
      };
    case 'HYDRATE':
      return {
        answers: action.data ? mergeStoredAnswers(action.data) : state.answers,
        lastStep: action.lastStep !== undefined ? action.lastStep : state.lastStep,
        hydrated: true,
      };
    case 'LOAD':
      return {
        ...state,
        answers: mergeStoredAnswers(action.data),
        lastStep: action.lastStep !== undefined ? action.lastStep : state.lastStep,
      };
    case 'SET_LAST_STEP':
      return { ...state, lastStep: action.step };
    default:
      return state;
  }
}

type QuizContextValue = {
  answers: QuizAnswers;
  dispatch: Dispatch<QuizAction>;
  lastStep: string | null;
  setLastStep: (step: string) => void;
  hydrated: boolean;
};

const QuizCtx = createContext<QuizContextValue | null>(null);

function initStoreFromSnapshot(snapshot?: LabQuizSnapshot | null): QuizStoreState {
  if (!snapshot || !hasQuizProgress(snapshot)) return emptyStore();
  return {
    answers: mergeStoredAnswers(snapshot.answers),
    lastStep: snapshot.lastStep,
    hydrated: false,
  };
}

export function QuizProvider({
  children,
  initialSnapshot = null,
}: {
  children: ReactNode;
  initialSnapshot?: LabQuizSnapshot | null;
}) {
  const [store, dispatch] = useReducer(storeReducer, initialSnapshot, initStoreFromSnapshot);
  const { answers, lastStep, hydrated } = store;

  useLayoutEffect(() => {
    const merged = resolveHydratedQuizSnapshot(initialSnapshot);
    if (merged && hasQuizProgress(merged)) {
      dispatch({
        type: 'HYDRATE',
        data: merged.answers as Partial<QuizAnswers>,
        lastStep: merged.lastStep,
      });
      persistQuizSnapshot({ ...merged, updatedAt: Date.now() });
      return;
    }
    dispatch({ type: 'HYDRATE' });
  }, [initialSnapshot]);

  useEffect(() => {
    if (!hydrated) return;
    persistQuizSnapshot({ answers, lastStep, updatedAt: Date.now() });
  }, [answers, lastStep, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    scheduleLabProgressSync(answers as Record<string, unknown>, {
      step: lastStep ?? undefined,
    });
  }, [answers, lastStep, hydrated]);

  const setLastStep = (step: string) => {
    dispatch({ type: 'SET_LAST_STEP', step });
  };

  return (
    <QuizCtx.Provider value={{ answers, dispatch, lastStep, setLastStep, hydrated }}>
      <div className="qf-quiz-provider-fill">{children}</div>
    </QuizCtx.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizCtx);
  if (!ctx) throw new Error('useQuiz must be used within QuizProvider');
  return ctx;
}
