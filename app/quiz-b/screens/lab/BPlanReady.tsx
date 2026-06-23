'use client';

import { QFScreen, QFButton } from '@/app/quiz/components/QFShell';
import { QFBarChart } from '@/app/quiz/components/QFBarChart';
import { promisedGainFromQuizAnswers } from '@/app/quiz/gains';
import {
  PLAN_B_PLAN_READY_FEATURES,
  PLAN_B_PLAN_READY_HEADLINE_ACCENT,
  PLAN_B_PLAN_READY_HEADLINE_AFTER,
  PLAN_B_PLAN_READY_HEADLINE_BEFORE,
  PLAN_B_PLAN_READY_SUBLINE,
} from '@/lib/quiz-funnel-b/plan-ready-copy';
import type { QuizAnswers } from '@/app/quiz-b/state';

type Props = {
  answers: QuizAnswers;
  onContinue: () => void;
  onBack: () => void;
};

export function BPlanReady({ answers, onContinue, onBack }: Props) {
  const gain = promisedGainFromQuizAnswers(answers.q4, answers.q5, answers.q8) ?? 120;
  const month1 = Math.round(gain * 0.35);
  const month2 = Math.round(gain * 0.65);
  const month3 = gain;

  return (
    <QFScreen
      stepIdx={13}
      onBack={onBack}
      actions={<QFButton kind="forest" onClick={onContinue}>Continue</QFButton>}
    >
      <div className="qfb-plan-ready-card">
        <div className="qfb-plan-ready-card__intro">
          <h1 className="qfb-plan-ready-card__headline">
            {PLAN_B_PLAN_READY_HEADLINE_BEFORE}
            <span className="qfb-plan-ready-card__headline-accent">
              {PLAN_B_PLAN_READY_HEADLINE_ACCENT}
            </span>
            {PLAN_B_PLAN_READY_HEADLINE_AFTER}
          </h1>
          <p className="qfb-plan-ready-card__subline">{PLAN_B_PLAN_READY_SUBLINE}</p>
        </div>

        <div className="qfb-plan-ready-card__chart">
          <QFBarChart
            bars={[
              { lbl: 'Month 1', val: month1, color: 'var(--qf-sage)', hot: false },
              { lbl: 'Month 2', val: month2, color: 'var(--qf-forest-mid)', hot: false },
              { lbl: 'Month 3', val: month3, color: 'var(--qf-forest)', hot: true },
            ]}
            max={Math.max(month3 + 20, 160)}
            caption=""
          />
          <p className="qfb-plan-ready-card__goal-tag">Goal</p>
        </div>

        <ul className="qfb-plan-ready-card__features">
          {PLAN_B_PLAN_READY_FEATURES.map((item) => (
            <li key={item}>
              <span className="qfb-plan-ready-card__check" aria-hidden="true">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </QFScreen>
  );
}
