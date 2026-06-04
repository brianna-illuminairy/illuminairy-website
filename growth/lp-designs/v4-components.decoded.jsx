// lp-components-v3.jsx — sections for SAT Landing v3.
// Loaded after lp-data-v3.jsx. Attaches components to window for the inline App.

const { useState, useEffect, useRef } = React;

function Rich({ parts }) {
  return parts.map((p, i) => {
    if (typeof p === 'string') return <React.Fragment key={i}>{p}</React.Fragment>;
    if (p.em) return <em key={i}>{p.em}</em>;
    if (p.br) return <br key={i} />;
    if (p.line) return <span key={i} className="line"><Rich parts={p.line} /></span>;
    return null;
  });
}
const Stars = ({ n = 5 }) => <span className="stars" aria-label={`${n} out of 5 stars`}>{'★'.repeat(n)}</span>;

// Achievability meter
function AchievabilityMeter({ a }) {
  const levels = ['Effortless', 'Realistic', 'Ambitious', 'Aggressive', 'Extreme'];
  return (
    <div className="lp-ach">
      <div className="lp-ach-title">Goal Score Achievability Rating</div>
      <div className="lp-ach-bar" role="img" aria-label={`Rating: ${a.level}`}>
        {levels.map((lv, i) => (
          <span key={i} className={'seg' + (i === a.idx ? ' on' : i < a.idx ? ' pre' : '')}>{lv}</span>
        ))}
      </div>
    </div>
  );
}

// Compact score-projection area chart
function ProjectionChart({ current, target }) {
  const uid = React.useMemo(() => 'pg' + Math.random().toString(36).slice(2, 7), []);
  const dividers = [50, 100, 150, 200, 250];
  return (
    <div className="lp-proj">
      <div className="lp-proj-plot">
        <svg className="lp-proj-svg" viewBox="0 0 300 120" preserveAspectRatio="none" style={{ overflow: 'visible' }} role="img"
          aria-label={`Projected score trending up from ${current} toward ${target}, divided into 6 skill bands`}>
          <defs>
            <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(47,110,71,0.28)" />
              <stop offset="100%" stopColor="rgba(47,110,71,0.02)" />
            </linearGradient>
          </defs>
          {dividers.map((x) => (
            <line key={x} x1={x} y1="24" x2={x} y2="96" stroke="rgba(18,26,43,0.12)" strokeDasharray="2 3" />
          ))}
          <path d="M0 90 C20 84 35 78 50 73 C68 67 82 63 100 58 C120 53 135 50 150 47 C170 43 185 40 200 37 C220 34 235 30 250 28 C270 25 285 22 300 20 L300 116 L0 116 Z" fill={`url(#${uid})`} />
          <path d="M0 90 C20 84 35 78 50 73 C68 67 82 63 100 58 C120 53 135 50 150 47 C170 43 185 40 200 37 C220 34 235 30 250 28 C270 25 285 22 300 20" fill="none" stroke="var(--em)" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="0" cy="90" r="3.5" fill="var(--fg-mute)" />
          <circle cx="300" cy="20" r="4.5" fill="var(--em)" stroke="#fff" strokeWidth="2" />
        </svg>
        <div className="lp-proj-bands" aria-hidden="true">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <span key={n}>Skill&nbsp;{n}</span>
          ))}
        </div>
        <div className="lp-proj-days" aria-hidden="true">
          {[20, 40, 60, 80].map((d, i) => (
            <span key={d} style={{ left: `${((i + 1) * 100) / 6}%` }}>
              <span className="lbl">Day</span>
              <span className="num">{d}</span>
            </span>
          ))}
        </div>
        <span className="lp-proj-start"><b>{current}</b>Starting</span>
        <span className="lp-proj-end"><b>{target}</b>Projected</span>
      </div>
    </div>
  );
}

function MetricGrid({ p }) {
  const daysToTest = React.useMemo(() => {
    const d = Math.round((new Date(p.testDateISO + 'T00:00:00') - new Date()) / 86400000);
    return d > 0 ? d : null;
  }, [p.testDateISO]);
  const ptsWeek = Math.round(p.gain / p.weeks);
  return (
    <div className="lp-plan-metrics">
      <div className="m"><span className="v hot">+{p.gain}</span><span className="k">Score gap</span></div>
      <div className="m"><span className="v">{p.testDate}</span><span className="k">Test date</span></div>
      <div className="m"><span className="v hot">{daysToTest != null ? daysToTest : '—'}</span><span className="k">Days to test</span></div>
      <div className="m"><span className="v">+{ptsWeek}</span><span className="k">Pts/wk</span></div>
    </div>
  );
}

// ── Header ──
function Header() {
  return (
    <div className="lp-chrome">
      <div className="lp-container lp-topbar">
        <div className="lp-wordmark">Illuminairy</div>
      </div>
    </div>
  );
}

// ── Hero proof figure (desktop right rail only) ──
function ScoreBoard({ s }) {
  return (
    <div className="lp-scoreboard">
      <div className="lp-score-person">
        <span className="lp-score-name">{s.nm}</span>
        <span className="lp-score-hs">{s.hs}</span>
      </div>
      <div className="lp-score-rows">
        <div className="lp-score-row">
          <span className="lp-score-row-label">Reading &amp; Writing</span>
          <span className="lp-score-move"><span className="lp-score-before">{s.rw[0]}</span><span className="lp-score-arrow">→</span><span className="lp-score-after">{s.rw[1]}</span></span>
        </div>
        <div className="lp-score-row">
          <span className="lp-score-row-label">Math</span>
          <span className="lp-score-move"><span className="lp-score-before">{s.m[0]}</span><span className="lp-score-arrow">→</span><span className="lp-score-after">{s.m[1]}</span></span>
        </div>
      </div>
      <div className="lp-score-total">
        <span className="lp-score-row-label">Total score</span>
        <span className="lp-score-total-move"><span className="lp-score-before">{s.tot[0]}</span><span className="lp-score-arrow">→</span><span className="lp-score-after">{s.tot[1]}</span><span className="lp-score-gain">+{s.tot[1]-s.tot[0]}</span></span>
      </div>
    </div>
  );
}

function Gauge({ current = 1180, target = 1400 }) {
  const min = 800, max = 1600, span = max - min;
  const pct = (v) => ((v - min) / span) * 100;
  return (
    <div className="lp-gauge">
      <div className="lp-gauge-scale">
        <div className="lp-gauge-fill" style={{ width: `${pct(target)}%` }} />
        <div className="lp-gauge-mark" style={{ left: `${pct(current)}%` }}><span className="tag"><small>Now</small>{current}</span></div>
        <div className="lp-gauge-mark target" style={{ left: `${pct(target)}%` }}><span className="tag"><small>Target</small>{target}</span></div>
      </div>
      <div className="lp-gauge-axis"><span>800</span><span>1600</span></div>
      <div className="lp-gauge-readout">
        <span className="big">+{target - current}</span>
        <span className="lbl">points to reach their<br />target-college range</span>
      </div>
    </div>
  );
}

function HeroFigure({ dir, featured, railVisual }) {
  const mode = railVisual && railVisual !== 'auto' ? railVisual : (dir.visual === 'gauge' ? 'gauge' : (dir.visual === 'score' ? 'score' : 'plan'));

  if (mode === 'plan') {
    const p = SAMPLE_PLAN;
    const firstName = p.name.split(' ')[0];
    return (
      <figure className="lp-plan" style={{ margin: 0 }}>
        <div className="lp-plan-topline">
          <span>Personalized SAT Plan</span>
          <span className="meta">{p.weeks} weeks to {p.testDate}</span>
        </div>
        <div className="lp-plan-head">
          <span className="lp-plan-name">{p.name}</span>
        </div>
        <ProjectionChart current={p.current} target={p.target} />
        <MetricGrid p={p} />
        <AchievabilityMeter a={p.achievability} />
        <div className="lp-plan-skills">
          <div className="lp-plan-skills-head">
            <span>{firstName}'s highest-impact skills</span>
          </div>
          {p.skills.map((s, i) => (
            <div className="lp-plan-skill" key={i}>
              <span className="rank">Skill&nbsp;{i + 1}</span>
              <span className="nm">{s.name}</span>
              <span className="pts">+{s.gain}</span>
            </div>
          ))}
          <div className="lp-plan-total">
            <span className="lbl">Total points</span>
            <span className="pts">+{p.gain}</span>
          </div>
        </div>
        <div className="lp-plan-foot">
          <span>{p.daysWeek}</span>
          <span>{p.perDay}</span>
        </div>
      </figure>
    );
  }

  if (mode === 'gauge') {
    return (
      <figure className="lp-herofig" style={{ margin: 0 }}>
        <div className="lp-herofig-head">
          <span className="lp-herofig-eyebrow">Where they stand today</span>
          <span className="lp-badge">Target: UVA range</span>
        </div>
        <Gauge current={1180} target={1400} />
        <p className="lp-herofig-quote">{featured.quote}<span className="by"><Stars n={5} /> &nbsp;{featured.by}</span></p>
      </figure>
    );
  }

  return (
    <figure className="lp-herofig" style={{ margin: 0 }}>
      <div className="lp-herofig-head">
        <span className="lp-herofig-eyebrow">Verified outcome</span>
        <span className="lp-badge">{featured.col}</span>
      </div>
      <ScoreBoard s={featured} />
      <p className="lp-herofig-quote">{featured.quote}<span className="by"><Stars n={5} /> &nbsp;{featured.by}</span></p>
    </figure>
  );
}

// ── Combined CTA card (navy) — bullets + button + subtext ──
function CTACard({ dir, t }) {
  return (
    <div className="lp-cta-card">
      <p className="lp-cta-intro">Your free SAT plan shows:</p>
      <ul className="lp-cta-value">
        {VALUE.map((v, i) => <li key={i}><span className="check">✓</span>{v}</li>)}
      </ul>
      <a className="lp-btn" href="#start" onClick={(e)=>e.preventDefault()}>
        {(t && t.buttonCopy) || dir.button} <span className="arrow">→</span>
      </a>
      <p className="lp-cta-sub">{dir.fineprint}</p>
    </div>
  );
}

// ── Hero ──
function Hero({ dir, t }) {
  return (
    <section className="lp-hero">
      <div className="lp-container lp-hero-single">
        <h1 className="lp-h1"><Rich parts={dir.h1} /></h1>
        <p className="lp-authority-line">
          <span className="bars" aria-hidden="true"><i></i><i></i><i></i></span>
          {AUTHORITY.big}
        </p>
        <CTACard dir={dir} t={t} />
      </div>
    </section>
  );
}

// ── How it works ──
function HowItWorks() {
  return (
    <section className="lp-how">
      <div className="lp-container">
        <h2 className="lp-how-title">Here's exactly what happens next</h2>
        <div className="lp-steps">
          {STEPS.map((s) => (
            <div className="lp-step" key={s.n}>
              <span className="num">{s.n}</span>
              <div>
                <p className="t">{s.t}</p>
                <p className="d">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Parent reviews ──
function Reviews() {
  return (
    <section className="lp-section">
      <div className="lp-container">
        <p className="lp-section-eyebrow">What parents say</p>
        <div className="lp-reviews">
          {REVIEWS.map((r, i) => (
            <div className="lp-review" key={i}>
              <Stars n={r.stars} />
              <p className="quote">{r.quote}</p>
              <div className="who">
                <span className="ava">{r.initials}</span>
                <span><span className="name">{r.name}</span><br/><span className="meta">{r.meta}</span></span>
              </div>
            </div>
          ))}
        </div>
        <p className="lp-proof-disclaimer">{PROGRAM_DISCLAIMER}</p>
      </div>
    </section>
  );
}

// ── Final CTA ──
function FinalCTA({ dir, t }) {
  return (
    <section className="lp-final" id="start">
      <div className="lp-container">
        <p className="lp-final-eyebrow">Free SAT plan</p>
        <h2><Rich parts={dir.finalH2} /></h2>
        <p>{dir.finalP}</p>
        <a className="lp-btn" href="#" onClick={(e)=>e.preventDefault()}>{(t && t.buttonCopy) || dir.button} <span className="arrow">→</span></a>
        <p className="lp-fineprint"><span>No credit card</span><span className="sep">·</span><span>no spam</span><span className="sep">·</span><span>just the plan</span></p>
      </div>
    </section>
  );
}

// ── Trust bar (static band before the footer) ──
function TrustBar() {
  return (
    <section className="lp-trust" aria-label="Trust">
      <div className="lp-container">
        <div className="lp-trust-grid">
          <div className="lp-trust-cell">
            <span className="lp-trust-num em">+182<span className="unit">avg pts</span></span>
            <span className="lp-trust-lbl">After Following a 12-Week Plan</span>
          </div>
          <div className="lp-trust-cell">
            <span className="lp-trust-num">500+</span>
            <span className="lp-trust-lbl">Families<br/>helped</span>
          </div>
          <div className="lp-trust-cell">
            <span className="lp-trust-num em">4.8<span className="star">★</span></span>
            <span className="lp-trust-lbl">Avg parent<br/>rating</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <ul className="links">
          <li><a href="#" onClick={(e)=>e.preventDefault()}>Privacy</a></li>
          <li><a href="#" onClick={(e)=>e.preventDefault()}>Terms</a></li>
        </ul>
        <p className="legal">Illuminairy is an independent test-prep service and is not affiliated with or endorsed by the College Board, which administers the SAT. SAT is a trademark of the College Board. Score improvements reflect students who completed our program; individual results vary.</p>
        <p className="copy">© 2026 Illuminairy. All rights reserved.</p>
      </div>
    </footer>
  );
}

Object.assign(window, {
  Rich, Stars, Header, Hero, HeroFigure, CTACard, ScoreBoard, Gauge,
  HowItWorks, Reviews, FinalCTA, TrustBar, Footer,
});
