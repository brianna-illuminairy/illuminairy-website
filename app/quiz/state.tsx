'use client';
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
  type Dispatch,
} from 'react';
import { scheduleQuizProgressSync } from '@/lib/quiz-funnel/quiz-progress-sync';
import type { QuizSnapshot } from '@/lib/quiz-funnel/quiz-cookie';
import { hasQuizProgress } from '@/lib/quiz-funnel/quiz-cookie';
import {
  persistQuizSnapshot,
  resolveHydratedQuizSnapshot,
  type StoredQuizAnswers,
} from '@/lib/quiz-funnel/quiz-storage';

export type QuizAnswers = {
  qWho?: string;
  qScoreLower?: string;
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  qDoubts: string[];
  q5?: string;
  q6: string[];
  q7: string[];
  q8?: string;
  q9?: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  kidName: string;
  confirmTcpa: boolean;
  planChoice: string;
  strategyCallStart?: string;
  [key: string]: string | string[] | boolean | undefined;
};

const initialState: QuizAnswers = {
  qDoubts: [],
  q6: [],
  q7: [],
  parentName: '',
  parentEmail: '',
  parentPhone: '',
  kidName: '',
  confirmTcpa: false,
  planChoice: 'full',
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

function mergeStoredAnswers(data: Partial<QuizAnswers> | StoredQuizAnswers): QuizAnswers {
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
  /** Client storage merge finished — safe for redirects that depend on localStorage. */
  hydrated: boolean;
};

const QuizCtx = createContext<QuizContextValue | null>(null);

function initStoreFromSnapshot(snapshot?: QuizSnapshot | null): QuizStoreState {
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
  initialSnapshot?: QuizSnapshot | null;
}) {
  const [store, dispatch] = useReducer(storeReducer, initialSnapshot, initStoreFromSnapshot);
  const { answers, lastStep, hydrated } = store;

  useEffect(() => {
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
    scheduleQuizProgressSync(answers as Record<string, unknown>, {
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

export function showGapScreen(answers: QuizAnswers) {
  const highGpa = ['3.0-3.3', '3.3-3.5', '3.5-3.7', '3.7-3.9', '4.0+'].includes(
    answers.q9 ?? ''
  );
  const q4 = answers.q4 ?? '';
  const lowScore =
    q4 !== 'na' &&
    ['u1000', '1100-1200', '1200-1300', '1300-1400'].includes(q4);
  return highGpa && lowScore;
}
