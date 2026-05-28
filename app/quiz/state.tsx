'use client';
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
  type Dispatch
} from 'react';

const STORAGE_KEY = 'qf_answers';

export type QuizAnswers = {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
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
  [key: string]: string | string[] | boolean | undefined;
};

type QuizAction =
  | { type: 'SET_Q'; key: string; value?: string }
  | { type: 'TOGGLE_Q'; key: string; id: string }
  | { type: 'SET_FIELD'; key: string; value: unknown }
  | { type: 'LOAD'; data: Partial<QuizAnswers> };

const initialState: QuizAnswers = {
  q6: [],
  q7: [],
  parentName: '',
  parentEmail: '',
  parentPhone: '',
  kidName: '',
  confirmTcpa: false,
  planChoice: 'full'
};

function reducer(state: QuizAnswers, action: QuizAction): QuizAnswers {
  switch (action.type) {
    case 'SET_Q':
      return { ...state, [action.key]: action.value };
    case 'TOGGLE_Q': {
      const prev = (state[action.key] as string[]) || [];
      const next = prev.includes(action.id)
        ? prev.filter((x) => x !== action.id)
        : [...prev, action.id];
      return { ...state, [action.key]: next };
    }
    case 'SET_FIELD':
      return { ...state, [action.key]: action.value as QuizAnswers[string] };
    case 'LOAD':
      return { ...initialState, ...action.data };
    default:
      return state;
  }
}

type QuizContextValue = {
  answers: QuizAnswers;
  dispatch: Dispatch<QuizAction>;
};

const QuizCtx = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [answers, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: 'LOAD', data: JSON.parse(saved) as Partial<QuizAnswers> });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      /* ignore */
    }
  }, [answers]);

  return (
    <QuizCtx.Provider value={{ answers, dispatch }}>{children}</QuizCtx.Provider>
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
  const lowScore = ['u1000', '1100-1200', '1200-1300', '1300-1400'].includes(
    answers.q4 ?? ''
  );
  return highGpa && lowScore;
}
