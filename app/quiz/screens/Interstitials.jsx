'use client'; // @ts-nocheck
import { useState, useEffect } from 'react';
import { funnelToday } from "@/lib/funnel-today";
import { QFScreen, QFButton, QFConstellation } from '../components/QFShell';
import { QFBarChart } from '../components/QFBarChart';
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
import { I_COMPARE_CTA, iCompareHeadlineMultiplier, iCompareProofBridgeLine } from '@/lib/quiz-funnel/i-compare-copy';
import { I_GAP_CTA, V1_CTA } from '@/lib/quiz-funnel/score-path-copy';
import {
  formatSatScoreLabel,
} from '@/lib/quiz-funnel/score-path-copy';
import { selectedDoubts, DOUBTS_INSIGHT_COPY } from '@/lib/quiz-funnel/doubts-copy';
import { buildGoalAchievability, buildTierRanges, GOAL_FEASIBILITY_TIER_LABELS, GOAL_FEASIBILITY_TIER_ORDER, tierFromPtsPerWeekScale, achievabilityOutcomesMeta } from '@/lib/quiz-funnel/goal-achievability';
import { buildScorePathOutput } from '@/lib/quiz-funnel/score-path-output';
import { selectedPrepLabels, formatEnglishList } from '@/lib/quiz-funnel/prep-copy';
import { AchievabilityPlanBlock } from '../components/AchievabilityRating';
import { QFScoreReportPair } from '../components/QFPlanVisuals';
import { Q5_TEST_DATES } from '@/lib/quiz-funnel/gains';
import { satFirstMonthOutcomes } from '@/lib/site';

export { gainTargetForQ5 };

// ─── I · Doubts mirror (echoes selected q-doubts, reframes what we uncover) ───
export function QFIDoubtsInsight({ onContinue, onBack, qDoubts = [] }) {
  const rows = selectedDoubts(qDoubts);
  const c = DOUBTS_INSIGHT_COPY;
  return (
    <QFScreen stepIdx={4} ornament="glow" onBack={onBack}
      actions={<QFButton kind="forest" onClick={onContinue}>{c.cta}</QFButton>}
    >
      <div className="gap-22" style={{ marginTop: 4 }}>
        <h1 className="qf-h1" style={{ marginBottom: 0 }}>{c.headline}</h1>
        <p className="qf-lead" style={{ margin: 0 }}>{c.subheadline}</p>
        <div className="qf-doubts-table">
          <div className="qf-doubts-table__header">
            <span className="qf-doubts-th qf-doubts-th--say">{c.sayingLabel}</span>
            <span className="qf-doubts-th qf-doubts-th--find">{c.uncoverLabel}</span>
          </div>
          {rows.map((row) => (
            <div key={row.id} className="qf-doubts-row">
              <div className="qf-doubts-cell qf-doubts-cell--say">{row.label}</div>
              <div className="qf-doubts-cell qf-doubts-cell--find">{row.uncover}</div>
            </div>
          ))}
        </div>
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
  'aug22': 'August 22, 2026', 'sept12': 'September 12, 2026', 'oct3': 'October 3, 2026',
  'nov7': 'November 7, 2026', 'dec5': 'December 5, 2026', 'tbd': 'TBD',
};
const CCHALLENGE_LABEL = {
  'math': 'Math', 'reading': 'Reading & writing', 'self-study': 'Self-study',
  'no-plan': 'No clear plan', 'wont': 'Staying consistent', 'too-busy': 'Limited time',
};
const CPREP_LABEL = {
  'khan': 'Khan / Bluebook', 'group': 'Group class', 'online': 'Online course',
  'app': 'SAT app', 'book': 'Prep book', 'nothing': 'Self-study',
};
const CGPA_LABEL = {
  'u3.0': 'Under 3.0', '3.0-3.3': '3.0–3.3', '3.3-3.5': '3.3–3.5',
  '3.5-3.7': '3.5–3.7', '3.7-3.9': '3.7–3.9', '4.0+': '4.0+',
};
const CGOAL_LABEL = {
  'merit': 'Merit scholarships', 'top-choice': 'Top-choice school',
  'selective': 'Selective colleges', 'app-rounds': 'Early application rounds',
  'early': 'Early application rounds',
};

function firstComputeLabel(arr, map) {
  const ids = Array.isArray(arr) ? arr : [];
  for (const id of ids) {
    if (map[id]) return map[id];
  }
  return null;
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

export function QFI2Compute({
  onContinue, onBack,
  q2 = 'top-choice', q4 = '1200-1300', q5 = 'oct3', q6 = ['math', 'no-plan'], q7 = [], q8 = '1400', q9, name,
}) {
  const displayName = name && String(name).trim() ? String(name).trim() : null;
  const possessive = displayName ? `${displayName}'s` : 'your';
  const hasQ4 = q4 && q4 !== 'na' && CQ4_BANDS[q4];
  const hasDate = q5 && q5 !== 'tbd' && q5 !== '2027' && CQ5_LONG[q5];
  const hasTarget = q8 && q8 !== 'tbd' && q8 !== 'na';
  const gpaLabel = q9 && CGPA_LABEL[q9];
  const goalLabel = CGOAL_LABEL[q2];

  // Build a flat reveal sequence: section headers + their rows
  const items = [];
  items.push({ type: 'header', label: 'Reviewing inputs', section: 1 });
  if (hasQ4) items.push({ type: 'row', content: <>Current score: <span className="v">{CQ4_BANDS[q4]}</span></> });
  else       items.push({ type: 'row', content: <>Current score: <span className="v">planning for first sit</span></> });
  if (hasTarget) items.push({ type: 'row', content: <>Target score: <span className="v">{q8}</span></> });
  if (hasDate) items.push({ type: 'row', content: <>Next test: <span className="v">{CQ5_LONG[q5]}</span></> });
  if (gpaLabel)  items.push({ type: 'row', content: <>GPA: <span className="v">{gpaLabel}</span></> });
  if (goalLabel) items.push({ type: 'row', content: <>Goal: <span className="v">{goalLabel}</span></> });

  items.push({ type: 'header', label: 'Comparing against similar students', section: 2 });
  items.push({ type: 'row', content: <>Students with <span className="v">similar starting scores</span></> });
  items.push({ type: 'row', content: <>Students with <span className="v">similar GPAs</span></> });
  items.push({ type: 'row', content: <>Students with <span className="v">similar timelines</span></> });

  items.push({ type: 'header', label: 'Generating score projection', section: 3 });
  items.push({ type: 'row', content: <>Calculating <span className="v">achievable score range</span></> });
  items.push({ type: 'row', content: <>Estimating <span className="v">weekly point targets</span></> });
  items.push({ type: 'row', content: <>Identifying <span className="v">highest-impact opportunities</span></> });

  const [revealed, setRevealed] = useState(0);
  const [barPct, setBarPct] = useState(0);
  const [showBar, setShowBar] = useState(false);
  const [showDone, setShowDone] = useState(false);

  // Stagger each item in sequence, then run the progress bar to 100%
  useEffect(() => {
    const timers = [];
    const FIRST_DELAY = 350;
    const STAGGER = 300;
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
          setShowDone(true);
        }
      }, 26);
      timers.push(inc);
    }, barDelay));
    return () => timers.forEach(t => {
      if (typeof t === 'number') clearTimeout(t);
      else clearInterval(t);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const barLabel = barPct < 40 ? 'ANALYZING INPUTS'
                 : barPct < 75 ? 'COMPARING COHORTS'
                 : showDone ? 'PLAN READY' : 'FINALIZING PROJECTION';

  return (
    <QFScreen stepIdx={14} tone="ink" onBack={onBack}
      actions={
        showDone ? (
          <QFButton kind="forest" onClick={onContinue}>Reveal {possessive} plan</QFButton>
        ) : (
          <QFButton kind="forest" disabled aria-busy="true">Building plan…</QFButton>
        )
      }
    >
      <svg className="qf-starfield" viewBox="0 0 360 700" preserveAspectRatio="xMidYMid slice">
        {STARS.map(([x, y, o, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={o} />
        ))}
      </svg>
      <div className="qf-aurora-band" />

      <div className="qf-compute">
        <div className="compute-eyebrow">Building {possessive} SAT plan</div>

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
      </div>
    </QFScreen>
  );
}

// ─── Hope screen (post-q5): enough time + first-month proof ──────────────────
export function QFIHopeScreen({ onContinue, onBack, q5 = 'oct3' }) {
  const date = Q5_TEST_DATES[q5];
  const days = date ? Math.round((date.getTime() - funnelToday().getTime()) / 86400000) : null;
  const o = satFirstMonthOutcomes;
  return (
    <QFScreen stepIdx={6} ornament="glow" onBack={onBack}
      actions={<QFButton kind="forest" onClick={onContinue}>Continue Building My Plan</QFButton>}
    >
      <div className="gap-22" style={{ marginTop: 4 }}>
        <h1 className="qf-h1" style={{ marginBottom: 0 }}>
          {days && days > 0 ? (
            <>You still have <em>{days} days</em> to get their score up.</>
          ) : (
            <>You still have time to get their score up.</>
          )}
        </h1>
        <div className="qf-stat-callout">
          <span className="qf-stat-callout__pct">{o.hit100PlusPct}%</span>
          <p className="qf-stat-callout__text">
            of students who follow their diagnostic-driven plan improve{' '}
            <strong>{o.minPointsFirstMonth}+ points</strong> in their <strong>first 30 days</strong>.
          </p>
        </div>
        <QFScoreReportPair caption={null} />
        <p
          className="qf-lead"
          style={{
            margin: 0,
            textAlign: 'center',
            color: 'var(--qf-forest)',
            fontWeight: 700,
            fontSize: 17,
            lineHeight: 1.45,
          }}
        >
          Ethan raised his SAT score by 230 points in 12 weeks following his personalized plan for 5–7 hours per week.
        </p>
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
      actions={<QFButton kind="forest" onClick={onContinue}>One more question</QFButton>}
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
      actions={<QFButton kind="forest" onClick={onContinue}>{I_GAP_CTA}</QFButton>}
    >
      <div className="gap-22" style={{ marginTop: 4 }}>
        <h1 className="qf-h1">
          Why smart kids score <em>low</em> on the SAT.
        </h1>

        <p className="qf-lead">
          It&apos;s common for smart students with high GPAs to score lower than expected on the SAT.
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
    <QFScreen stepIdx={9} onBack={onBack}
      actions={<QFButton kind="forest" onClick={onContinue}>{I_COMPARE_CTA}</QFButton>}
    >
      <div className="gap-22" style={{ marginTop: 4 }}>
        <h1 className="qf-h1" style={{ marginBottom: 0 }}>
          <em>Diagnostic-driven SAT plans</em> achieve <em>{multiplier}×</em> better results.
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

// ─── V1 · Plan reveal — the SAT Score Roadmap ────────────────────────────────
function RoadmapSection({ eyebrow, children }) {
  return (
    <div className="qf-roadmap-section">
      <div className="qf-roadmap-section__eyebrow">{eyebrow}</div>
      {children}
    </div>
  );
}

function planStruggledCopy(q7) {
  const ids = Array.isArray(q7) ? q7 : [];
  if (ids.includes('khan')) {
    return 'Khan Academy has over 475 pieces of SAT content, far too much to simply study. Your child likely barely scratched the surface.';
  }
  const labels = selectedPrepLabels(q7);
  if (labels.length) {
    return `${formatEnglishList(labels)} spread time across the whole SAT instead of the few skills actually holding their score back.`;
  }
  return 'Studying without a ranked plan spreads time across the whole SAT instead of the few skills actually holding their score back.';
}

function planDelayCost(skillPts, ptsPerWeek) {
  const pts = Array.isArray(skillPts) ? skillPts : [];
  const base = pts.length ? Math.max(...pts) : ptsPerWeek ? ptsPerWeek * 2 : 60;
  return Math.max(40, Math.ceil(base / 10) * 10);
}

export function QFV1Projection({ onContinue, onBack, answers = {} }) {
  const { q7 = [], kidName } = answers;
  const projection = buildV1Projection(answers);
  const assessment = buildGoalAchievability(answers);
  const path = buildScorePathOutput(answers);

  const displayName = kidName && String(kidName).trim() ? String(kidName).trim() : null;
  const possessive = displayName ? `${displayName}'s` : 'Your';
  const currentNum = projection.current;
  const goalNum = projection.goalTarget ?? projection.displayTarget;
  const goalScore = formatSatScoreLabel(goalNum);
  const weeks = projection.chartWeeks || 12;
  const dateShort = assessment.stats.testDateShort;
  const skillCount = Math.min(projection.skillCount || 6, 6);

  const tierWord = (GOAL_FEASIBILITY_TIER_LABELS[assessment.tier] || 'personalized').toLowerCase();
  const tierArticle = /^[aeiou]/.test(tierWord) ? 'an' : 'a';

  const band = path.gainBand;
  const hasBand = !!band && band.low > 0 && band.high > 0;
  // Reasonable range — never promote more than +260; keep a sensible low end (~180).
  const MAX_PROMO_GAIN = 260;
  const rangeHigh = hasBand ? Math.min(MAX_PROMO_GAIN, Math.round(band.high / 10) * 10) : 0;
  const rangeLow = hasBand ? Math.min(Math.round(band.low / 10) * 10, rangeHigh - 40) : 0;
  const delayCost = planDelayCost(projection.skillPts, assessment.stats.ptsPerWeek);

  const stakesLead = assessment.stakesLead;
  const stakesEm = assessment.stakesEmphasis;
  const stakesIdx = stakesEm && stakesLead.includes(stakesEm) ? stakesLead.indexOf(stakesEm) : -1;

  // Reveal the locked skill rows one at a time.
  const [revealed, setRevealed] = useState(0);
  useEffect(() => {
    const reduced = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers = [];
    if (reduced) {
      timers.push(setTimeout(() => setRevealed(skillCount), 0));
    } else {
      for (let i = 0; i < skillCount; i++) {
        timers.push(setTimeout(() => setRevealed(i + 1), 450 + i * 300));
      }
    }
    return () => timers.forEach(clearTimeout);
  }, [skillCount]);

  return (
    <QFScreen stepIdx={15} ornament="glow" onBack={onBack}
      actions={<QFButton kind="forest" onClick={onContinue}>{V1_CTA}</QFButton>}
    >
      <div className="gap-22">
        {/* Plan — one container so it reads as a real plan */}
        <div className="qf-example-plan">
          <div className="qf-example-plan__head">
            <span className="qf-example-plan__eyebrow">Personalized SAT plan</span>
            {dateShort ? <span className="qf-example-plan__weeks">{weeks} weeks to {dateShort}</span> : null}
          </div>
          <div className="qf-example-plan__name">{possessive} SAT Plan</div>

          <QFPlanChart current={currentNum} projected={goalNum} skillCount={skillCount} totalDays={weeks * 7} />

          <AchievabilityPlanBlock
            stats={assessment.stats}
            startingScoreLabel={assessment.startingScoreLabel}
            startingScoreNote={assessment.startingScoreNote}
            tierIndex={assessment.tierIndex}
            tierRanges={assessment.tierRanges}
            educational
            outcomesMeta={assessment.outcomesMeta}
            projectedRangeLine={assessment.projectedRangeLine}
          />

          <div className="qf-example-plan__skills-head">Skills to identify</div>
          <div className="qf-example-plan__skills">
            {Array.from({ length: skillCount }, (_, i) => {
              const shown = i < revealed;
              return (
                <div key={i} className="qf-example-plan__skill" style={{
                  opacity: shown ? 1 : 0,
                  transform: shown ? 'translateY(0)' : 'translateY(6px)',
                  transition: 'opacity 0.35s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}>
                  <span className="qf-example-plan__skill-rank">Skill {i + 1}</span>
                  <span className="qf-example-plan__skill-name">Highest-impact skill</span>
                  <span className="qf-example-plan__skill-pts">TBD</span>
                </div>
              );
            })}
          </div>
          <p className="qf-caption" style={{ textAlign: 'center', margin: 0 }}>Found through the Skill Diagnostic.</p>
        </div>

        {/* Narrative — plan → why a call + diagnostic is the next step */}
        <RoadmapSection eyebrow="Why they struggled last test">
          <p className="qf-lead" style={{ margin: 0 }}>{planStruggledCopy(q7)}</p>
        </RoadmapSection>

        <RoadmapSection eyebrow="What to do differently this time">
          <p className="qf-lead" style={{ margin: 0 }}>
            Start with the Skill Diagnostic to rank the <em>{FOCUS_SKILL_COUNT}–6 skills</em> worth the most points, then work those first.
          </p>
        </RoadmapSection>

        <RoadmapSection eyebrow={dateShort ? `What score is reasonable by ${dateShort}` : 'What score is reasonable'}>
          <p className="qf-lead" style={{ margin: 0 }}>
            We built {tierArticle} <em>{tierWord}</em> plan toward your <em>{goalScore}</em> target.{' '}
            {hasBand ? (
              <>Students with a similar start and {weeks}-week timeline typically improve <em>+{rangeLow}&ndash;+{rangeHigh}</em>, and a Skill Diagnostic plus starting within 7 days makes the upper end realistic.</>
            ) : (
              <>A Skill Diagnostic plus starting within 7 days sets a realistic improvement range for their timeline.</>
            )}
          </p>
        </RoadmapSection>

        <RoadmapSection eyebrow="How much effort it takes">
          <p className="qf-lead" style={{ margin: 0 }}>~5&ndash;7 hours per week of mistake-driven practice on their weakest skills.</p>
        </RoadmapSection>

        <RoadmapSection eyebrow="Biggest risk to the plan">
          <p className="qf-lead" style={{ margin: 0 }}>
            <em>Delay.</em> Putting this off 2 weeks could cost up to <em>{delayCost} points</em>. The early weeks target the highest-impact skills, so starting now has outsized rewards.
          </p>
        </RoadmapSection>

        <RoadmapSection eyebrow="What's on the line">
          <p className="qf-lead" style={{ margin: 0 }}>
            {stakesIdx >= 0 ? (
              <>
                {stakesLead.slice(0, stakesIdx)}
                <em>{stakesEm}</em>
                {stakesLead.slice(stakesIdx + stakesEm.length)}
              </>
            ) : (
              stakesLead
            )}
          </p>
        </RoadmapSection>

        <RoadmapSection eyebrow="How to get started">
          <p className="qf-lead" style={{ margin: 0 }}>
            Schedule a call so we can get started diagnosing your child&apos;s <em>{FOCUS_SKILL_COUNT}&ndash;6 highest-impact skills</em> to finalize their plan.
          </p>
        </RoadmapSection>
      </div>
    </QFScreen>
  );
}

// ─── I · Diagnosis (content skills, no tricks) ───────────────────────────────
const D_TEST_DATE_SHORT = {
  'aug22': 'August 22', 'sept12': 'September 12', 'oct3': 'October 3', 'nov7': 'November 7',
  'dec5': 'December 5',
};
const D_TEST_DATE_ORDINAL = {
  'aug22': 'August 22nd', 'sept12': 'September 12th', 'oct3': 'October 3rd', 'nov7': 'November 7th',
  'dec5': 'December 5th',
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
    <QFScreen stepIdx={8} onBack={onBack}
      actions={<QFButton kind="forest" onClick={onContinue}>See the results</QFButton>}
    >
      <div className="gap-22" style={{ marginTop: 4 }}>
        <h1 className="qf-h1" style={{ marginBottom: 0 }}>
          Instead of trying to learn every SAT skill, they need a Diagnostic that identifies the{' '}
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
          Some skills are worth far more points than others, a diagnostic reveals the fastest path{' '}
          {hasScore ? (
            <>from <em>{breakOutBand}</em> to the highest score possible</>
          ) : (
            <>to the highest score possible</>
          )}
          {untilTest ? (
            <>
              {' '}
              before the <em>{D_TEST_DATE_ORDINAL[q5]}</em> SAT.
            </>
          ) : (
            '.'
          )}
        </p>
      </div>
    </QFScreen>
  );
}

// ─── I · Steps (early preview: example of the plan we build by the end) ──────
const EXAMPLE_PLAN_SKILLS = [
  { name: 'Linear equations & systems', pts: 54 },
  { name: 'Problem solving & data analysis', pts: 46 },
  { name: 'Standard English conventions', pts: 36 },
  { name: 'Calculator pacing & timing', pts: 32 },
  { name: 'Command of evidence', pts: 28 },
  { name: 'Words in context', pts: 24 },
];
const EXAMPLE_PLAN_STATS = {
  scoreGap: 220, testDateShort: 'Oct 4', daysToTest: 122, ptsPerWeek: 15, hasKnownGoal: true,
};

const MONO_FONT = 'DM Mono, ui-monospace, monospace';
const DISPLAY_FONT = "var(--qf-display), 'Source Serif 4', Georgia, serif";

/** Static projection chart (days + skills + curve, no animation). Defaults = the Sophia example. */
function QFPlanChart({ current = 1180, projected = 1400, skillCount = 6, totalDays = 105 }) {
  const line = 'M14,150 C72,148 116,104 180,84 C242,66 296,54 320,50';
  const area = `${line} L320,162 L14,162 Z`;
  const count = Math.min(Math.max(skillCount || 6, 5), 6);
  const td = totalDays > 0 ? totalDays : 105;
  const dayNums = [...new Set(
    [0.2, 0.4, 0.6, 0.8].map((f) => Math.round((td * f) / 5) * 5)
  )].filter((d) => d > 0 && d < td);
  const days = dayNums.map((n) => ({ x: 14 + (n / td) * 306, n }));
  const skills = Array.from({ length: count }, (_, i) => ({
    x: 14 + (306 * (i + 0.5)) / count,
    n: i + 1,
  }));
  return (
    <svg viewBox="0 0 340 190" className="qf-ex-chart" role="img" aria-label={`Projected score from ${current} to ${projected}`}>
      <defs>
        <linearGradient id="qf-ex-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2F6E47" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#2F6E47" stopOpacity="0" />
        </linearGradient>
      </defs>

      {days.map((d) => (
        <g key={d.n}>
          <text x={d.x} y={9} textAnchor="middle" fontFamily={MONO_FONT} fontSize="8" fill="#8A94A6" letterSpacing="1">DAY</text>
          <text x={d.x} y={22} textAnchor="middle" fontFamily={DISPLAY_FONT} fontSize="13" fontWeight="700" fill="#121A2B">{d.n}</text>
          <line x1={d.x} x2={d.x} y1={28} y2={162} stroke="rgba(20,32,46,0.10)" strokeWidth="1" strokeDasharray="3 4" />
        </g>
      ))}

      <text x={326} y={30} textAnchor="end" fontFamily={DISPLAY_FONT} fontSize="16" fontWeight="700" fill="#2F6E47">{projected}</text>
      <text x={326} y={41} textAnchor="end" fontFamily={MONO_FONT} fontSize="8" fill="#8A94A6" letterSpacing="1">PROJECTED</text>

      <path d={area} fill="url(#qf-ex-fill)" />
      <path d={line} fill="none" stroke="#2F6E47" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      <circle cx={14} cy={150} r={5} fill="#121A2B" />
      <circle cx={320} cy={50} r={6} fill="#2F6E47" stroke="#fff" strokeWidth="2" />

      <text x={6} y={132} fontFamily={DISPLAY_FONT} fontSize="16" fontWeight="700" fill="#5B6472">{current}</text>
      <text x={6} y={143} fontFamily={MONO_FONT} fontSize="8" fill="#8A94A6" letterSpacing="1">STARTING</text>

      {skills.map((s) => (
        <text key={s.n} x={s.x} y={181} textAnchor="middle" fontFamily={MONO_FONT} fontSize="8" fill="#8A94A6" letterSpacing="0.5">SKILL {s.n}</text>
      ))}
    </svg>
  );
}

function QFExamplePlanCard() {
  const exampleWeeks = 15;
  const exampleStart = 1180;
  const exampleTarget = 1400;
  const exampleTier = tierFromPtsPerWeekScale(exampleStart, exampleTarget, exampleWeeks);
  const exampleTierIndex = GOAL_FEASIBILITY_TIER_ORDER.indexOf(exampleTier);
  const tierRanges = buildTierRanges(exampleWeeks, exampleStart);
  const total = EXAMPLE_PLAN_SKILLS.reduce((a, s) => a + s.pts, 0);
  return (
    <div className="qf-example-plan">
      <div className="qf-example-plan__head">
        <span className="qf-example-plan__eyebrow">Personalized SAT plan</span>
        <span className="qf-example-plan__weeks">15 weeks to Oct 4</span>
      </div>
      <div className="qf-example-plan__name">Sophia L.</div>

      <QFPlanChart current={exampleStart} projected={exampleTarget} totalDays={exampleWeeks * 7} />

      <AchievabilityPlanBlock
        stats={EXAMPLE_PLAN_STATS}
        startingScoreLabel={String(exampleStart)}
        tierIndex={exampleTierIndex}
        tierRanges={tierRanges}
        educational={false}
        outcomesMeta={achievabilityOutcomesMeta()}
      />

      <div className="qf-example-plan__skills-head">Sophia&apos;s highest-impact skills</div>
      <div className="qf-example-plan__skills">
        {EXAMPLE_PLAN_SKILLS.map((s, i) => (
          <div key={s.name} className="qf-example-plan__skill">
            <span className="qf-example-plan__skill-rank">Skill {i + 1}</span>
            <span className="qf-example-plan__skill-name">{s.name}</span>
            <span className="qf-example-plan__skill-pts">+{s.pts}</span>
          </div>
        ))}
      </div>
      <div className="qf-example-plan__total">
        <span className="qf-example-plan__total-label">Total points</span>
        <span className="qf-example-plan__total-pts">+{total}</span>
      </div>
      <div className="qf-example-plan__footer">
        <span>6 days/wk</span>
        <span>~1 hr/day</span>
      </div>
    </div>
  );
}

export function QFISteps({ onContinue, onBack }) {
  return (
    <QFScreen stepIdx={4} onBack={onBack}
      actions={<QFButton kind="forest" onClick={onContinue}>Build their plan</QFButton>}
    >
      <div className="gap-22">
        <h1 className="qf-h1" style={{ marginBottom: 0 }}>
          By the end of this, we&apos;ll build a SAT plan like Sophia&apos;s.
        </h1>
        <QFExamplePlanCard />
      </div>
    </QFScreen>
  );
}
