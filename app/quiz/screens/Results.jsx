'use client'; // @ts-nocheck
import { useMemo } from 'react';
import { QFScreen, QFButton, QFQuestionHead, QFConstellation } from '../components/QFShell';
import { buildPlanReveal } from '@/lib/quiz-funnel/plan-reveal';
import { REVEAL_CTA, S3_PERSONALIZE_CTA } from '@/lib/quiz-funnel/score-path-copy';
import { QFVerifiedCaseStudy } from '../components/QFVerifiedCaseStudy';
import { PlanRevealContent } from '../components/PlanRevealContent';
import { PlanHeardSummary } from '../components/PlanHeardSummary';
import { HEARD_SUMMARY_CTA } from '@/lib/quiz-funnel/heard-summary-copy';

// ─── Pre-reveal · confirm what we heard ─────────────────────────────────────
export function QFSHeardSummary({ answers = {}, onContinue, onBack }) {
  return (
    <QFScreen stepIdx={13} ornament="glow" onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>{HEARD_SUMMARY_CTA}</QFButton>}
    >
      <PlanHeardSummary answers={answers} />
    </QFScreen>
  );
}

// ─── Plan reveal · SAT Improvement Plan + score projection ───────────────────
export function QFSPlanReveal({ answers = {}, onContinue, onBack }) {
  const plan = useMemo(() => buildPlanReveal(answers), [answers]);

  return (
    <QFScreen stepIdx={11} ornament="glow" onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>{REVEAL_CTA}</QFButton>}
    >
      <PlanRevealContent plan={plan} q2={answers.q2} />
    </QFScreen>
  );
}

/** @deprecated use QFSPlanReveal — kept for deep links */
export const QFS1Summary = QFSPlanReveal;

// ─── S3 · Verified parent case study (Ethan) ─────────────────────────────────
export function QFS3Stats({ onContinue, onBack }) {
  return (
    <QFScreen stepIdx={16} onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>{S3_PERSONALIZE_CTA}</QFButton>}
    >
      <QFVerifiedCaseStudy />
    </QFScreen>
  );
}
