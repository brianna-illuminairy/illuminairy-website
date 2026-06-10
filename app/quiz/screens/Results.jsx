'use client';
import { useMemo } from 'react';
import { QFScreen, QFButton, QFQuestionHead, QFConstellation } from '../components/QFShell';
import { buildGoalAchievabilityScreenModel } from '@/lib/quiz-funnel/goal-achievability-screen';
import { revealPlanCta } from '@/lib/quiz-funnel/score-path-copy';
import { GoalAchievabilityContent } from '../components/GoalAchievabilityContent';
import { PlanHeardSummary } from '../components/PlanHeardSummary';
import { HEARD_SUMMARY_CTA } from '@/lib/quiz-funnel/heard-summary-copy';

// ─── Pre-reveal · confirm what we heard ─────────────────────────────────────
export function QFSHeardSummary({ answers = {}, onContinue, onBack }) {
  return (
    <QFScreen stepIdx={13} ornament="glow" onBack={onBack}
      actions={<QFButton kind="forest" onClick={onContinue}>{HEARD_SUMMARY_CTA}</QFButton>}
    >
      <PlanHeardSummary answers={answers} />
    </QFScreen>
  );
}

// ─── Goal score achievability rating (PostHog step `achievability`, BEFORE name) ─
// NOT the plan reveal — that is step `v1` / QFV1Projection in Interstitials.jsx.
export function QFSGoalAchievability({ answers = {}, onContinue, onBack, onEditAnswer }) {
  const plan = useMemo(() => buildGoalAchievabilityScreenModel(answers), [answers]);

  return (
    <QFScreen stepIdx={11} ornament="glow" onBack={onBack}
      actions={<QFButton kind="forest" onClick={onContinue}>{revealPlanCta(answers.qWho)}</QFButton>}
    >
      <GoalAchievabilityContent
        plan={plan}
        q2={answers.q2}
        answers={answers}
        onEditAnswer={onEditAnswer}
      />
    </QFScreen>
  );
}

/** @deprecated Use QFSGoalAchievability — misnamed "PlanReveal"; same screen as achievability step. */
export const QFSPlanReveal = QFSGoalAchievability;

/** @deprecated deep-link alias */
export const QFS1Summary = QFSGoalAchievability;
