/** SVG/CSS visuals for Soha diagnostic — supplement copy, do not replace it. */

function pct(min: number, max: number, value: number) {
  return ((value - min) / (max - min)) * 100;
}

export function ScoreOverviewCards() {
  return (
    <div className="soha-diag__scores" aria-hidden="true">
      <div className="soha-diag__score soha-diag__score--total">
        <span className="soha-diag__score-label">Total score</span>
        <span className="soha-diag__score-value">1380–1430</span>
        <span className="soha-diag__score-detail">of 1600</span>
      </div>
      <div className="soha-diag__score">
        <span className="soha-diag__score-label">Reading and Writing</span>
        <span className="soha-diag__score-value">670–690</span>
        <span className="soha-diag__score-detail">M1 25/27 · M2 22/27</span>
      </div>
      <div className="soha-diag__score">
        <span className="soha-diag__score-label">Math</span>
        <span className="soha-diag__score-value">710–740</span>
        <span className="soha-diag__score-detail">M1 21/22 · M2 17/22</span>
      </div>
    </div>
  );
}

export function TotalScoreScale() {
  const low = pct(800, 1600, 1380);
  const high = pct(800, 1600, 1430);
  const width = high - low;
  const mid = low + width / 2;

  return (
    <figure className="soha-viz soha-viz--total-scale">
      <figcaption className="soha-viz__caption">Estimated total score range on the 1600 scale</figcaption>
      <div className="soha-viz__scale-track">
        <div
          className="soha-viz__scale-band soha-viz__scale-band--total"
          style={{ left: `${low}%`, width: `${width}%` }}
        />
        <div className="soha-viz__scale-dot" style={{ left: `${mid}%` }} />
      </div>
      <div className="soha-viz__scale-ticks">
        <span>800</span>
        <span>1200</span>
        <span>1600</span>
      </div>
    </figure>
  );
}

export function SectionScoreCompare() {
  const rwLow = pct(200, 800, 670);
  const rwW = pct(200, 800, 690) - rwLow;
  const mLow = pct(200, 800, 710);
  const mW = pct(200, 800, 740) - mLow;

  return (
    <figure className="soha-viz soha-viz--section-compare">
      <figcaption className="soha-viz__caption">Section score ranges (200–800 each)</figcaption>
      <div className="soha-viz__compare-row">
        <span className="soha-viz__compare-label">R&amp;W</span>
        <div className="soha-viz__scale-track soha-viz__scale-track--section">
          <div
            className="soha-viz__scale-band soha-viz__scale-band--rw"
            style={{ left: `${rwLow}%`, width: `${rwW}%` }}
          />
        </div>
        <span className="soha-viz__compare-val">670–690</span>
      </div>
      <div className="soha-viz__compare-row">
        <span className="soha-viz__compare-label">Math</span>
        <div className="soha-viz__scale-track soha-viz__scale-track--section">
          <div
            className="soha-viz__scale-band soha-viz__scale-band--math"
            style={{ left: `${mLow}%`, width: `${mW}%` }}
          />
        </div>
        <span className="soha-viz__compare-val">710–740</span>
      </div>
    </figure>
  );
}

type AccRow = { label: string; easy: number; medium: number; hard: number };

function AccuracyRow({ label, easy, medium, hard }: AccRow) {
  return (
    <div className="soha-viz__acc-row">
      <div className="soha-viz__acc-label">{label}</div>
      <div className="soha-viz__acc-bars">
        <div className="soha-viz__acc-bar-wrap">
          <span className="soha-viz__acc-bar-label">Easy</span>
          <div className="soha-viz__acc-bar-track">
            <div className="soha-viz__acc-bar soha-viz__acc-bar--easy" style={{ width: `${easy}%` }} />
          </div>
          <span className="soha-viz__acc-pct">{easy}%</span>
        </div>
        <div className="soha-viz__acc-bar-wrap">
          <span className="soha-viz__acc-bar-label">Med</span>
          <div className="soha-viz__acc-bar-track">
            <div className="soha-viz__acc-bar soha-viz__acc-bar--medium" style={{ width: `${medium}%` }} />
          </div>
          <span className="soha-viz__acc-pct">{medium}%</span>
        </div>
        <div className="soha-viz__acc-bar-wrap">
          <span className="soha-viz__acc-bar-label">Hard</span>
          <div className="soha-viz__acc-bar-track">
            <div className="soha-viz__acc-bar soha-viz__acc-bar--hard" style={{ width: `${hard}%` }} />
          </div>
          <span className="soha-viz__acc-pct">{hard}%</span>
        </div>
      </div>
    </div>
  );
}

export function AccuracyByDifficulty() {
  return (
    <figure className="soha-viz soha-viz--accuracy">
      <figcaption className="soha-viz__caption">Accuracy by difficulty</figcaption>
      <AccuracyRow label="Reading and Writing · 47/54" easy={88} medium={87} hard={87} />
      <AccuracyRow label="Math · 38/44" easy={100} medium={88} hard={73} />
    </figure>
  );
}

export function RwMissBreakdown() {
  return (
    <figure className="soha-viz soha-viz--miss-breakdown">
      <figcaption className="soha-viz__caption">7 Reading and Writing misses</figcaption>
      <div className="soha-viz__mini-grid">
        <div className="soha-viz__mini-card">
          <span className="soha-viz__mini-title">By skill</span>
          <div className="soha-viz__stack-bar" aria-hidden="true">
            <div className="soha-viz__stack-seg soha-viz__stack-seg--conv" style={{ width: "42.9%" }} title="Conventions 3" />
            <div className="soha-viz__stack-seg soha-viz__stack-seg--trans" style={{ width: "28.6%" }} title="Transitions 2" />
            <div className="soha-viz__stack-seg soha-viz__stack-seg--coe" style={{ width: "28.6%" }} title="COE 2" />
          </div>
          <ul className="soha-viz__legend">
            <li><span className="soha-viz__dot soha-viz__dot--conv" /> Conventions 3</li>
            <li><span className="soha-viz__dot soha-viz__dot--trans" /> Transitions 2</li>
            <li><span className="soha-viz__dot soha-viz__dot--coe" /> Command of Evidence 2</li>
          </ul>
        </div>
        <div className="soha-viz__mini-card">
          <span className="soha-viz__mini-title">By difficulty</span>
          <div className="soha-viz__stack-bar" aria-hidden="true">
            <div className="soha-viz__stack-seg soha-viz__stack-seg--easy" style={{ width: "14.3%" }} />
            <div className="soha-viz__stack-seg soha-viz__stack-seg--medium" style={{ width: "42.9%" }} />
            <div className="soha-viz__stack-seg soha-viz__stack-seg--hard" style={{ width: "42.9%" }} />
          </div>
          <ul className="soha-viz__legend">
            <li><span className="soha-viz__dot soha-viz__dot--easy" /> Easy 1</li>
            <li><span className="soha-viz__dot soha-viz__dot--medium" /> Medium 3</li>
            <li><span className="soha-viz__dot soha-viz__dot--hard" /> Hard 3</li>
          </ul>
        </div>
      </div>
    </figure>
  );
}

export function ScoringModelCompare() {
  return (
    <figure className="soha-viz soha-viz--scoring-compare">
      <figcaption className="soha-viz__caption">Raw miss count vs score impact</figcaption>
      <div className="soha-viz__compare-cols">
        <div className="soha-viz__compare-col">
          <span className="soha-viz__compare-col-title">Face value</span>
          <div className="soha-viz__big-stat">3</div>
          <span className="soha-viz__compare-col-sub">hard Command of Evidence misses</span>
        </div>
        <div className="soha-viz__compare-arrow" aria-hidden="true">
          →
        </div>
        <div className="soha-viz__compare-col soha-viz__compare-col--highlight">
          <span className="soha-viz__compare-col-title">Score impact</span>
          <div className="soha-viz__impact-list">
            <span>1 easy transition (M1)</span>
            <span>+ 3 medium misses</span>
          </div>
          <span className="soha-viz__compare-col-sub">move her score more</span>
        </div>
      </div>
    </figure>
  );
}

export function TutoringPriorityLadder() {
  const items = ["Transitions", "Boundaries", "Command of Evidence", "Subject-verb agreement"];
  return (
    <figure className="soha-viz soha-viz--priority">
      <figcaption className="soha-viz__caption">Tutoring priority order</figcaption>
      <ol className="soha-viz__priority-ladder">
        {items.map((label, i) => (
          <li key={label}>
            <span className="soha-viz__priority-rank">{i + 1}</span>
            <span className="soha-viz__priority-label">{label}</span>
            <span className="soha-viz__priority-pts">X pts</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export function MathStatsStrip() {
  return (
    <div className="soha-diag__stat-strip" aria-hidden="true">
      <div>
        <strong>6</strong>
        <span>misses total</span>
      </div>
      <div>
        <strong>13/13</strong>
        <span>easy correct</span>
      </div>
      <div>
        <strong>14/16</strong>
        <span>medium correct</span>
      </div>
    </div>
  );
}

export function MathMissHabits() {
  return (
    <figure className="soha-viz soha-viz--math-habits">
      <figcaption className="soha-viz__caption">Where the 6 math misses come from</figcaption>
      <div className="soha-viz__habit-bars">
        <div className="soha-viz__habit-row">
          <span>Factoring / factor theorem</span>
          <div className="soha-viz__habit-track">
            <div className="soha-viz__habit-fill" style={{ width: "50%" }} />
          </div>
          <span className="soha-viz__habit-n">3</span>
        </div>
        <div className="soha-viz__habit-row">
          <span>Geometry setup</span>
          <div className="soha-viz__habit-track">
            <div className="soha-viz__habit-fill soha-viz__habit-fill--geo" style={{ width: "16.7%" }} />
          </div>
          <span className="soha-viz__habit-n">1</span>
        </div>
        <div className="soha-viz__habit-row">
          <span>Algebra precision + proportional</span>
          <div className="soha-viz__habit-track">
            <div className="soha-viz__habit-fill soha-viz__habit-fill--other" style={{ width: "33.3%" }} />
          </div>
          <span className="soha-viz__habit-n">2</span>
        </div>
      </div>
    </figure>
  );
}

export function GoalRangeVisual() {
  return (
    <figure className="soha-viz soha-viz--goal-range">
      <figcaption className="soha-viz__caption">9-week score outlook</figcaption>
      <div className="soha-viz__goal-track">
        <div className="soha-viz__goal-point" style={{ left: "8%" }}>
          <span className="soha-viz__goal-score">~1410</span>
          <span className="soha-viz__goal-label">Today</span>
        </div>
        <div className="soha-viz__goal-point soha-viz__goal-point--mid" style={{ left: "42%" }}>
          <span className="soha-viz__goal-score">1480</span>
          <span className="soha-viz__goal-label">Realistic</span>
        </div>
        <div className="soha-viz__goal-point soha-viz__goal-point--stretch" style={{ left: "78%" }}>
          <span className="soha-viz__goal-score">1500+</span>
          <span className="soha-viz__goal-label">Stretch</span>
        </div>
        <div className="soha-viz__goal-line" />
      </div>
    </figure>
  );
}

export function WeeklyProgramStrip() {
  return (
    <figure className="soha-viz soha-viz--program">
      <figcaption className="soha-viz__caption">Weekly program (from realistic outlook)</figcaption>
      <div className="soha-viz__program-flow">
        <div className="soha-viz__program-step">
          <span className="soha-viz__program-num">2×</span>
          <span>Tutoring + reteach</span>
        </div>
        <div className="soha-viz__program-arrow">→</div>
        <div className="soha-viz__program-step">
          <span className="soha-viz__program-num">1×</span>
          <span>Timed module test</span>
        </div>
        <div className="soha-viz__program-arrow">→</div>
        <div className="soha-viz__program-step">
          <span className="soha-viz__program-num">100+</span>
          <span>Questions / week</span>
        </div>
      </div>
    </figure>
  );
}
