'use client'; // @ts-nocheck
import { useState, useEffect, useMemo } from 'react';
import { QFScreen, QFButton, QFQuestionHead, QFConstellation } from '../components/QFShell';
import { QFBarChart } from '../components/QFBarChart';
import { S2_MISTAKE_DRIVEN_LEAD } from '@/lib/quiz-funnel/score-path-copy';
import { buildPlanReveal } from '@/lib/quiz-funnel/plan-reveal';
import { satProgramOutcomes, satRetakeResearch } from '@/lib/site';

function PlanRevealSection({ title, children }) {
  return (
    <section className="qf-plan-reveal-section">
      <p className="qf-plan-reveal-section__title">{title}</p>
      {children}
    </section>
  );
}

function MetricCell({ label, value, qualifier, highlight = false }) {
  return (
    <div className={`qf-plan-reveal-metric${highlight ? ' qf-plan-reveal-metric--hot' : ''}`}>
      <span className="qf-plan-reveal-metric__label">{label}</span>
      <span className="qf-plan-reveal-metric__value">{value}</span>
      {qualifier ? (
        <span className="qf-plan-reveal-metric__qual">{qualifier}</span>
      ) : null}
    </div>
  );
}

function InputRow({ label, value }) {
  return (
    <div className="qf-plan-reveal-input-row">
      <span className="qf-plan-reveal-input-row__label">{label}</span>
      <span className="qf-plan-reveal-input-row__value">{value}</span>
    </div>
  );
}

function InputGroup({ title, rows }) {
  if (!rows.length) return null;
  return (
    <div className="qf-plan-reveal-input-group">
      <p className="qf-plan-reveal-input-group__title">{title}</p>
      {rows.map((row) => (
        <InputRow key={`${title}-${row.label}`} label={row.label} value={row.value} />
      ))}
    </div>
  );
}

// ─── Plan reveal · Personalized SAT improvement assessment ───────────────────
export function QFSPlanReveal({ answers = {}, onContinue, onBack }) {
  const plan = useMemo(() => buildPlanReveal(answers), [answers]);

  return (
    <QFScreen stepIdx={14} ornament="glow" onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>See your score path</QFButton>}
    >
      <div className="gap-22 qf-plan-reveal">
        <div>
          <h1 className="qf-h1" style={{ marginBottom: 8 }}>
            Your SAT improvement <em>assessment</em>
          </h1>
          <p className="qf-lead" style={{ margin: 0 }}>{plan.subhead}</p>
        </div>

        <section className="qf-plan-reveal-panel qf-plan-reveal-panel--heard">
          <p className="qf-plan-reveal-panel__eyebrow">What you told us</p>
          <p className="qf-plan-reveal-heard">{plan.heardSummary}</p>
          <div className="qf-plan-reveal-inputs">
            {plan.inputGroups.map((group) => (
              <InputGroup key={group.title} title={group.title} rows={group.rows} />
            ))}
          </div>
        </section>

        <div className="qf-plan-reveal-bridge" aria-hidden="true">
          <span />
        </div>

        <section className="qf-plan-reveal-panel qf-plan-reveal-panel--assessment">
          <p className="qf-plan-reveal-panel__eyebrow">{plan.assessmentHeadline}</p>
          <p className="qf-plan-reveal-verdict">{plan.assessmentVerdict}</p>

          <div className="qf-plan-reveal-metrics">
            <MetricCell
              label="Start"
              value={plan.metrics.start.value}
              qualifier={plan.metrics.start.qualifier}
            />
            <MetricCell
              label="Target"
              value={plan.metrics.target.value}
              qualifier={plan.metrics.target.qualifier}
            />
            <MetricCell
              label="Likely improvement"
              value={plan.metrics.gainRange}
              highlight
            />
            <MetricCell label="Runway" value={plan.metrics.weeks} />
            <MetricCell label="Effort" value={plan.metrics.effort} />
          </div>
        </section>

        <PlanRevealSection title="Skills to work first (examples until diagnostic)">
          <ul className="qf-plan-reveal-levers">
            {plan.topLevers.map((lever) => (
              <li key={lever.rank}>
                <span className="qf-plan-reveal-levers__rank">{lever.rank}</span>
                <span className="qf-plan-reveal-levers__name">{lever.name}</span>
              </li>
            ))}
          </ul>
          <p className="qf-plan-reveal-note">{plan.leversNote}</p>
        </PlanRevealSection>

        <PlanRevealSection title="Why last time didn't help">
          <p className="qf-plan-reveal-body">{plan.whyLastTimeFailed}</p>
        </PlanRevealSection>

        <PlanRevealSection title="How this time is different">
          <p className="qf-plan-reveal-body">{plan.howThisTimeDifferent}</p>
        </PlanRevealSection>

        {plan.honestyLines.length > 0 && (
          <PlanRevealSection title="What we're being straight about">
            <ul className="qf-plan-reveal-honesty">
              {plan.honestyLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </PlanRevealSection>
        )}

        <PlanRevealSection title="What you see as a parent">
          <ul className="qf-plan-reveal-list">
            {plan.parentVisibility.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </PlanRevealSection>

        <PlanRevealSection title="Next steps">
          <ol className="qf-plan-reveal-steps">
            {plan.nextSteps.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong>
                <span>{step.detail}</span>
              </li>
            ))}
          </ol>
        </PlanRevealSection>
      </div>
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
            <em>Skill 1</em> gets mistake-driven tutoring.
          </h1>
          <p className="qf-lead" style={{ margin: 0 }}>
            {S2_MISTAKE_DRIVEN_LEAD}
          </p>
          <p className="qf-lead" style={{ margin: '12px 0 0', fontSize: 14, color: 'var(--qf-ink-mid)' }}>
            {S2_MISTAKE_DRIVEN_RESEARCH}
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

// ─── S3 · Stats (vertical bar chart — asymmetry is the point) ────────────────
export function QFS3Stats({ onContinue, onBack }) {
  const { avgPointsGained, plansBuiltCount } = satProgramOutcomes;
  const retakeAvg = satRetakeResearch.avgPointsWithoutNewApproach;
  const bars = [
    { lbl: 'On their own', val: retakeAvg, color: 'rgba(20,32,46,0.30)' },
    { lbl: 'Group class', val: 70, color: 'rgba(20,32,46,0.55)' },
    { lbl: 'Illuminairy', val: avgPointsGained, color: 'var(--qf-forest)', hot: true },
  ];
  const MAX = avgPointsGained;

  return (
    <QFScreen stepIdx={16} tone="bg-2" onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>Continue</QFButton>}
    >
      <div className="gap-22">
        <h1 className="qf-h1">
          <em>+{avgPointsGained}</em> avg on completed plans.
        </h1>
        <p className="qf-lead">
          College Board retakers without a new approach average about +{retakeAvg} points. Across{' '}
          {plansBuiltCount} completed Illuminairy plans, students averaged +{avgPointsGained}.
        </p>

        <div className="qf-card" style={{ padding: 20 }}>
          <QFBarChart bars={bars} max={MAX} chartH={160} />
        </div>

        <p className="qf-disclaimer">
          Source: College Board retest summaries; Illuminairy completed plans (n={plansBuiltCount}).
          Group class bar is illustrative. Individual results vary.
        </p>
      </div>
    </QFScreen>
  );
}

// ─── S4 · Editorial team feature ─────────────────────────────────────────────
export function QFS4Authority({ onContinue, onBack }) {
  const benefits = [
    'Weekly 1:1 sessions',
    'Messaging between sessions',
    'Weekly progress reports',
  ];

  return (
    <QFScreen stepIdx={17} onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>I'm ready</QFButton>}
    >
      <div className="gap-12 qf-s4-tight">
        <div style={{
          width: '100%', maxHeight: 210, borderRadius: 16, overflow: 'hidden',
          position: 'relative',
          background: 'linear-gradient(135deg, #1A4D2F 0%, #2F6E47 35%, #0057A8 75%, #121A2B 100%)',
        }}>
          <img
            src="/photos/team-hero.jpg"
            alt="The illuminairy tutors"
            style={{
              width: '100%', height: 210, objectFit: 'cover', objectPosition: 'center top',
              display: 'block',
            }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>

        <h1 className="qf-h1 qf-s4-headline">
          All our tutors scored <em>1450+</em> on the Digital SAT.
        </h1>

        <div style={{ borderTop: '1px solid var(--qf-line)' }}>
          {benefits.map((b, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '10px 0',
              borderBottom: '1px solid var(--qf-line)',
              fontFamily: 'var(--qf-display)', fontSize: 15,
              color: 'var(--qf-ink-2)', fontWeight: 500,
              letterSpacing: '-0.005em', lineHeight: 1.35,
            }}>
              <span style={{
                color: 'var(--qf-forest)', fontWeight: 600, flexShrink: 0, lineHeight: 1.35,
              }} aria-hidden="true">✓</span>
              <span>{b}</span>
            </div>
          ))}
        </div>

        <p className="qf-lead" style={{ fontSize: 14, color: 'var(--qf-ink-mid)', margin: 0 }}>
          Next: a free Strategy Call, step 1 to your child&apos;s diagnostic and a personalized weekly plan.
        </p>
      </div>
    </QFScreen>
  );
}
