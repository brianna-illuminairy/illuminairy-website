'use client';

import { useEffect, useReducer, useRef, useState, type Dispatch } from 'react';
import { QFScreen } from '@/app/quiz/components/QFShell';
import { BTestimonialMarquee } from '@/app/quiz-b/screens/lab/BTestimonialMarquee';
import {
  PLAN_B_COMPUTING_HEADLINE,
  PLAN_B_COMPUTING_KHAN_QUESTION,
  PLAN_B_COMPUTING_ROWS,
  PLAN_B_COMPUTING_TUTOR_QUESTION,
} from '@/lib/quiz-funnel-b/computing-copy';
import { planBTestimonialsHeadline } from '@/lib/quiz-funnel-b/testimonials-headline';
import type { QuizAnswers } from '@/app/quiz-b/state';

type Props = {
  answers: Pick<QuizAnswers, 'q9'>;
  onKhanAnswer: (value: 'yes' | 'no') => void;
  onTutorAnswer: (value: 'yes' | 'no') => void;
  onContinue: () => void;
  onBack: () => void;
};

type PopupKind = 'khan' | 'tutor' | null;

type RowState = {
  pct: number;
  done: boolean;
};

type ComputeState = {
  rows: RowState[];
  popup: PopupKind;
  finished: boolean;
};

type ComputeAction =
  | { type: 'SET_ROW_PCT'; row: number; pct: number }
  | { type: 'COMPLETE_ROW'; row: number }
  | { type: 'SHOW_POPUP'; popup: PopupKind }
  | { type: 'FINISH' };

const ROW_COUNT = PLAN_B_COMPUTING_ROWS.length;

function initialRows(): RowState[] {
  return Array.from({ length: ROW_COUNT }, () => ({ pct: 0, done: false }));
}

function computeReducer(state: ComputeState, action: ComputeAction): ComputeState {
  switch (action.type) {
    case 'SET_ROW_PCT': {
      const rows = state.rows.map((row, i) =>
        i === action.row ? { ...row, pct: action.pct } : row
      );
      return { ...state, rows };
    }
    case 'COMPLETE_ROW': {
      const rows = state.rows.map((row, i) =>
        i === action.row ? { pct: 100, done: true } : row
      );
      return { ...state, rows };
    }
    case 'SHOW_POPUP':
      return { ...state, popup: action.popup };
    case 'FINISH':
      return { ...state, finished: true, popup: null };
    default:
      return state;
  }
}

function ComputePopup({
  question,
  yesLabel,
  noLabel,
  onYes,
  onNo,
  noFirst = false,
}: {
  question: string;
  yesLabel: string;
  noLabel: string;
  onYes: () => void;
  onNo: () => void;
  noFirst?: boolean;
}) {
  const yesBtn = (
    <button
      type="button"
      className="qfb-compute-popup__btn qfb-compute-popup__btn--primary"
      onClick={onYes}
    >
      {yesLabel}
    </button>
  );
  const noBtn = (
    <button
      type="button"
      className="qfb-compute-popup__btn qfb-compute-popup__btn--secondary"
      onClick={onNo}
    >
      {noLabel}
    </button>
  );

  return (
    <div
      className="qfb-compute-popup"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qfb-compute-popup-title"
    >
      <div className="qfb-compute-popup__backdrop" aria-hidden="true" />
      <div className="qfb-compute-popup__card qf-card">
        <h2 id="qfb-compute-popup-title" className="qfb-compute-popup__title">
          {question}
        </h2>
        <div className="qfb-compute-popup__actions">
          {noFirst ? (
            <>
              {noBtn}
              {yesBtn}
            </>
          ) : (
            <>
              {yesBtn}
              {noBtn}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function animateRowPct(
  row: number,
  from: number,
  to: number,
  stepMs: number,
  dispatchCompute: Dispatch<ComputeAction>,
  cancelled: () => boolean
) {
  return new Promise<void>((resolve) => {
    let pct = from;
    dispatchCompute({ type: 'SET_ROW_PCT', row, pct });
    const inc = window.setInterval(() => {
      if (cancelled()) {
        window.clearInterval(inc);
        resolve();
        return;
      }
      pct = Math.min(to, pct + 2);
      dispatchCompute({ type: 'SET_ROW_PCT', row, pct });
      if (pct >= to) {
        window.clearInterval(inc);
        resolve();
      }
    }, stepMs);
  });
}

export function BComputing({ answers, onKhanAnswer, onTutorAnswer, onContinue, onBack }: Props) {
  const [state, dispatchCompute] = useReducer(computeReducer, {
    rows: initialRows(),
    popup: null,
    finished: false,
  });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  const startedRef = useRef(false);
  const advancedRef = useRef(false);
  const social = planBTestimonialsHeadline(answers);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      setReducedMotion(mq.matches);
      setMotionReady(true);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!motionReady || startedRef.current || state.finished || state.popup) return;
    startedRef.current = true;

    let cancelled = false;
    const isCancelled = () => cancelled;

    async function boot() {
      if (reducedMotion) {
        dispatchCompute({ type: 'SHOW_POPUP', popup: 'khan' });
        return;
      }
      await animateRowPct(0, 0, 48, 28, dispatchCompute, isCancelled);
      if (cancelled) return;
      dispatchCompute({ type: 'SHOW_POPUP', popup: 'khan' });
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, [motionReady, state.finished, state.popup, reducedMotion]);

  useEffect(() => {
    if (!state.finished || advancedRef.current) return;
    advancedRef.current = true;
    const timer = window.setTimeout(onContinue, reducedMotion ? 400 : 900);
    return () => window.clearTimeout(timer);
  }, [state.finished, onContinue, reducedMotion]);

  async function resumeAfterKhan(answer: 'yes' | 'no') {
    onKhanAnswer(answer);
    dispatchCompute({ type: 'SHOW_POPUP', popup: null });

    if (reducedMotion) {
      dispatchCompute({ type: 'SHOW_POPUP', popup: 'tutor' });
      return;
    }

    await animateRowPct(0, 48, 100, 22, dispatchCompute, () => false);
    dispatchCompute({ type: 'COMPLETE_ROW', row: 0 });
    await animateRowPct(1, 0, 48, 28, dispatchCompute, () => false);
    dispatchCompute({ type: 'SHOW_POPUP', popup: 'tutor' });
  }

  async function resumeAfterTutor(answer: 'yes' | 'no') {
    onTutorAnswer(answer);
    dispatchCompute({ type: 'SHOW_POPUP', popup: null });

    if (reducedMotion) {
      for (let i = 0; i < ROW_COUNT; i++) {
        dispatchCompute({ type: 'COMPLETE_ROW', row: i });
      }
      dispatchCompute({ type: 'FINISH' });
      return;
    }

    await animateRowPct(1, 48, 100, 22, dispatchCompute, () => false);
    dispatchCompute({ type: 'COMPLETE_ROW', row: 1 });
    await animateRowPct(2, 0, 98, 24, dispatchCompute, () => false);
    await animateRowPct(2, 98, 100, 40, dispatchCompute, () => false);
    dispatchCompute({ type: 'COMPLETE_ROW', row: 2 });
    dispatchCompute({ type: 'FINISH' });
  }

  return (
    <QFScreen stepIdx={12} onBack={onBack} showProgress={false}>
      <div className="qfb-computing">
        <div className="qfb-computing__main">
          <h1 className="qfb-computing__headline">{PLAN_B_COMPUTING_HEADLINE}</h1>

          <ul className="qfb-computing__rows" aria-live="polite">
            {PLAN_B_COMPUTING_ROWS.map((label, i) => {
              const row = state.rows[i] ?? { pct: 0, done: false };
              return (
                <li
                  key={label}
                  className={
                    row.done ? 'qfb-computing__row qfb-computing__row--done' : 'qfb-computing__row'
                  }
                >
                  <div className="qfb-computing__row-head">
                    <span className="qfb-computing__row-label">
                      {row.done ? (
                        <span className="qfb-computing__check" aria-hidden="true">
                          ✓
                        </span>
                      ) : null}
                      {label}
                    </span>
                    <span className="qfb-computing__row-pct">
                      {row.done ? '100%' : `${row.pct}%`}
                    </span>
                  </div>
                  <div className="qfb-computing__bar" aria-hidden="true">
                    <div className="qfb-computing__bar-fill" style={{ width: `${row.pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <section className="qfb-computing__reviews" aria-label="Parent testimonials">
          <p className="qfb-computing__reviews-headline">{social.headline}</p>
          <p className="qfb-computing__reviews-note">{social.disclaimer}</p>
          <BTestimonialMarquee />
        </section>
      </div>

      {state.popup === 'khan' ? (
        <ComputePopup
          question={PLAN_B_COMPUTING_KHAN_QUESTION}
          yesLabel="Yes"
          noLabel="No"
          onYes={() => void resumeAfterKhan('yes')}
          onNo={() => void resumeAfterKhan('no')}
        />
      ) : null}

      {state.popup === 'tutor' ? (
        <ComputePopup
          question={PLAN_B_COMPUTING_TUTOR_QUESTION}
          yesLabel="Yes"
          noLabel="No"
          onYes={() => void resumeAfterTutor('yes')}
          onNo={() => void resumeAfterTutor('no')}
          noFirst
        />
      ) : null}
    </QFScreen>
  );
}
