import Link from "next/link";

function ScoreBar({
  label,
  low,
  high,
  max = 800,
  accent = "rw"
}: {
  label: string;
  low: number;
  high: number;
  max?: number;
  accent?: "rw" | "math" | "total";
}) {
  const mid = (low + high) / 2;
  const left = (low / max) * 100;
  const width = ((high - low) / max) * 100;
  const marker = (mid / max) * 100;

  return (
    <div className={`soha-diag__bar soha-diag__bar--${accent}`}>
      <div className="soha-diag__bar-head">
        <span className="soha-diag__bar-label">{label}</span>
        <span className="soha-diag__bar-score">
          {low}–{high}
        </span>
      </div>
      <div className="soha-diag__bar-track" aria-hidden="true">
        <div className="soha-diag__bar-range" style={{ left: `${left}%`, width: `${width}%` }} />
        <div className="soha-diag__bar-dot" style={{ left: `${marker}%` }} />
      </div>
    </div>
  );
}

function DifficultyRow({
  section,
  easy,
  medium,
  hard,
  correct,
  total
}: {
  section: string;
  easy: string;
  medium: string;
  hard: string;
  correct: string;
  total: string;
}) {
  return (
    <div className="soha-diag__diff-row">
      <div className="soha-diag__diff-head">
        <strong>{section}</strong>
        <span>
          {correct} of {total}
        </span>
      </div>
      <div className="soha-diag__diff-pills">
        <span className="soha-diag__pill">Easy {easy}</span>
        <span className="soha-diag__pill">Medium {medium}</span>
        <span className="soha-diag__pill">Hard {hard}</span>
      </div>
    </div>
  );
}

function MissCard({
  id,
  difficulty,
  topic,
  note
}: {
  id: string;
  difficulty: string;
  topic: string;
  note: string;
}) {
  const diffClass =
    difficulty === "Easy"
      ? "soha-diag__miss-tag--easy"
      : difficulty === "Medium"
        ? "soha-diag__miss-tag--medium"
        : "soha-diag__miss-tag--hard";

  return (
    <div className="soha-diag__miss">
      <div className="soha-diag__miss-top">
        <span className="soha-diag__miss-id">{id}</span>
        <span className={`soha-diag__miss-tag ${diffClass}`}>{difficulty}</span>
        <span className="soha-diag__miss-topic">{topic}</span>
      </div>
      <p>{note}</p>
    </div>
  );
}

function FixCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="soha-diag__fix">
      <h4>{title}</h4>
      <p>{body}</p>
    </div>
  );
}

export function SohaDiagnosticAnalysisContent() {
  return (
    <article className="soha-diag">
      <header className="soha-diag__hero">
        <p className="danielle-portal__eyebrow">Illuminairy · Skill Diagnostic</p>
        <h1>Diagnostic analysis</h1>
        <p className="soha-diag__meta">
          Full-length diagnostic · June 17, 2026 · All four modules complete
        </p>
      </header>

      <section className="soha-diag__section" aria-labelledby="soha-overall">
        <h2 id="soha-overall">Overall performance</h2>
        <p>
          Based on the full-length diagnostic taken June 17, 2026, with all four modules complete.
        </p>

        <div className="soha-diag__score-grid">
          <div className="soha-diag__score-card soha-diag__score-card--total">
            <span className="soha-diag__score-card-label">Total score</span>
            <strong>1380–1430</strong>
            <span className="soha-diag__score-card-sub">of 1600</span>
          </div>
          <div className="soha-diag__score-card">
            <span className="soha-diag__score-card-label">Reading and Writing</span>
            <strong>670–690</strong>
            <span className="soha-diag__score-card-sub">
              Module 1: 25/27 · Module 2: 22/27
            </span>
          </div>
          <div className="soha-diag__score-card">
            <span className="soha-diag__score-card-label">Math</span>
            <strong>710–740</strong>
            <span className="soha-diag__score-card-sub">
              Module 1: 21/22 · Module 2: 17/22
            </span>
          </div>
        </div>

        <div className="soha-diag__bars">
          <ScoreBar label="Total (estimated)" low={1380} high={1430} max={1600} accent="total" />
          <ScoreBar label="Reading and Writing" low={670} high={690} accent="rw" />
          <ScoreBar label="Math" low={710} high={740} accent="math" />
        </div>

        <div className="soha-diag__diff-block">
          <h3>By difficulty</h3>
          <DifficultyRow
            section="Reading and Writing"
            correct="47"
            total="54"
            easy="88%"
            medium="87%"
            hard="87%"
          />
          <DifficultyRow section="Math" correct="38" total="44" easy="100%" medium="88%" hard="73%" />
        </div>

        <p>
          Soha is performing in the upper 1300s to the lower 1400s. We estimate her current
          performance is between <strong>1380 and 1430</strong>. Her math is stronger than her
          reading and writing: <strong>710–740</strong> on math and <strong>670–690</strong> on
          reading and writing.
        </p>

        <div className="soha-diag__callout soha-diag__callout--warn">
          <h3>Routing risk on Reading and Writing</h3>
          <p>
            She missed <strong>4 easy and medium questions</strong> in reading and writing. If she
            performs similarly on test day, she could miss the cutoff for the hard Module 2 in that
            section. That can cap her score for the whole section by up to{" "}
            <strong>130 points</strong>.
          </p>
        </div>
      </section>

      <section className="soha-diag__section" aria-labelledby="soha-rw">
        <h2 id="soha-rw">Reading and writing performance</h2>
        <p>
          She missed <strong>7 questions</strong> total: <strong>3</strong> standard English
          convention questions (2 on boundaries), <strong>2</strong> on transitions, and{" "}
          <strong>2</strong> on command of evidence.
        </p>
        <p className="soha-diag__note">
          Below, misses are sorted by module and difficulty. Difficulty is what determines how much
          each miss moves her score.
        </p>

        <h3>Module 1</h3>
        <MissCard
          id="Q22"
          difficulty="Easy"
          topic="Transitions"
          note="The single most expensive miss in the section. She changed this answer during review, from a likely-correct choice to the wrong one."
        />
        <MissCard
          id="Q18"
          difficulty="Medium"
          topic="Boundaries"
          note="Incomplete-clause punctuation choice."
        />

        <h3>Module 2</h3>
        <MissCard
          id="Q22"
          difficulty="Medium"
          topic="Subject-verb agreement"
          note="Matched the nearby singular name instead of the plural subject."
        />
        <MissCard id="Q23" difficulty="Medium" topic="Transitions" note="Relationship label mismatch." />
        <MissCard
          id="Q12"
          difficulty="Hard"
          topic="Command of Evidence"
          note="True fact, but not matched to the specific claim."
        />
        <MissCard
          id="Q14"
          difficulty="Hard"
          topic="Command of Evidence"
          note="Same pattern: factually tied to the passage but off-claim."
        />
        <MissCard
          id="Q20"
          difficulty="Hard"
          topic="Boundaries"
          note="Both sides of the punctuation were not complete clauses."
        />

        <div className="soha-diag__callout">
          <h3>What the scoring model says</h3>
          <p>
            At face value, hard Command of Evidence looks like the biggest problem (two hard
            misses). Through the SAT scoring model, the opposite is true. The three hard misses in
            Module 2 do not move her score as much as the easy and medium misses in Module 1.
          </p>
          <p>
            The question that likely moved her score the most was the <strong>easy transition</strong>{" "}
            miss in Module 1, followed by the three medium misses. The easy miss is also the one
            that puts her routing at risk.
          </p>
        </div>

        <p>
          Across every miss, the core issue is the same: she chooses answers that are locally
          plausible but do not satisfy the full sentence or the full claim.
        </p>

        <h3>Four versions of that pattern</h3>
        <FixCard
          title="Boundaries and complete clauses"
          body='On the Marie Curie question she chose a semicolon plus a participle phrase ("radioactivity; earning"). She saw that the sentence needed a break, but did not test whether both sides were complete sentences. The correct answer added "and she earned," which makes a second full clause. Fix: at every punctuation choice, check whether each side is a complete sentence on its own.'
        />
        <FixCard
          title="Transitions"
          body='On the cortisol question she chose "For example," but the second sentence contradicts the first, so the answer was "In contrast." On the painting question she chose "Additionally," but the sentence moves to a final interpretation, so "Ultimately" fit. She picks transitions based on whether the next sentence is related, rather than naming the exact relationship first. Fix: label the relationship before looking at the choices: contrast, example, result, addition, conclusion, or alternative.'
        />
        <FixCard
          title="Command of Evidence"
          body='On the CO2 table she picked an answer about process emissions, but the claim was about total emissions and the "necessary but not sufficient" logic. On the Kurosawa question she picked a true fact about scholars analyzing his films, but the claim needed evidence that the diverse later works reflect his own hybrid approach. Fix: restate the exact claim before reading the choices, then reject anything that is true but off-claim.'
        />
        <FixCard
          title="Subject-verb agreement with interrupting phrases"
          body='On the Henrietta Swan Leavitt question she chose "has remained," matching the nearby singular name, but the real subject was the plural "observations." Fix: cross out the long descriptive phrase in the middle and match the verb to the real subject.'
        />

        <h3>Priority order for tutoring</h3>
        <ol className="soha-diag__priority">
          <li>Transitions</li>
          <li>Boundaries</li>
          <li>Command of Evidence</li>
          <li>Subject-verb agreement</li>
        </ol>
        <p>
          We attack these in order until she hits <strong>95% accuracy</strong> on easy, medium, and
          hard for the current skill before moving to the next.
        </p>
      </section>

      <section className="soha-diag__section" aria-labelledby="soha-math">
        <h2 id="soha-math">Math performance</h2>
        <p>
          Her math is fairly strong and she benefits from Desmos and the built-in calculator.
          Dependency on the calculator also led to several misses: she used it by default even on
          questions that needed to be solved by hand.
        </p>

        <div className="soha-diag__stat-strip">
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

        <h3>Habit 1: Calculator on problems that need algebra</h3>
        <p>
          This showed up across Module 2 and is the highest-value fix because it hits her most
          frequent question types. Three of six math misses are factoring or factor-theorem questions
          where the move is algebra by hand, and the calculator either cannot get there or leads her
          to the wrong conclusion.
        </p>
        <MissCard
          id="M2 Q13"
          difficulty="Hard"
          topic="Equivalent expressions / factoring"
          note="9x³ − 6x² − 24x with 3x + k a factor. Factor: 3x(3x² − 2x − 8) = 3x(x − 2)(3x + 4), so k = 4. She graphed and entered 13.15 instead. There is no graphing path to k here."
        />
        <MissCard
          id="M2 Q20"
          difficulty="Hard"
          topic="Factor theorem"
          note="If x + 2a is a factor, then f(−2a) = 0, which solves to a = 3/2. She answered 5/2."
        />
        <MissCard
          id="M1 Q9"
          difficulty="Medium"
          topic="Nonlinear equations"
          note="She spent 333 seconds on a problem that needed structure recognition, factoring, and zero-product form."
        />
        <p>
          <strong>Fix:</strong> Desmos and the calculator are for genuinely calculator-friendly
          problems and for checking work, not for factoring or factor-theorem questions. When she
          sees &quot;is a factor of,&quot; that is a by-hand trigger. Drill GCF first, factor by
          grouping, the ac-method, factor theorem with substitution, and edge cases that look
          graphable but are not.
        </p>

        <h3>Habit 2: Zero-product setup</h3>
        <p>
          For Math Module 1 Q9, the issue was not that she does not understand quadratics. She did
          not recognize the equation needed to be rearranged into zero-product form before solving.
        </p>

        <h3>Content gap: Area and volume setup</h3>
        <p>
          Module 2 Q12: cube volume 125,000, find surface area. Side = ∛125,000 = 50. Surface area =
          6 × 50² = <strong>15,000</strong>. She answered 25,000. Cube volume and surface-area
          relationships are not on the SAT formula sheet. She got every circle question right (M1
          Q13, M1 Q21, M2 Q10), so this is specifically an area-and-volume setup gap, not geometry
          across the board.
        </p>

        <h3>Other math misses</h3>
        <MissCard
          id="M2 Q16"
          difficulty="Hard"
          topic="Collinear points / slopes"
          note="Set the two slopes equal and simplify to ak + bh = hk. She picked a manipulation that did not simplify correctly. Same precision theme as reading and writing."
        />
        <MissCard
          id="M2 Q22"
          difficulty="Hard"
          topic="Percentages / proportional reasoning"
          note="Profit and loss multi-step question. Very teachable, but these appear less often on the SAT. Schedule closer to test day, after factoring is solid."
        />

        <p>
          <strong>Primary focus:</strong> factoring and all factoring edge cases so she does not
          miss equivalent expressions, factor theorem, or quadratic equations that require
          factoring. These cannot be done on the calculator.
        </p>
        <p>
          <strong>Secondary focus:</strong> geometry refresh for questions that cannot be solved
          solely from the built-in formula sheet.
        </p>
      </section>

      <section className="soha-diag__section" aria-labelledby="soha-behavior">
        <h2 id="soha-behavior">Test-taking behavior</h2>
        <div className="soha-diag__two-col">
          <div className="soha-diag__list-card soha-diag__list-card--good">
            <h3>Strong habits to keep</h3>
            <ul>
              <li>Fast, efficient pace</li>
              <li>Used mark for review well</li>
              <li>Comfortable with Desmos and the calculator</li>
              <li>Used the built-in formula sheet</li>
              <li>Used scratch paper when she needed it</li>
            </ul>
          </div>
          <div className="soha-diag__list-card soha-diag__list-card--adjust">
            <h3>Habits to adjust</h3>
            <ul>
              <li>
                <strong>Review pass:</strong> She finished early and re-read every reading and
                writing question. The one answer she changed (Module 1 Q22) went from right to
                wrong. One careful pass; mark for review only when truly unsure; bank leftover time
                for math.
              </li>
              <li>
                <strong>Calculator default:</strong> Put the calculator down on algebra and
                factoring questions. Tool use is strong when the problem type suits it.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="soha-diag__section" aria-labelledby="soha-realistic">
        <h2 id="soha-realistic">What score is realistic</h2>
        <p>
          Her gaps are fairly concentrated. In the 9 weeks between now and test day, reaching the
          upper 1400s (about <strong>1480</strong>) is realistic. With strong work between sessions,
          the 1500s are possible, but that requires near-perfect performance on test day. Results
          vary by student.
        </p>
        <p>
          The program runs <strong>3 tutoring sessions per week</strong>: the first two reteach
          concepts and missed questions; the third is a timed module set plus review. She should
          complete about <strong>100+ practice questions per week</strong> (~1,000 total by test
          day). Each week we report accuracy improvements and estimated score movement.
        </p>
        <p className="soha-diag__note">
          The full week-by-week schedule lives on the{" "}
          <Link href="/soha/plan" className="soha-diag__inline-link">
            Study Plan
          </Link>{" "}
          tab.
        </p>
      </section>

      <section className="soha-diag__section soha-diag__appendix" aria-labelledby="soha-appendix">
        <h2 id="soha-appendix">Appendix: raw diagnostic reports</h2>
        <p>Download or open the full PDF exports from the June 17 diagnostic session.</p>
        <div className="danielle-portal__cards">
          <Link href="/soha/diagnostic/full" className="danielle-portal__link-card">
            <h2>Full report</h2>
            <p>
              Complete breakdown with section scores, timing charts, and question-level detail.
            </p>
          </Link>
          <Link href="/soha/diagnostic/tabular" className="danielle-portal__link-card">
            <h2>Tabular report</h2>
            <p>Skill-by-skill table of misses, difficulty, and time per question.</p>
          </Link>
        </div>
      </section>
    </article>
  );
}
