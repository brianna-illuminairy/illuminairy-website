'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
  type Dispatch,
} from 'react';
import {
  persistQuizSnapshot,
  resolveHydratedQuizSnapshot,
  hasQuizProgress,
  type ScoreReviewSnapshot,
} from '@/lib/score-review-funnel/quiz-storage';

export type QuizAnswers = {
  srGrade?: string;
  srRecentScore?: string;
  srPrepared: string[];
  srTestDate?: string;
  srTarget?: string;
  srSchoolReferral?: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  kidName: string;
  phoneVerifiedAt?: string;
  confirmTcpa: boolean;
  reviewCallStart?: string;
  cbPrepAck: boolean;
  linkShared: boolean;
  [key: string]: string | string[] | boolean | undefined;
};

const initialState: QuizAnswers = {
  srPrepared: [],
  parentName: '',
  parentEmail: '',
  parentPhone: '',
  kidName: '',
  confirmTcpa: false,
  cbPrepAck: false,
  linkShared: false,
};

type QuizAction =
  | { type: 'SET_Q'; key: string; value?: string }
  | { type: 'TOGGLE_Q'; key: string; id: string }
  | { type: 'SET_FIELD'; key: string; value: unknown }
  | { type: 'HYDRATE'; data?: Partial<QuizAnswers>; lastStep?: string | null }
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

function mergeStoredAnswers(data: Partial<QuizAnswers>): QuizAnswers {
  return { ...initialState, ...data };
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

function initStoreFromSnapshot(snapshot?: ScoreReviewSnapshot | null): QuizStoreState {
  if (!snapshot || !hasQuizProgress(snapshot)) return emptyStore();
  return {
    answers: mergeStoredAnswers(snapshot.answers as Partial<QuizAnswers>),
    lastStep: snapshot.lastStep,
    hydrated: false,
  };
}

export function QuizProvider({
  children,
  initialSnapshot = null,
}: {
  children: ReactNode;
  initialSnapshot?: ScoreReviewSnapshot | null;
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
