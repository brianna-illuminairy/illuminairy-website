'use client'; // @ts-nocheck
import { useState, useEffect } from 'react';
import { QFScreen, QFButton, QFQuestionHead, QFConstellation } from '../components/QFShell';

// ─── S1 · Summary of Inputs (Hims-style: no headline, sectioned card) ────────
export function QFS1Summary({ answers = {}, onContinue, onBack }) {
  const {
    q3 = 'sat-1', q4 = '1200-1300', q5 = 'oct3',
    q6 = ['math'], q7 = ['khan'], q8 = '1450', q9 = '3.8-4.0',
  } = answers;

  const Q4_LABEL = { 'u1000': 'Under 1100', '1100-1200': '1100–1200', '1200-1300': '1200–1300', '1300-1400': '1300–1400', '1400plus': '1400+' };
  const Q5_LABEL = { 'aug22': 'Aug 22, 2026', 'oct3': 'Oct 3, 2026', 'nov7': 'Nov 7, 2026', 'dec5': 'Dec 5, 2026', '2027': 'Spring 2027', 'tbd': 'TBD' };
  const Q3_LABEL = { 'sat-1': 'Once', 'sat-2': 'Twice', 'sat-3+': 'Three+ times', 'psat-only': 'PSAT only', 'none': 'First time' };
  const Q8_LABEL = { '1250': '1250', '1300': '1300', '1350': '1350', '1400': '1400', '1450': '1450+', 'tbd': 'Not sure' };
  const Q9_LABEL = { 'u3.0': 'Under 3.0', '3.0-3.3': '3.0 – 3.3', '3.3-3.5': '3.3 – 3.5', '3.5-3.7': '3.5 – 3.7', '3.7-3.9': '3.7 – 3.9', '4.0+': '4.0+' };
  const Q7_LABELS = { 'khan': 'Khan / Bluebook', 'group': 'Group class', 'online': 'Online course', 'app': 'SAT App', 'book': 'Prep book', 'nothing': 'No prep' };
  const Q6_LABELS = { 'math': 'Math', 'reading': 'Reading & writing', 'self-study': "Self-study", 'no-plan': 'No clear plan', 'wont': "Won't study alone", 'too-busy': 'Too busy' };

  const tried = (q7 || []).map(id => Q7_LABELS[id] || id).join(' + ');
  const gaps = (q6 || []).map(id => Q6_LABELS[id] || id).join(', ');

  const sectionLabel = { fontFamily: 'var(--qf-mono)', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--qf-ink-mute)', fontWeight: 600, padding: '12px 18px 6px', borderTop: '1px solid var(--qf-line)' };
  const row = (lbl, val) => (
    <div style={{ display: 'flex', padding: '9px 18px 9px 26px', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ width: 4, flexShrink: 0, height: 16, background: 'rgba(20,32,46,0.12)', borderRadius: 2, marginTop: 3 }} />
      <span style={{ fontFamily: 'var(--qf-body)', fontSize: 13, color: 'var(--qf-ink-mute)', minWidth: 90 }}>{lbl}</span>
      <span style={{ fontFamily: 'var(--qf-body)', fontSize: 13, color: 'var(--qf-ink)', textAlign: 'right', flex: 1 }}>{val}</span>
    </div>
  );

  return (
    <QFScreen stepIdx={14} onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>Next</QFButton>}
    >
      <div style={{ padding: '8px 0' }}>
        <div style={{
          background: 'var(--qf-paper)',
          border: '1px solid var(--qf-line)',
          borderRadius: 14,
          overflow: 'hidden',
        }}>
          {/* Card header */}
          <div style={{
            background: 'var(--qf-bg-2)', padding: '14px 18px',
            fontFamily: 'var(--qf-display)', fontSize: 17, fontWeight: 500,
            letterSpacing: '-0.01em', color: 'var(--qf-ink-2)',
          }}>
            Your Plan Inputs
          </div>

          {/* THE STUDENT */}
          <div style={sectionLabel}>The Student</div>
          {row('Current SAT', Q4_LABEL[q4] || q4)}
          {row('Target score', Q8_LABEL[q8] || q8)}
          {row('GPA', Q9_LABEL[q9] || q9)}
          {row('Sittings', Q3_LABEL[q3] || q3)}

          {/* TIMELINE */}
          <div style={sectionLabel}>Timeline</div>
          {row('Next test', Q5_LABEL[q5] || q5)}

          {/* CONTEXT */}
          <div style={sectionLabel}>Context</div>
          {tried && row('Tried', tried)}
          {gaps && row('Biggest gaps', gaps)}
        </div>
      </div>
    </QFScreen>
  );
}

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
            We teach through <em>examples</em>.
          </h1>
          <p className="qf-lead">
            We show how to solve it, practice together, then they solve it.
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
              fontFamily: 'var(--qf-mono)', fontSize: 9, letterSpacing: '0.2em',
              color: 'rgba(245,248,250,0.6)',
            }}>ONE SESSION · ONE SKILL</span>
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
                  fontFamily: 'var(--qf-mono)', fontSize: 9, letterSpacing: '0.06em',
                  textAlign: 'right',
                  color: shown ? (isLast ? 'var(--qf-forest)' : 'var(--qf-ink-mute)') : 'transparent',
                  transition: 'color 0.3s ease',
                }}>Example {i + 1}</span>
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
              fontFamily: 'var(--qf-mono)', fontSize: 9, letterSpacing: '0.2em',
              color: 'var(--qf-forest)',
            }}>{example.tag} · MASTERY</span>
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
  const bars = [
    { lbl: 'Self-study', val: 12,  color: 'rgba(20,32,46,0.18)' },
    { lbl: 'Khan',       val: 25,  color: 'rgba(20,32,46,0.28)' },
    { lbl: 'CB avg',     val: 40,  color: 'rgba(20,32,46,0.45)' },
    { lbl: 'Tutor',      val: 70,  color: 'rgba(20,32,46,0.65)' },
    { lbl: 'illuminairy',val: 182, color: 'var(--qf-forest)', hot: true },
  ];
  const MAX = 182;
  const CHART_H = 160;

  return (
    <QFScreen stepIdx={16} tone="bg-2" onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>Continue</QFButton>}
    >
      <div className="gap-22">
        <h1 className="qf-h1">
          <em>4.5X</em> the avg score improvement.
        </h1>
        <p className="qf-lead">
          The College Board's published avg gain on retest is +40 points. Our students average +182.
        </p>

        {/* Vertical bar chart */}
        <div className="qf-card" style={{ padding: 20 }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: 6,
            height: CHART_H + 48, paddingBottom: 0,
          }}>
            {bars.map((b, i) => {
              const heightPct = (b.val / MAX) * CHART_H;
              return (
                <div key={i} style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 0,
                }}>
                  {/* Value label above bar */}
                  <div style={{
                    fontFamily: 'var(--qf-display)',
                    fontSize: b.hot ? 18 : 13,
                    fontWeight: b.hot ? 600 : 500,
                    color: b.hot ? 'var(--qf-forest)' : 'var(--qf-ink-mid)',
                    letterSpacing: '-0.01em',
                    marginBottom: 4,
                    lineHeight: 1,
                  }}>+{b.val}</div>
                  {/* Bar */}
                  <div style={{
                    width: '100%', height: heightPct,
                    background: b.color, borderRadius: '4px 4px 0 0',
                  }} />
                  {/* Baseline */}
                  <div style={{
                    width: '100%', height: 2,
                    background: 'rgba(20,32,46,0.1)',
                  }} />
                  {/* Label below */}
                  <div style={{
                    fontFamily: 'var(--qf-mono)', fontSize: b.hot ? 9 : 8,
                    letterSpacing: '0.08em', textTransform: 'none',
                    color: b.hot ? 'var(--qf-forest)' : 'var(--qf-ink-mute)',
                    fontWeight: b.hot ? 600 : 400,
                    marginTop: 6, textAlign: 'center', lineHeight: 1.3,
                  }}>{b.lbl}</div>
                </div>
              );
            })}
          </div>
          <div className="qf-meta" style={{ marginTop: 8, textAlign: 'right' }}>Avg point gain · retake</div>
        </div>

        <p className="qf-disclaimer">
          Comparison data: College Board public retake reports + 95 completed illuminairy plans through Q1 2026. Self-study and tutor averages from published Princeton Review / ACT Inc. studies. Individual results vary.
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
      </div>
    </QFScreen>
  );
}
