'use client'; // @ts-nocheck
import { useState, useEffect } from 'react';
import { funnelToday } from "@/lib/funnel-today";
import { QFScreen, QFButton, QFConstellation } from '../components/QFShell';
import { QFBarChart } from '../components/QFBarChart';
import { QFSophiaPlanCard } from '../components/QFPlanVisuals';
import { gainTargetForQ5, shouldShowGainMath, weeksUntilQ5Test } from '../gains';
import { q5DisplayLabel } from '@/lib/quiz-funnel/quiz-profile';
import { SCORE_PATH_DEFAULT_START, SCORE_PATH_DEFAULT_WEEKS } from '@/lib/quiz-funnel/quiz-profile';
import {
  modeledGainForTimeline,
} from '@/lib/quiz-funnel/score-path-gain';
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
import { v1EmotionalBridgeParts } from '@/lib/quiz-funnel/score-path-copy';
import { stakesOutcome } from '@/lib/quiz-funnel/stakes-copy';

export { gainTargetForQ5 };

// ─── I1 · Proof bridge ───────────────────────────────────────────────────────
const I1_DATE_PHRASE = {
  'aug22': 'August 22', 'oct3': 'October 3', 'nov7': 'November 7',
  'dec5': 'December 5', '2027': null, 'tbd': null,
};

export function QFI1Proof({ onContinue, onBack, q2 = 'top-choice', q3 = 'sat-1', q5 = 'oct3', vars = {} }) {
  const hasSat = ['sat-1', 'sat-2', 'sat-3+'].includes(q3);
  const v = {
    test_date_phrase: I1_DATE_PHRASE[q5] ?? null,
    stakes_outcome: stakesOutcome(q2),
    ...vars,
  };
  const hasDate = !!v.test_date_phrase;
  const followUp = hasSat
    ? 'But first, we need to better understand why they struggled on the SAT.'
    : q3 === 'psat-only'
      ? 'But first, we need to understand where the gaps are before their first official SAT.'
      : 'But first, we need to understand what to focus on before their first official SAT.';
  return (
    <QFScreen stepIdx={6} ornament="glow" onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>Continue</QFButton>}
    >
      <div className="gap-22" style={{ marginTop: 4 }}>
        <p className="qf-lead">
          {hasDate ? (
            <>We're building a plan to help your kid get their SAT score up by the <em>{v.test_date_phrase}</em> SAT, so that <em>{v.stakes_outcome}</em>.</>
          ) : (
            <>We're building a plan to help your kid get their SAT score up, so that <em>{v.stakes_outcome}</em>.</>
          )}
        </p>
        <p className="qf-lead">
          {followUp}
        </p>
      </div>
    </QFScreen>
  );
}

// ─── I2 · Compute ────────────────────────────────────────────────────────────
const CQ4_BANDS = {
  'u1000': 'Under 1100', '1100-1200': '1100–1200', '1200-1300': '1200–1300',
  '1300-1400': '1300–1400', '1400plus': '1400+',
};
const CQ5_LONG = {
  'aug22': 'August 22, 2026', 'oct3': 'October 3, 2026', 'nov7': 'November 7, 2026',
  'dec5': 'December 5, 2026', '2027': 'Spring 2027', 'tbd': 'TBD',
};
const CQ5_SHORT = {
  'aug22': 'Aug 22', 'oct3': 'Oct 3', 'nov7': 'Nov 7', 'dec5': 'Dec 5',
  '2027': 'Spring 2027', 'tbd': 'TBD',
};
const CSCORE_RETURN = {
  'aug22': 'September 5, 2026', 'oct3': 'October 18, 2026',
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
  const hasDate = q5 && q5 !== 'tbd' && q5 !== '2027';
  const isEarlyApp = q5 === 'aug22' || q5 === 'oct3';
  const problemSummary = q6.slice(0, 2).map(id => CQ6_PHRASE[id] || id).join(' + ');
  const TEST_DATES = {
    'aug22': new Date('2026-08-22'), 'oct3': new Date('2026-10-03'),
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
  if (hasDate)    items.push({ type: 'row', content: <>Next test date: <span className="v">{CQ5_LONG[q5]}</span></> });
  if (isEarlyApp) items.push({ type: 'row', content: <>Early Action deadlines: <span className="v">Nov 1</span></> });
  items.push({ type: 'row', content: <>Regular Decision deadlines: <span className="v">Jan 1</span></> });
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
                style={{ ...style, marginTop: item.section > 1 ? 18 : 0 }}>
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
          <div style={{ marginTop: 22, opacity: 1, animation: 'fadeIn 0.4s ease' }}>
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
          <div style={{ marginTop: 18, opacity: 1, animation: 'fadeIn 0.4s ease' }}>
            <div className="compute-arrow" style={{ marginBottom: 8 }}>
              → <span className="v" style={{ opacity: 0.5 }}>Target score: ___</span>
              <span style={{ opacity: 0.7, marginLeft: 8, fontSize: 13 }}>next question</span>
            </div>
            <div className="compute-arrow">
              → <span className="v" style={{ opacity: 0.5 }}>GPA: ___</span>
              <span style={{ opacity: 0.7, marginLeft: 8, fontSize: 13 }}>after that</span>
            </div>
          </div>
        )}
      </div>
    </QFScreen>
  );
}

// ─── I3 · Bridge ─────────────────────────────────────────────────────────────
const BR_TEST_DATES = {
  'aug22': new Date('2026-08-22'), 'oct3': new Date('2026-10-03'),
  'nov7': new Date('2026-11-07'), 'dec5': new Date('2026-12-05'),
};
const BR_DATE_NUMERIC = { 'aug22': '8/22', 'oct3': '10/3', 'nov7': '11/7', 'dec5': '12/5' };

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
          One more question about their <em>GPA</em>. Then we'll show a realistic <em>score projection</em> and their plan.
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
          The same habits that earn his A's in class quietly cost points on a test scored on pace.
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

// ─── V1 · Skill-zone projection ───────────────────────────────────────────────
const V1_Q4_TO_SCORE = {
  'u1000': 1050, '1100-1200': 1150, '1200-1300': 1250,
  '1300-1400': 1350, '1400plus': 1430,
};
const V1_Q8_TO_TARGET = {
  '1250': 1250, '1300': 1300, '1350': 1350, '1400': 1400, '1450': 1450,
};
const V1_Q5_DATE = {
  'aug22': 'Aug 22', 'oct3': 'Oct 3', 'nov7': 'Nov 7', 'dec5': 'Dec 5',
  '2027': 'spring 2027', 'tbd': 'test day',
};
const SKILL_GAIN_RATIOS = [60, 48, 38, 26, 18];
const V1_SKILL_DELAYS = [400, 450, 480, 520, 550];

function scaleSkillGains(gap) {
  const sum = SKILL_GAIN_RATIOS.reduce((a, b) => a + b, 0);
  const scaled = SKILL_GAIN_RATIOS.map(r => Math.round((r / sum) * gap));
  const diff = gap - scaled.reduce((a, b) => a + b, 0);
  scaled[4] += diff;
  return scaled;
}

/** Padded score domain so endpoint labels and +pts tags stay inside the plot. */
function v1PlotScale(current, displayTarget, plotTop, plotH) {
  const gap = Math.max(displayTarget - current, 1);
  const pad = Math.max(30, Math.round(gap * 0.08));
  const min = current - pad * 0.35;
  const max = displayTarget + pad;
  const span = Math.max(max - min, 1);
  const py = (score) => plotTop + plotH - ((score - min) / span) * plotH;
  return { py, min, max, span };
}

function v1ScoreLabelY(y, plotTop, baselineY, nearTop) {
  const above = y - 14;
  const below = y + 16;
  if (nearTop) {
    return above >= plotTop + 2 ? above : below;
  }
  return below <= baselineY - 6 ? below : above;
}

export function QFV1Projection({
  onContinue, onBack,
  q4 = '1200-1300', q5 = 'oct3', q8 = '1400',
}) {
  const hasScore = q4 && q4 !== 'na' && V1_Q4_TO_SCORE[q4];
  const hasTarget = q8 && q8 !== 'tbd';
  const current = hasScore ? V1_Q4_TO_SCORE[q4] : SCORE_PATH_DEFAULT_START;
  let target = hasTarget
    ? (V1_Q8_TO_TARGET[q8] ?? Math.min(1600, current + 150))
    : Math.min(1600, current + 150);
  if (target <= current) target = Math.min(1600, current + 100);
  const rawGap = target - current;

  const weeksUntil = weeksUntilQ5Test(q5);
  const hasDate = weeksUntil != null && weeksUntil > 0;
  const chartWeeks = hasDate ? Math.max(2, weeksUntil) : SCORE_PATH_DEFAULT_WEEKS;
  const gap = modeledGainForTimeline(rawGap, hasDate ? chartWeeks : null) ?? rawGap;
  const displayTarget = current + gap;
  const skillPts = scaleSkillGains(gap);
  const testDate = V1_Q5_DATE[q5] ?? 'test day';
  const showGainMath = shouldShowGainMath(q5);

  const [skillStep, setSkillStep] = useState(0);
  const [showCopy, setShowCopy] = useState(false);
  const [targetPulse, setTargetPulse] = useState(false);

  useEffect(() => {
    if (!showGainMath) {
      setShowCopy(true);
      return;
    }
    const reduced = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setSkillStep(5);
      setShowCopy(true);
      return;
    }
    const timers = [];
    let t = 400;
    for (let i = 0; i < 5; i++) {
      timers.push(setTimeout(() => setSkillStep(i + 1), t));
      t += V1_SKILL_DELAYS[i];
    }
    timers.push(setTimeout(() => setTargetPulse(true), t + 200));
    timers.push(setTimeout(() => setShowCopy(true), t + 500));
    return () => timers.forEach(clearTimeout);
  }, [showGainMath]);

  const CW = 340;
  const CH = 204;
  const PAD_X = 16;
  const PAD_TOP = 28;
  const PAD_BOTTOM = 52;
  const plotTop = PAD_TOP;
  const baselineY = CH - PAD_BOTTOM;
  const plotH = baselineY - plotTop;
  const chartW = CW - PAD_X * 2;
  const skillLabelY = baselineY + 16;

  const zoneWidths = skillPts.map(p => (p / gap) * chartW);
  let xCursor = PAD_X;
  const zones = skillPts.map((pts, i) => {
    const x = xCursor;
    const w = zoneWidths[i];
    xCursor += w;
    const scoreAtStart = current + skillPts.slice(0, i).reduce((a, b) => a + b, 0);
    const scoreAtEnd = scoreAtStart + pts;
    return { i, x, w, pts, scoreAtStart, scoreAtEnd };
  });

  const { py } = v1PlotScale(current, displayTarget, plotTop, plotH);
  const startX = PAD_X;
  const startY = py(current);
  const endX = PAD_X + chartW;
  const endY = py(displayTarget);
  const startLabelY = v1ScoreLabelY(startY, plotTop, baselineY, false);
  const endLabelY = v1ScoreLabelY(endY, plotTop, baselineY, true);

  const pathPoints = [{ x: startX, y: startY }];
  zones.forEach((z, idx) => {
    if (idx < skillStep) {
      pathPoints.push({ x: z.x + z.w, y: py(z.scoreAtEnd) });
    }
  });
  const pathD = pathPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const zoneFills = [
    'rgba(47,110,71,0.07)',
    'rgba(47,110,71,0.11)',
    'rgba(47,110,71,0.08)',
    'rgba(47,110,71,0.12)',
    'rgba(47,110,71,0.09)',
  ];
  const dividerXs = [PAD_X, ...zones.map(z => z.x + z.w)];

  const ptsLabelY = (y1, y2) => {
    const lineY = (y1 + y2) / 2;
    const above = lineY - 8;
    const below = lineY + 10;
    if (above >= plotTop + 4) return above;
    if (below <= baselineY - 18) return below;
    return Math.min(baselineY - 18, lineY + 6);
  };

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
            <h1 className="qf-h1" style={{ marginBottom: 4 }}>
              {hasDate ? (
                <>By <em>{testDate}</em>, they could reach about <em>{displayTarget}</em>.</>
              ) : (
                <>By test day, they could reach about <em>{displayTarget}</em>.</>
              )}
            </h1>
            {(!hasScore || !hasTarget) && (
              <p className="qf-lead" style={{ margin: 0, fontSize: 14, color: 'var(--qf-ink-mid)' }}>
                {!hasScore && !hasTarget
                  ? 'Illustrative path. The diagnostic and Strategy Call set real starting and target scores.'
                  : !hasScore
                    ? 'Illustrative starting point. The diagnostic sets the real baseline.'
                    : 'Target score gets confirmed on your Strategy Call.'}
              </p>
            )}

            <div className="qf-graph" style={{ padding: '14px 12px 10px' }}>
              <svg viewBox={`0 0 ${CW} ${CH}`} style={{ width: '100%', display: 'block', overflow: 'visible' }}>
                {dividerXs.map((x, i) => (
                  <line
                    key={`div-${i}`}
                    x1={x} y1={plotTop} x2={x} y2={baselineY}
                    stroke="rgba(20,32,46,0.14)" strokeWidth={i === 0 || i === dividerXs.length - 1 ? 1 : 0.75}
                    strokeDasharray={i === 0 || i === dividerXs.length - 1 ? undefined : '2 3'}
                  />
                ))}

                <line x1={PAD_X} y1={baselineY} x2={PAD_X + chartW} y2={baselineY} stroke="rgba(20,32,46,0.18)" strokeWidth="1" />

                {zones.map((z, idx) => {
                  const active = idx < skillStep;
                  const x1 = z.x;
                  const x2 = z.x + z.w;
                  const y1 = py(z.scoreAtStart);
                  const y2 = py(z.scoreAtEnd);
                  return (
                    <g key={`zone-${z.i}`} opacity={active ? 1 : 0} style={{ transition: 'opacity 0.45s ease' }}>
                      <path
                        d={`M ${x1} ${baselineY} L ${x1} ${y1} L ${x2} ${y2} L ${x2} ${baselineY} Z`}
                        fill={zoneFills[idx]}
                        stroke="rgba(47,110,71,0.14)"
                        strokeWidth="0.5"
                      />
                    </g>
                  );
                })}

                {pathD && skillStep > 0 && (
                  <path d={pathD} fill="none" stroke="#2F6E47" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                )}

                {zones.map((z, idx) => {
                  const active = idx < skillStep;
                  const x1 = z.x;
                  const x2 = z.x + z.w;
                  const y1 = py(z.scoreAtStart);
                  const y2 = py(z.scoreAtEnd);
                  const cx = idx === 0 ? x1 + z.w * 0.58 : (x1 + x2) / 2;
                  return (
                    <g key={`lbl-${z.i}`} opacity={active ? 1 : 0} style={{ transition: 'opacity 0.45s ease' }}>
                      {active && (
                        <text x={cx} y={ptsLabelY(y1, y2)} fontFamily="var(--qf-display)"
                          fontSize="12" fontWeight="600" fill="var(--qf-forest)" textAnchor="middle"
                          dominantBaseline="middle">
                          +{z.pts}
                        </text>
                      )}
                      <text x={cx} y={skillLabelY} fontFamily="var(--qf-body)" fontSize="12"
                        fill="var(--qf-ink-mid)" textAnchor="middle" fontWeight="600">
                        Skill {idx + 1}
                      </text>
                    </g>
                  );
                })}

                <circle cx={startX} cy={startY} r="3.5" fill="var(--qf-ink-2)" opacity={0.85} />
                {skillStep >= 5 && (
                  <circle cx={endX} cy={endY} r="3.5" fill="var(--qf-forest)" opacity={targetPulse ? 1 : 0.7} />
                )}

                <text
                  x={startX} y={startLabelY}
                  fontFamily="var(--qf-display)" fontSize="13" fontWeight="600"
                  fill="var(--qf-ink-2)" textAnchor="start"
                  dominantBaseline="middle"
                >
                  {current}
                </text>
                <text
                  x={endX} y={endLabelY}
                  fontFamily="var(--qf-display)" fontSize="13" fontWeight="600"
                  fill="var(--qf-forest)" textAnchor="end"
                  dominantBaseline="middle"
                  opacity={skillStep >= 5 ? (targetPulse ? 1 : 0.5) : 0}
                  style={{ transition: 'opacity 0.4s ease' }}
                >
                  {displayTarget}
                </text>
              </svg>
            </div>
          </>
        )}

        <div style={{
          opacity: showCopy ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}>
          <p className="qf-lead" style={{ margin: 0 }}>
            {v1EmotionalBridgeParts(displayTarget).map((part, i) =>
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
  'aug22': 'August 22', 'oct3': 'October 3', 'nov7': 'November 7', 'dec5': 'December 5',
};
const D_TEST_DATES = {
  'aug22': new Date('2026-08-22'), 'oct3': new Date('2026-10-03'),
  'nov7': new Date('2026-11-07'), 'dec5': new Date('2026-12-05'),
};

const PREP_WHY_FAILED = {
  'khan':    `Khan's SAT math course has ${KHAN_SAT_MATH_SKILL_COUNT} lessons and ${KHAN_SAT_YOUTUBE_VIDEO_COUNT} videos — without a diagnostic, it's a needle in a haystack. We rank the ${FOCUS_SKILL_COUNT}–6 that move their score.`,
  'group':   "Group classes pace to the middle of the room. Nobody built a plan for the few skills actually holding their score back.",
  'online':  "One syllabus for everyone. It doesn't find their weakest skills and rank them.",
  'app':     "SAT apps keep serving questions. They don't tell you which content skills to master first.",
  'book':    "Paper prep trains the wrong test. The digital SAT rewards Desmos and on-screen pacing, not flipping pages.",
  'nothing': "Without a diagnostic, students guess where to start and lose months on low-impact review.",
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

/** Full phrase tail for i-diag headline — reads naturally after "still scored" */
const Q4_SCORE_PHRASE = {
  u1000: 'under 1100',
  '1100-1200': 'in the low 1100s',
  '1200-1300': 'in the low 1200s',
  '1300-1400': 'in the mid-1300s',
  '1400plus': 'above 1400',
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
  const totalPts = skills.reduce((s, x) => s + x.pts, 0);
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

  const hasScore = q4 && q4 !== 'na' && Q4_SCORE_PHRASE[q4];
  const scorePhrase = Q4_SCORE_PHRASE[q4] ?? 'around 1100';
  const untilTest = formatWeeksUntilTest(weeks, dateMonth);

  return (
    <QFScreen stepIdx={9} onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>See what works</QFButton>}
    >
      <div className="gap-22" style={{ marginTop: 4 }}>
        <h1 className="qf-h1">
          {hasScore ? (
            <>Still scoring <em>{scorePhrase}</em>.</>
          ) : (
            <>Most students lose points on the <em>same few skills</em>.</>
          )}
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

          {/* Score callout — sum of all 5 */}
          {showGainMath && (
          <div style={{
            textAlign: 'center', marginTop: 6,
            opacity: revealed ? 1 : 0,
            transition: 'opacity 0.6s ease 0.7s',
          }}>
            <div style={{
              fontFamily: 'var(--qf-mono)', fontSize: 10,
              letterSpacing: '0.22em', color: 'var(--qf-ink-mute)',
              textTransform: 'uppercase',
            }}>
              Your fastest path
            </div>
            <div style={{
              fontFamily: 'var(--qf-display)', fontSize: 28,
              letterSpacing: '-0.02em', color: 'var(--qf-forest)',
              fontWeight: 500, marginTop: 2, lineHeight: 1,
            }}>
              <em>+{totalPts} points</em>
            </div>
          </div>
          )}

          <p className="qf-lead" style={{ margin: '18px 0 0' }}>
            {untilTest ? (
              <>
                To get their score up by the <em>{untilTest.monthName}</em> SAT, which is in just{' '}
                <em>{untilTest.weeks} {untilTest.unit}</em>, we need to start with a{' '}
                <em>diagnostic</em> to identify the <em>{FOCUS_SKILL_COUNT}–6 skills</em> worth the
                most points.
              </>
            ) : (
              <>
                To get their score up, we need to start with a <em>diagnostic</em> to identify the{' '}
                <em>{FOCUS_SKILL_COUNT}–6 skills</em> worth the most points.
              </>
            )}
          </p>
        </div>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <MethodLeadLine parts={methodLead} />
        <div style={{
          width: '100%', borderRadius: 14, overflow: 'hidden',
          background: 'var(--qf-paper)',
          border: '1px solid var(--qf-line)',
          boxShadow: '0 10px 30px rgba(20,32,46,0.10)',
        }}>
          <img
            src="/photos/tutor-student-session.png"
            alt="Sophia with her tutor and her personalized 12-week SAT plan"
            style={{
              width: '100%', height: 'auto', display: 'block', verticalAlign: 'top',
            }}
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
        We build your plan around the few skills most likely to raise their score fastest.
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
          }}>Diagnose</div>
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
          }}>Weekly 1:1 tutoring.</div>
        </div>
      </div>
    </QFScreen>
  );
}
