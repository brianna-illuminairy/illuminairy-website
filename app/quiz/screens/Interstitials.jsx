'use client'; // @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { funnelToday } from "@/lib/funnel-today";
import { QFScreen, QFButton, QFConstellation } from '../components/QFShell';
import { QFBarChart } from '../components/QFBarChart';
import { QFSophiaPlanCard } from '../components/QFPlanVisuals';
import { gainTargetForQ5, shouldShowGainMath } from '../gains';
import { buildV1Projection } from '@/lib/quiz-funnel/v1-projection';
import {
  formatWeeksUntilTest,
} from '@/lib/quiz-funnel/prep-copy';
import {
  FOCUS_SKILL_COUNT,
  KHAN_SAT_MATH_SKILL_COUNT,
  KHAN_SAT_YOUTUBE_VIDEO_COUNT,
  KHAN_SAT_SKILL_COUNT_LABEL,
} from "@/lib/sat-skills-copy";
import { methodScreenLeadParts } from '@/lib/quiz-funnel/method-lead-copy';
import { iCompareHeadlineMultiplier, iCompareProofBridgeLine } from '@/lib/quiz-funnel/i-compare-copy';
import {
  formatSatScoreLabel,
  v1FastWinBridgeParts,
} from '@/lib/quiz-funnel/score-path-copy';
import { QFV1ProjectionChart } from '../components/QFV1ProjectionChart';

export { gainTargetForQ5 };

// ─── I2 · Compute ────────────────────────────────────────────────────────────
const CQ4_BANDS = {
  'u1000': 'Under 1100', '1100-1200': '1100–1200', '1200-1300': '1200–1300',
  '1300-1400': '1300–1400', '1400plus': '1400+',
};
const CQ5_LONG = {
  'aug22': 'August 22, 2026', 'sept12': 'September 12, 2026', 'oct3': 'October 3, 2026',
  'nov7': 'November 7, 2026', 'dec5': 'December 5, 2026', 'tbd': 'TBD',
};
const CQ5_SHORT = {
  'aug22': 'Aug 22', 'sept12': 'Sept 12', 'oct3': 'Oct 3', 'nov7': 'Nov 7', 'dec5': 'Dec 5',
  'tbd': 'TBD',
};
const CSCORE_RETURN = {
  'aug22': 'September 5, 2026', 'sept12': 'September 25, 2026', 'oct3': 'October 18, 2026',
  'nov7': 'November 21, 2026', 'dec5': 'December 19, 2026',
};
const CANCHOR_SCORES = {
  'u1000': 1050, '1100-1200': 1150, '1200-1300': 1250,
  '1300-1400': 1350, '1400plus': 1450,
};
const CQ6_PHRASE = {
  'math': 'math score gains', 'reading': 'reading & writing gains',
  'self-study': 'consistent follow-through', 'wont': 'accountability & consistency',
  'no-plan': 'a clear, structured plan', 'too-busy': 'an efficient, time-boxed plan',
};

function formatPrepStartDate(today) {
  return today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const STARS = [
  [22,40,0.55,1.1],[68,18,0.45,0.7],[120,52,0.65,0.7],[180,28,0.4,1.0],
  [245,62,0.55,0.7],[310,22,0.5,0.7],[44,140,0.4,0.7],[150,112,0.55,1.2],
  [230,148,0.5,0.7],[300,135,0.4,0.7],[18,220,0.5,0.7],[88,250,0.4,0.7],
  [195,205,0.6,1.0],[270,238,0.5,0.7],[335,222,0.4,0.7],[55,330,0.5,1.1],
  [140,360,0.4,0.7],[220,320,0.55,0.7],[298,355,0.4,0.7],[30,440,0.5,0.7],
  [110,455,0.55,1.0],[180,418,0.4,0.7],[252,438,0.5,0.7],[320,460,0.6,1.1],
  [45,540,0.4,0.7],[125,565,0.5,0.7],[200,525,0.55,0.7],[280,548,0.4,1.0],
  [340,530,0.5,0.7],[70,635,0.5,0.7],[160,650,0.4,0.7],[240,615,0.55,1.1],
  [310,640,0.4,0.7],
];

export function QFI2Compute({ onContinue, onBack, q4 = '1200-1300', q5 = 'oct3', q6 = ['math', 'no-plan'] }) {
  const hasQ4 = q4 && q4 !== 'na' && CQ4_BANDS[q4];
  const hasDate = q5 && q5 !== 'tbd' && q5 !== '2027' && CQ5_LONG[q5];
  const problemSummary = q6.slice(0, 2).map(id => CQ6_PHRASE[id] || id).join(' + ');
  const TEST_DATES = {
    'aug22': new Date('2026-08-22'), 'sept12': new Date('2026-09-12'), 'oct3': new Date('2026-10-03'),
    'nov7': new Date('2026-11-07'), 'dec5': new Date('2026-12-05'),
  };
  const today = funnelToday();
  const prepStart = formatPrepStartDate(today);
  const daysToTest = TEST_DATES[q5]
    ? Math.round((TEST_DATES[q5] - today) / (1000 * 60 * 60 * 24))
    : null;

  // Build a flat reveal sequence: section headers + their rows
  const items = [];
  items.push({ type: 'header', label: 'Reviewing your inputs', section: 1 });
  if (hasQ4) items.push({ type: 'row', content: <>Starting score range: <span className="v">{CQ4_BANDS[q4]}</span></> });
  else       items.push({ type: 'row', content: <>No official SAT yet: <span className="v">planning for first sit</span></> });
  if (hasDate) items.push({ type: 'row', content: <>Next test date: <span className="v">{CQ5_LONG[q5]}</span></> });
  items.push({ type: 'row', content: <>Early Decision deadlines: <span className="v">Nov 1</span></> });
  if (CSCORE_RETURN[q5]) items.push({ type: 'row', content: <>Score return: <span className="v">{CSCORE_RETURN[q5]}</span></> });

  items.push({ type: 'header', label: 'Building plan frame', section: 2 });
  if (daysToTest) items.push({ type: 'row', content: <>Building <span className="v">{daysToTest}-day</span> prep window: <span className="v">{prepStart} → {CQ5_SHORT[q5]}</span></> });
  else            items.push({ type: 'row', content: <>Building <span className="v">flexible</span> prep window</> });
  if (hasQ4)          items.push({ type: 'row', content: <>Plan anchor score: <span className="v">{CANCHOR_SCORES[q4]}</span></> });
  if (problemSummary) items.push({ type: 'row', content: <>Optimizing for: <span className="v">{problemSummary}</span></> });

  const [revealed, setRevealed] = useState(0);
  const [barPct, setBarPct] = useState(0);
  const [showBar, setShowBar] = useState(false);
  const [showMissing, setShowMissing] = useState(false);

  // Stagger each item in sequence, then start the progress bar
  useEffect(() => {
    const timers = [];
    const FIRST_DELAY = 350;
    const STAGGER = 320;
    for (let i = 0; i < items.length; i++) {
      timers.push(setTimeout(() => setRevealed(i + 1), FIRST_DELAY + i * STAGGER));
    }
    const barDelay = FIRST_DELAY + items.length * STAGGER + 250;
    timers.push(setTimeout(() => {
      setShowBar(true);
      let pct = 0;
      const inc = setInterval(() => {
        pct += 2;
        setBarPct(pct);
        if (pct >= 100) {
          clearInterval(inc);
          setShowMissing(true);
        }
      }, 28);
      timers.push(inc);
    }, barDelay));
    return () => timers.forEach(t => {
      if (typeof t === 'number') clearTimeout(t);
      else clearInterval(t);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const barLabel = barPct < 40 ? 'ANALYZING INPUTS'
                 : barPct < 70 ? 'DETECTING GAPS'
                 : 'MISSING DATA DETECTED';

  return (
    <QFScreen stepIdx={9} tone="ink" onBack={onBack}
      footer={showMissing ? <QFButton kind="forest" onClick={onContinue}>Finalize inputs</QFButton> : undefined}
    >
      <svg className="qf-starfield" viewBox="0 0 360 700" preserveAspectRatio="xMidYMid slice">
        {STARS.map(([x, y, o, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={o} />
        ))}
      </svg>
      <div className="qf-aurora-band" />

      <div className="qf-compute">
        <div className="compute-eyebrow">Building your plan</div>

        {items.map((item, i) => {
          const shown = i < revealed;
          const style = {
            opacity: shown ? 1 : 0,
            transform: shown ? 'translateY(0)' : 'translateY(4px)',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
          };
          if (item.type === 'header') {
            return (
              <div key={i} className="compute-header"
                style={{ ...style, marginTop: item.section > 1 ? 12 : 0 }}>
                <span className="ck">✓</span> {item.label}
              </div>
            );
          }
          return (
            <div key={i} className="compute-line" style={style}>
              {item.content}
            </div>
          );
        })}

        {showBar && (
          <div style={{ marginTop: 14, opacity: 1, animation: 'fadeIn 0.4s ease' }}>
            <div className="compute-status">
              {barLabel}… {barPct < 100 ? `${barPct}%` : '100%'}
            </div>
            <div style={{
              height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 4, overflow: 'hidden',
            }}>
              <div style={{
                width: `${barPct}%`, height: '100%',
                background: 'var(--qf-glow)', borderRadius: 4,
                transition: 'width 0.1s linear',
              }} />
            </div>
          </div>
        )}

        {showMissing && (
          <div style={{ marginTop: 10, opacity: 1, animation: 'fadeIn 0.4s ease' }}>
            <div className="compute-arrow" style={{ marginBottom: 8 }}>
              → <span className="v" style={{ opacity: 0.5 }}>Target score: ___</span>
              <span className="compute-hint">next question</span>
            </div>
            <div className="compute-arrow">
              → <span className="v" style={{ opacity: 0.5 }}>GPA: ___</span>
              <span className="compute-hint">after that</span>
            </div>
          </div>
        )}
      </div>
    </QFScreen>
  );
}

// ─── I3 · Bridge ─────────────────────────────────────────────────────────────
const BR_TEST_DATES = {
  'aug22': new Date('2026-08-22'), 'sept12': new Date('2026-09-12'), 'oct3': new Date('2026-10-03'),
  'nov7': new Date('2026-11-07'), 'dec5': new Date('2026-12-05'),
};
const BR_DATE_NUMERIC = {
  'aug22': '8/22', 'sept12': '9/12', 'oct3': '10/3', 'nov7': '11/7', 'dec5': '12/5',
};

export function QFI3Bridge({ onContinue, onBack, q5 = 'oct3' }) {
  const today = funnelToday();
  const daysToTest = BR_TEST_DATES[q5]
    ? Math.round((BR_TEST_DATES[q5] - today) / (1000 * 60 * 60 * 24))
    : null;
  const dateNumeric = BR_DATE_NUMERIC[q5];
  const hasDate = daysToTest && dateNumeric;
  return (
    <QFScreen stepIdx={11} ornament="glow" onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>One more question</QFButton>}
    >
      <div className="gap-22" style={{ marginTop: 4 }}>
        <p className="qf-lead">
          {hasDate ? (
            <>Good news, we think we can help get their score up by the <em>{dateNumeric}</em> SAT, which is only <em>{daysToTest} days</em> away.</>
          ) : (
            <>Good news, we think we can help get their score up before the test.</>
          )}
        </p>
        <p className="qf-lead">
          One more question about their <em>GPA</em>. Then we&apos;ll show a realistic <em>score projection</em> and their Improvement Plan.
        </p>
      </div>
    </QFScreen>
  );
}

// ─── I · GPA Gap (redesigned: side-by-side cards, user-specified copy) ───────
const GAP_Q4_LABEL = {
  'u1000': 'under 1100', '1100-1200': '1100–1200',
  '1200-1300': '1200–1300', '1300-1400': '1300–1400',
};
const GAP_Q9_LABEL = {
  '3.0-3.3': '3.0–3.3', '3.3-3.5': '3.3–3.5', '3.5-3.7': '3.5–3.7', '3.7-3.9': '3.7–3.9', '4.0+': '4.0+',
};

export function QFIGPAGap({ onContinue, onBack, q4 = '1200-1300', q9 = '3.8-4.0' }) {
  return (
    <QFScreen stepIdx={13} onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>Continue</QFButton>}
    >
      <div className="gap-22" style={{ marginTop: 4 }}>
        <h1 className="qf-h1">
          Why smart kids score <em>low</em> on the SAT.
        </h1>

        <p className="qf-lead">
          It's common for smart students with high GPAs to score lower than expected on the SAT.
          The same habits that earn their A&apos;s in class quietly cost points on a test scored on pace.
        </p>

        {/* Side-by-side contrast table */}
        <div style={{ display: 'flex', gap: 10 }}>
          {/* Left: School rewards */}
          <div style={{
            flex: 1,
            background: 'var(--qf-bg-2)',
            border: '1px solid var(--qf-line)',
            borderRadius: 12,
            padding: 16,
          }}>
            <div style={{
              fontFamily: 'var(--qf-display)', fontSize: 15, fontWeight: 500,
              letterSpacing: '-0.01em', color: 'var(--qf-ink)', marginBottom: 14, lineHeight: 1.3,
            }}>
              <span style={{ display: 'block' }}>School rewards</span>
              <span style={{ display: 'block' }}>taking your time</span>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Reading 1st & Rereading', 'Showing Work', 'Calculator', 'Sticking with hard problems'].map(item => (
                <li key={item} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: 'var(--qf-ink-2)', lineHeight: 1.4 }}>
                  <span style={{
                    width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                    background: 'rgba(20,32,46,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, color: 'var(--qf-ink-mute)',
                  }}>·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: SAT rewards */}
          <div style={{
            flex: 1,
            background: 'var(--qf-ink)',
            borderRadius: 12,
            padding: 16,
            color: '#F5F8FA',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(119, 200, 154, 0.18)',
          }}>
            <div style={{
              position: 'absolute', top: -40, right: -30,
              width: 160, height: 160,
              background: 'radial-gradient(circle, rgba(119,200,154,0.22) 0%, rgba(0,87,168,0.10) 35%, transparent 65%)',
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative' }}>
              <div style={{
                fontFamily: 'var(--qf-display)', fontSize: 15, fontWeight: 500,
                letterSpacing: '-0.01em', color: 'var(--qf-glow)', marginBottom: 14, lineHeight: 1.3,
              }}>
                <span style={{ display: 'block' }}>SAT rewards</span>
                <span style={{ display: 'block' }}>moving fast</span>
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Question 1st & Skimming', 'Moving on', 'Double-checking', 'Skipping & coming back'].map(item => (
                  <li key={item} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: 'rgba(245,248,250,0.85)', lineHeight: 1.4 }}>
                    <span style={{
                      width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                      background: 'rgba(119,200,154,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, color: 'var(--qf-glow)',
                    }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </QFScreen>
  );
}

// ─── I-compare · Prep methods comparison ─────────────────────────────────────
const COMPARE_Q7_LABEL = {
  khan: 'Khan / Bluebook',
  group: 'Group class',
  online: 'Online course',
  app: 'SAT app',
  book: 'Prep book',
  nothing: 'Self-study',
};
const COMPARE_Q7_PRIORITY = ['khan', 'group', 'online', 'app', 'book', 'nothing'];

function compareBar1Label(q7 = []) {
  const ids = Array.isArray(q7) ? q7 : [];
  const key = COMPARE_Q7_PRIORITY.find(p => ids.includes(p));
  return (key && COMPARE_Q7_LABEL[key]) || COMPARE_Q7_LABEL.nothing;
}

function compareBar1Short(q7 = []) {
  return compareBar1Label(q7);
}

export function QFIComparePrep({ onContinue, onBack, q7 = ['khan'] }) {
  const bar1Short = compareBar1Short(q7);
  const multiplier = iCompareHeadlineMultiplier();
  const bars = [
    { lbl: bar1Short, val: 40, color: 'rgba(20,32,46,0.30)' },
    { lbl: 'Group class', val: 70, color: 'rgba(20,32,46,0.55)' },
    { lbl: 'Illuminairy', val: 182, color: 'var(--qf-forest)', hot: true },
  ];
  const MAX = 182;

  return (
    <QFScreen stepIdx={8} onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>See what actually works</QFButton>}
    >
      <div className="gap-22" style={{ marginTop: 4 }}>
        <h1 className="qf-h1" style={{ marginBottom: 0 }}>
          <em>{multiplier}×</em> better results with a{' '}
          <em>diagnostic-driven SAT plan</em>.
        </h1>

        <div className="qf-card gap-14" style={{ padding: 20 }}>
          <QFBarChart bars={bars} max={MAX} />
        </div>

        <p className="qf-lead" style={{ margin: 0 }}>
          {iCompareProofBridgeLine()}
        </p>

        <p className="qf-disclaimer" style={{ margin: 0 }}>
          Source: College Board retest summaries. Individual results vary.
        </p>
      </div>
    </QFScreen>
  );
}

export function QFV1Projection({
  onContinue, onBack,
  q2 = 'top-choice',
  q4 = '1200-1300', q5 = 'oct3', q8 = '1400',
}) {
  const projection = buildV1Projection({ q2, q4, q5, q8 });
  const showGainMath = shouldShowGainMath(q5);
  const reachScore = formatSatScoreLabel(projection.displayTarget);
  const goalScore = projection.goalTarget ?? projection.displayTarget;

  const [showCopy, setShowCopy] = useState(!projection.showChart);

  const handleChartAnim = useCallback(() => {
    setShowCopy(true);
  }, []);

  return (
    <QFScreen stepIdx={14} ornament="glow" onBack={onBack}
      footer={
        <QFButton kind="forest" onClick={onContinue} disabled={!showCopy}>
          See how we teach Skill 1
        </QFButton>
      }
    >
      <div className="gap-22">
        {showGainMath && (
          <>
            <h1 className="qf-h1" style={{ marginBottom: 0 }}>
              {projection.hasDate ? (
                <>
                  By <em>{projection.testDateLabel}</em>, they could reach <em>{reachScore}</em>.
                </>
              ) : (
                <>
                  By test day, they could reach <em>{reachScore}</em>.
                </>
              )}
            </h1>

            {projection.showChart ? (
              <QFV1ProjectionChart
                current={projection.current}
                displayTarget={projection.displayTarget}
                goalTarget={projection.goalTarget}
                skillPts={projection.skillPts}
                gapExceedsModeled={projection.gapExceedsModeled}
                onAnimationComplete={handleChartAnim}
              />
            ) : null}
          </>
        )}

        <div style={{
          opacity: showCopy ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}>
          <p className="qf-lead" style={{ margin: 0 }}>
            {v1FastWinBridgeParts(goalScore).map((part, i) =>
              part.em ? (
                <em key={i}>{part.text}</em>
              ) : (
                <span key={i}>{part.text}</span>
              )
            )}
          </p>
        </div>
      </div>
    </QFScreen>
  );
}

// ─── I · Diagnosis (content skills, no tricks) ───────────────────────────────
const D_TEST_DATE_SHORT = {
  'aug22': 'August 22', 'sept12': 'September 12', 'oct3': 'October 3', 'nov7': 'November 7',
  'dec5': 'December 5',
};
const D_TEST_DATES = {
  'aug22': new Date('2026-08-22'), 'sept12': new Date('2026-09-12'), 'oct3': new Date('2026-10-03'),
  'nov7': new Date('2026-11-07'), 'dec5': new Date('2026-12-05'),
};

const PREP_WHY_FAILED = {
  'khan':    `Khan's SAT math course has ${KHAN_SAT_MATH_SKILL_COUNT} lessons and ${KHAN_SAT_YOUTUBE_VIDEO_COUNT} videos. Without the Skill Diagnostic, it's a needle in a haystack. We rank the ${FOCUS_SKILL_COUNT}–6 that move their score.`,
  'group':   "Group classes pace to the middle of the room. Nobody built a plan for the few skills actually holding their score back.",
  'online':  "One syllabus for everyone. It doesn't find their weakest skills and rank them.",
  'app':     "SAT apps keep serving questions. They don't tell you which content skills to master first.",
  'book':    "Paper prep trains the wrong test. The digital SAT rewards Desmos and on-screen pacing, not flipping pages.",
  'nothing': "Without the Skill Diagnostic, students guess where to start and lose months on low-impact review.",
};
// Real SAT content skills (not tricks) tied to Q6 selections.
const MATH_SKILLS = [
  { name: 'Linear Functions',           lines: ['Linear', 'Functions'],         pts: 50 },
  { name: 'Geometry: Right Triangles',  lines: ['Right', 'Triangles'],          pts: 45 },
  { name: 'Quadratics',                 lines: ['Quadratics'],                  pts: 40 },
  { name: 'Word Problems',              lines: ['Word', 'Problems'],            pts: 35 },
  { name: 'Functions & Graphs',         lines: ['Functions', '& Graphs'],       pts: 30 },
];
const READING_SKILLS = [
  { name: 'Inference & Main Idea',      lines: ['Inference', '& Main Idea'],    pts: 50 },
  { name: 'Vocab in Context',           lines: ['Vocab in', 'Context'],         pts: 45 },
  { name: 'Reading Pacing',             lines: ['Reading', 'Pacing'],           pts: 40 },
  { name: 'Evidence-Based Reading',     lines: ['Evidence-', 'Based'],          pts: 35 },
  { name: 'Question-First Strategy',    lines: ['Question-', 'First'],          pts: 30 },
];

function pickContentSkills(q6 = []) {
  const hasMath = q6.includes('math');
  const hasReading = q6.includes('reading');
  if (hasMath && !hasReading) return MATH_SKILLS;
  if (hasReading && !hasMath) return READING_SKILLS;
  // Mixed (default, or both selected): top 5 by points across both domains
  return [
    MATH_SKILLS[0],     // Linear Functions +35
    READING_SKILLS[0],  // Inference & Main Idea +30
    MATH_SKILLS[1],     // Geometry: Right Triangles +25
    READING_SKILLS[1],  // Vocab in Context +25
    MATH_SKILLS[2],     // Quadratics +22
  ];
}

// Short-timeline (≤6 weeks) rescale: skill points sum to 150 instead of 200
const SHORT_PTS = [40, 35, 30, 25, 20];

/** Score band for i-diag “Break out of …” — q4 is a range only, not low/high within it */
const Q4_BREAK_OUT_BAND = {
  u1000: 'the 1100s',
  '1100-1200': 'the 1100s',
  '1200-1300': 'the 1200s',
  '1300-1400': 'the 1300s',
  '1400plus': 'the 1400s',
};

export function QFIDiagnosis({ onContinue, onBack, q3 = 'sat-1', q4 = '1200-1300', q6 = ['math', 'no-plan'], q7 = [], q5 = 'oct3' }) {
  const today = funnelToday();
  const days = D_TEST_DATES[q5]
    ? Math.round((D_TEST_DATES[q5] - today) / (1000 * 60 * 60 * 24))
    : null;
  const weeks = days ? Math.round(days / 7) : null;
  const dateMonth = D_TEST_DATE_SHORT[q5] ? D_TEST_DATE_SHORT[q5].split(' ')[0] : null;

  // ≤6 weeks → realistic target is +150, skills rescaled to match; otherwise +200
  const isShort = weeks != null && weeks <= 6;
  const skills = pickContentSkills(q6).map((s, i) =>
    isShort ? { ...s, pts: SHORT_PTS[i] ?? s.pts } : s
  );
  const showGainMath = shouldShowGainMath(q5);

  // Constellation reveal: chaotic many skills → 5 illuminated + connected
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 650);
    return () => clearTimeout(t);
  }, []);

  // Star positions in 360×140 viewBox: 5 lit stars + 23 scattered dim dots (compact)
  const LIT = [
    { x: 40,  y: 80 },
    { x: 115, y: 55 },
    { x: 190, y: 90 },
    { x: 260, y: 60 },
    { x: 320, y: 85 },
  ];
  const LINKS = [[0,1],[1,2],[2,3],[3,4]];
  const maxPts = Math.max(...skills.map(s => s.pts));
  const DIM = [
    [20,12],[50,22],[80,15],[140,25],[170,12],[200,18],[235,10],[290,15],[335,18],
    [22,118],[60,128],[95,135],[175,128],[215,120],[255,134],[295,124],[330,115],[355,128],
    [73,42],[245,32],[300,40],[353,72],[20,72],
  ];

  const hasScore = q4 && q4 !== 'na' && Q4_BREAK_OUT_BAND[q4];
  const breakOutBand = Q4_BREAK_OUT_BAND[q4];
  const untilTest = formatWeeksUntilTest(weeks, dateMonth);

  return (
    <QFScreen stepIdx={9} onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>See what works</QFButton>}
    >
      <div className="gap-22" style={{ marginTop: 4 }}>
        <h1 className="qf-h1" style={{ marginBottom: 0 }}>
          Our Skill Diagnostic identifies the{' '}
          <em>{FOCUS_SKILL_COUNT}–6 highest-impact skills</em>.
        </h1>
        <div style={{ position: 'relative', padding: 0 }}>
          <svg viewBox="0 0 360 140"
            style={{ width: '100%', display: 'block', overflow: 'visible' }}>
            {/* Dim scattered (the 23 that don't matter) */}
            {DIM.map(([x, y], i) => (
              <circle key={`d${i}`} cx={x} cy={y} r={2.2}
                fill="rgba(20,32,46,0.22)"
                style={{
                  transition: 'opacity 0.9s ease',
                  opacity: revealed ? 0.38 : 1,
                }}
              />
            ))}
            {/* Constellation links — width + opacity scale with avg pts of endpoints */}
            {LINKS.map(([a, b], i) => {
              const avgScale = (skills[a].pts + skills[b].pts) / (2 * maxPts);
              return (
                <line key={`ln${i}`}
                  x1={LIT[a].x} y1={LIT[a].y}
                  x2={LIT[b].x} y2={LIT[b].y}
                  stroke="#77C89A"
                  strokeWidth={0.5 + 1.8 * avgScale}
                  strokeLinecap="round"
                  style={{
                    transition: 'opacity 0.6s ease 0.9s',
                    opacity: revealed ? 0.25 + 0.6 * avgScale : 0,
                  }}
                />
              );
            })}
            {/* 5 lit stars — size + glow scale with pts (bubble graph) */}
            {LIT.map(({ x, y }, i) => {
              const skill = skills[i];
              const scale = skill.pts / maxPts;           // 0.6 (smallest) → 1 (biggest)
              const haloR = 8 + 9 * scale;                // 13.4 → 17
              const midR  = 4.5 + 5.5 * scale;            // 7.8 → 10
              const coreR = 2.2 + 3 * scale;              // 4 → 5.2
              const glowPx = 4 + 4 * scale;               // 6.4 → 8
              return (
                <g key={`l${i}`} style={{
                  transition: 'opacity 0.6s ease 0.25s',
                  opacity: revealed ? 1 : 0,
                }}>
                  {/* +pts label above (positioned outside halo) */}
                  {showGainMath && (
                  <text x={x} y={y - haloR - 5}
                    textAnchor="middle"
                    fontFamily="DM Mono, ui-monospace, monospace"
                    fontSize="10.5" fontWeight="600"
                    fill="#2F6E47" letterSpacing="0.04em">
                    +{skill.pts} pts
                  </text>
                  )}
                  {/* Aurora-glow bubble star — radii proportional to pts */}
                  <circle cx={x} cy={y} r={haloR} fill="rgba(119,200,154,0.10)" />
                  <circle cx={x} cy={y} r={midR}  fill="rgba(119,200,154,0.28)" />
                  <circle cx={x} cy={y} r={coreR} fill="#2F6E47"
                    style={{
                      filter: `drop-shadow(0 0 ${glowPx}px rgba(119,200,154,0.85))`,
                      WebkitFilter: `drop-shadow(0 0 ${glowPx}px rgba(119,200,154,0.85))`,
                    }} />
                  {/* Skill name below halo */}
                  <text x={x} y={y + haloR + 11}
                    textAnchor="middle"
                    fontFamily="var(--font-display), 'Source Serif 4', Georgia, serif"
                    fontSize="10.5" fontWeight="500"
                    fill="#121A2B" letterSpacing="-0.005em">
                    {skill.lines.map((ln, li) => (
                      <tspan key={li} x={x} dy={li === 0 ? 0 : 11}>{ln}</tspan>
                    ))}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <p
          className="qf-lead"
          style={{
            margin: 0,
            opacity: revealed ? 1 : 0,
            transition: 'opacity 0.6s ease 0.7s',
          }}
        >
          {hasScore ? (
            <>
              Your fastest path out of <em>{breakOutBand}</em>
              {untilTest ? (
                <>
                  {' '}
                  before the <em>{untilTest.monthName}</em> SAT.
                </>
              ) : (
                '.'
              )}
            </>
          ) : (
            <>
              Your fastest path to a stronger score
              {untilTest ? (
                <>
                  {' '}
                  before the <em>{untilTest.monthName}</em> SAT.
                </>
              ) : (
                '.'
              )}
            </>
          )}
        </p>
      </div>
    </QFScreen>
  );
}

// ─── Product-outcome (Hims-style: offer + outcome collage, 1 sentence) ───────
function MethodLeadLine({ parts }) {
  return (
    <p className="qf-lead" style={{ margin: 0 }}>
      {parts.map((part, i) =>
        part.em ? (
          <em key={i}>{part.text}</em>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </p>
  );
}

export function QFIMethod({ onContinue, onBack, q5 = 'oct3' }) {
  const showGainMath = shouldShowGainMath(q5);
  const gain = gainTargetForQ5(q5);
  const methodLead = methodScreenLeadParts(gain, showGainMath);
  return (
    <QFScreen stepIdx={10} onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>How it works</QFButton>}
    >
      <div className="qf-i-method">
        <div className="qf-i-method__copy">
          <MethodLeadLine parts={methodLead} />
        </div>
        <div className="qf-i-method__visual">
          <img
            src="/photos/tutor-student-session.png"
            alt="Sophia with her tutor and her personalized weekly SAT Improvement Plan"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      </div>
    </QFScreen>
  );
}

// ─── I · Steps (Slide 2: large plan visual + 3 Hims-style labels overlaid) ────
export function QFISteps({ onContinue, onBack }) {
  return (
    <QFScreen stepIdx={11} onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>Build their plan</QFButton>}
    >
      <p className="qf-lead" style={{ margin: '0 0 4px' }}>
        We build their Improvement Plan around the few skills most likely to raise their score fastest.
      </p>
      <div style={{ position: 'relative', paddingTop: 16, paddingBottom: 20 }}>
        <div style={{ margin: '0 8px' }}>
          <QFSophiaPlanCard />
        </div>

        {/* Floating Hims-style labels — pointing at parts */}
        {/* DIAGNOSE — top-left, points to ranked skill names */}
        <div style={{
          position: 'absolute',
          top: 110, left: -6,
          transform: 'rotate(-3deg)',
          background: 'var(--qf-paper)',
          border: '1.5px solid var(--qf-forest)',
          borderRadius: 12,
          padding: '8px 14px',
          boxShadow: '0 8px 20px rgba(47,110,71,0.25)',
          zIndex: 2,
          maxWidth: 150,
        }}>
          <div style={{
            fontFamily: 'var(--qf-display)', fontSize: 15, fontWeight: 600,
            color: 'var(--qf-forest)', letterSpacing: '-0.01em',
          }}>Skill Diagnostic</div>
          <div style={{
            fontFamily: 'var(--qf-body)', fontSize: 11.5,
            color: 'var(--qf-ink-2)', marginTop: 2, lineHeight: 1.3,
          }}>The 5–6 gap skills.</div>
        </div>

        {/* RANK — middle-right, points to impact bars/scores */}
        <div style={{
          position: 'absolute',
          top: 235, right: -6,
          transform: 'rotate(3deg)',
          background: 'var(--qf-paper)',
          border: '1.5px solid var(--qf-forest)',
          borderRadius: 12,
          padding: '8px 14px',
          boxShadow: '0 8px 20px rgba(47,110,71,0.25)',
          zIndex: 2,
          maxWidth: 150,
        }}>
          <div style={{
            fontFamily: 'var(--qf-display)', fontSize: 15, fontWeight: 600,
            color: 'var(--qf-forest)', letterSpacing: '-0.01em',
          }}>Rank</div>
          <div style={{
            fontFamily: 'var(--qf-body)', fontSize: 11.5,
            color: 'var(--qf-ink-2)', marginTop: 2, lineHeight: 1.3,
          }}>By point impact.</div>
        </div>

        {/* PLAN — bottom-left, points to the plan total footer */}
        <div style={{
          position: 'absolute',
          bottom: 14, left: -6,
          transform: 'rotate(-2deg)',
          background: 'var(--qf-paper)',
          border: '1.5px solid var(--qf-forest)',
          borderRadius: 12,
          padding: '8px 14px',
          boxShadow: '0 8px 20px rgba(47,110,71,0.25)',
          zIndex: 2,
          maxWidth: 160,
        }}>
          <div style={{
            fontFamily: 'var(--qf-display)', fontSize: 15, fontWeight: 600,
            color: 'var(--qf-forest)', letterSpacing: '-0.01em',
          }}>Plan</div>
          <div style={{
            fontFamily: 'var(--qf-body)', fontSize: 11.5,
            color: 'var(--qf-ink-2)', marginTop: 2, lineHeight: 1.3,
          }}>Focus each week.</div>
        </div>
      </div>
    </QFScreen>
  );
}
