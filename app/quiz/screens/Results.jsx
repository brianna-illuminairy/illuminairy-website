'use client'; // @ts-nocheck
import { useState, useEffect, useMemo } from 'react';
import { QFScreen, QFButton, QFQuestionHead, QFConstellation } from '../components/QFShell';
import { S2_EXAMPLES_HEADLINE, S2_EXAMPLES_LEAD } from '@/lib/quiz-funnel/score-path-copy';
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
    <QFScreen stepIdx={14} ornament="glow" onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>{REVEAL_CTA}</QFButton>}
    >
      <PlanRevealContent plan={plan} q2={answers.q2} />
    </QFScreen>
  );
}

/** @deprecated use QFSPlanReveal — kept for deep links */
export const QFS1Summary = QFSPlanReveal;

// ─── S2 · Method — mistake-driven learning, 6-step mastery loop ──────────────
const S2_EXAMPLE_SKILL = {
  'math':       { full: 'Linear Functions',         tag: 'ALGEBRA' },
  'reading':    { full: 'Inference & Main Idea',    tag: 'READING' },
  'self-study': { full: 'Geometry: Right Triangles', tag: 'GEOMETRY' },
  'no-plan':    { full: 'Linear Functions',         tag: 'ALGEBRA' },
  'wont':       { full: 'Quadratics',               tag: 'ADV. MATH' },
  'too-busy':   { full: 'Vocab in Context',         tag: 'READING' },
};

function pickS2Skill(q6 = []) {
  for (const id of q6) {
    if (S2_EXAMPLE_SKILL[id]) return S2_EXAMPLE_SKILL[id];
  }
  return S2_EXAMPLE_SKILL['math'];
}

const S2_ROW_DELAYS = [400, 450, 480, 520, 550, 600];

export function QFS2Science({ onContinue, onBack, q6 = ['math'] }) {
  const example = pickS2Skill(q6);
  const steps = [
    { label: 'Learn' },
    { label: 'Watch' },
    { label: 'Solve together' },
    { label: 'Solve with hints' },
    { label: 'Solve alone' },
    { label: 'Repeat to mastery' },
  ];

  const [revealedRows, setRevealedRows] = useState(0);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const reduced = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setRevealedRows(steps.length);
      setShowFooter(true);
      return;
    }
    const timers = [];
    let t = 300;
    for (let i = 0; i < steps.length; i++) {
      timers.push(setTimeout(() => setRevealedRows(i + 1), t));
      t += S2_ROW_DELAYS[i];
    }
    timers.push(setTimeout(() => setShowFooter(true), t + 200));
    return () => timers.forEach(clearTimeout);
  }, [steps.length]);

  return (
    <QFScreen stepIdx={15} ornament="glow" onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>See the results</QFButton>}
    >
      <div className="gap-22">
        <div>
          <h1 className="qf-h1" style={{ marginBottom: 8 }}>
            {S2_EXAMPLES_HEADLINE}
          </h1>
          <p className="qf-lead" style={{ margin: 0 }}>
            {S2_EXAMPLES_LEAD}
          </p>
        </div>

        <div style={{
          background: 'var(--qf-paper)', border: '1px solid var(--qf-line)',
          borderRadius: 14, overflow: 'hidden',
        }}>
          <div style={{
            background: 'var(--qf-ink)', padding: '10px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{
              fontFamily: 'var(--qf-body)', fontSize: 12, letterSpacing: '0.06em',
              fontWeight: 600, textTransform: 'uppercase',
              color: 'rgba(245,248,250,0.75)',
            }}>Skill 1 · example session</span>
            <span style={{
              fontFamily: 'var(--qf-body)', fontSize: 13, fontWeight: 600,
              color: 'var(--qf-glow)',
            }}>{example.full}</span>
          </div>

          {steps.map((s, i) => {
            const shown = i < revealedRows;
            const isLast = i === steps.length - 1;
            return (
              <div key={i} className="qf-s2-row" style={{
                display: 'grid', gridTemplateColumns: '32px 1fr 72px',
                alignItems: 'center', gap: 12,
                padding: '12px 16px',
                borderTop: i > 0 ? '1px solid var(--qf-line)' : 'none',
                background: isLast ? 'var(--qf-forest-soft)' : undefined,
                opacity: shown ? 1 : 0,
                transform: shown ? 'translateY(0)' : 'translateY(4px)',
                transition: 'opacity 0.35s ease, transform 0.35s ease',
              }}>
                <span style={{
                  fontFamily: 'var(--qf-mono)', fontSize: 11, fontWeight: 600,
                  color: isLast ? 'var(--qf-forest)' : 'var(--qf-ink-mute)',
                  letterSpacing: '0.05em',
                }}>0{i + 1}</span>
                <div style={{
                  fontFamily: 'var(--qf-body)', fontSize: 14, fontWeight: 600,
                  color: 'var(--qf-ink)',
                }}>{s.label}</div>
                <span style={{
                  fontFamily: 'var(--qf-body)', fontSize: 12, fontWeight: 600,
                  textAlign: 'right',
                  color: shown ? (isLast ? 'var(--qf-forest)' : 'var(--qf-ink-mute)') : 'transparent',
                  transition: 'color 0.3s ease',
                }}>Step {i + 1}</span>
              </div>
            );
          })}

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 16px',
            borderTop: '1px solid rgba(47,110,71,0.25)',
            background: 'var(--qf-forest-soft)',
            opacity: showFooter ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}>
            <span style={{
              fontFamily: 'var(--qf-body)', fontSize: 12, fontWeight: 600,
              letterSpacing: '0.04em', textTransform: 'uppercase',
              color: 'var(--qf-forest)',
            }}>{example.tag} · mastery</span>
            <span style={{
              fontFamily: 'var(--qf-display)', fontSize: 15, color: 'var(--qf-forest)',
              fontWeight: 500,
            }}>Automatic</span>
          </div>
        </div>
      </div>
    </QFScreen>
  );
}

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
