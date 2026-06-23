'use client';

import { useEffect, useReducer, useRef, useState, type Dispatch } from 'react';
import { QFScreen } from '@/app/quiz/components/QFShell';
import { BComputingReviews } from '@/app/quiz-b/screens/lab/BTestimonialMarquee';
import {
  PLAN_B_COMPUTING_HEADLINE,
  PLAN_B_COMPUTING_KHAN_QUESTION,
  PLAN_B_COMPUTING_ROWS,
  PLAN_B_COMPUTING_TUTOR_QUESTION,
} from '@/lib/quiz-funnel-b/computing-copy';

type Props = {
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

/** Bar fill speed — tuned so reviews stay readable while rows advance. */
const COMPUTE_STEP_PCT = 1;
const COMPUTE_TICK_MS = 52;
const COMPUTE_KHAN_POPUP_PCT = 48;
const COMPUTE_TUTOR_POPUP_PCT = 72;
const COMPUTE_SEGMENT_PAUSE_MS = 1100;
const COMPUTE_FINISH_DWELL_MS = 2800;

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
      <div className="qfb-compute-popup__card">
        <p id="qfb-compute-popup-title" className="qfb-compute-popup__title">
          {question}
        </p>
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

type AnimateResult = 'completed' | 'stopped' | 'cancelled';

function animateRowPct(
  row: number,
  from: number,
  to: number,
  stepMs: number,
  dispatchCompute: Dispatch<ComputeAction>,
  cancelled: () => boolean,
  options?: { pauseAt?: number; onPause?: () => void }
): Promise<AnimateResult> {
  return new Promise((resolve) => {
    let pct = from;
    dispatchCompute({ type: 'SET_ROW_PCT', row, pct });
    const pauseAt = options?.pauseAt;

    const inc = window.setInterval(() => {
      if (cancelled()) {
        window.clearInterval(inc);
        resolve('cancelled');
        return;
      }

      pct = Math.min(to, pct + COMPUTE_STEP_PCT);
      dispatchCompute({ type: 'SET_ROW_PCT', row, pct });

      if (pauseAt != null && pct >= pauseAt && pauseAt <= to) {
        window.clearInterval(inc);
        options?.onPause?.();
        resolve('stopped');
        return;
      }

      if (pct >= to) {
        window.clearInterval(inc);
        resolve('completed');
      }
    }, stepMs);
  });
}

function pauseMs(ms: number, cancelled: () => boolean): Promise<void> {
  return new Promise((resolve) => {
    const started = Date.now();
    const tick = () => {
      if (cancelled() || Date.now() - started >= ms) {
        resolve();
        return;
      }
      window.setTimeout(tick, 80);
    };
    tick();
  });
}

export function BComputing({ onKhanAnswer, onTutorAnswer, onContinue, onBack }: Props) {
  const [state, dispatchCompute] = useReducer(computeReducer, {
    rows: initialRows(),
    popup: null,
    finished: false,
  });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  const advancedRef = useRef(false);
  const bootRunRef = useRef(false);

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
    if (!motionReady || state.finished || state.popup) return;

    let cancelled = false;
    const isCancelled = () => cancelled;

    async function boot() {
      if (bootRunRef.current) return;
      bootRunRef.current = true;

      if (reducedMotion) {
        dispatchCompute({ type: 'SET_ROW_PCT', row: 0, pct: COMPUTE_KHAN_POPUP_PCT });
        dispatchCompute({ type: 'SHOW_POPUP', popup: 'khan' });
        return;
      }

      await animateRowPct(0, 0, 100, COMPUTE_TICK_MS, dispatchCompute, isCancelled, {
        pauseAt: COMPUTE_KHAN_POPUP_PCT,
        onPause: () => dispatchCompute({ type: 'SHOW_POPUP', popup: 'khan' }),
      });
    }

    void boot();
    return () => {
      cancelled = true;
      bootRunRef.current = false;
    };
  }, [motionReady, state.finished, state.popup, reducedMotion]);

  useEffect(() => {
    if (!state.finished || advancedRef.current) return;
    advancedRef.current = true;
    const timer = window.setTimeout(onContinue, reducedMotion ? 500 : COMPUTE_FINISH_DWELL_MS);
    return () => window.clearTimeout(timer);
  }, [state.finished, onContinue, reducedMotion]);

  async function resumeAfterKhan(answer: 'yes' | 'no') {
    onKhanAnswer(answer);
    dispatchCompute({ type: 'SHOW_POPUP', popup: null });

    if (reducedMotion) {
      dispatchCompute({ type: 'COMPLETE_ROW', row: 0 });
      dispatchCompute({ type: 'SET_ROW_PCT', row: 1, pct: COMPUTE_TUTOR_POPUP_PCT });
      dispatchCompute({ type: 'SHOW_POPUP', popup: 'tutor' });
      return;
    }

    await animateRowPct(0, COMPUTE_KHAN_POPUP_PCT, 100, COMPUTE_TICK_MS, dispatchCompute, () => false);
    dispatchCompute({ type: 'COMPLETE_ROW', row: 0 });
    await pauseMs(COMPUTE_SEGMENT_PAUSE_MS, () => false);
    await animateRowPct(1, 0, 100, COMPUTE_TICK_MS, dispatchCompute, () => false, {
      pauseAt: COMPUTE_TUTOR_POPUP_PCT,
      onPause: () => dispatchCompute({ type: 'SHOW_POPUP', popup: 'tutor' }),
    });
  }

  async function resumeAfterTutor(answer: 'yes' | 'no') {
    onTutorAnswer(answer);
    dispatchCompute({ type: 'SHOW_POPUP', popup: null });

    if (reducedMotion) {
      dispatchCompute({ type: 'COMPLETE_ROW', row: 1 });
      dispatchCompute({ type: 'COMPLETE_ROW', row: 2 });
      dispatchCompute({ type: 'FINISH' });
      return;
    }

    await animateRowPct(1, COMPUTE_TUTOR_POPUP_PCT, 100, COMPUTE_TICK_MS, dispatchCompute, () => false);
    dispatchCompute({ type: 'COMPLETE_ROW', row: 1 });
    await pauseMs(COMPUTE_SEGMENT_PAUSE_MS, () => false);
    await animateRowPct(2, 0, 100, COMPUTE_TICK_MS, dispatchCompute, () => false);
    dispatchCompute({ type: 'COMPLETE_ROW', row: 2 });
    await pauseMs(COMPUTE_SEGMENT_PAUSE_MS, () => false);
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

        <BComputingReviews />
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
