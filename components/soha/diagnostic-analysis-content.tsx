import Link from "next/link";
import {
  MATH_MISS_TABLE,
  MATH_PRIORITY,
  RW_MISS_TABLE,
  RW_PRIORITY,
} from "@/lib/soha/diagnostic-report-data";
import {
  SOHA_ADAPTIVE_GOOD_NEWS,
  SOHA_ADAPTIVE_INTRO,
  SOHA_BEHAVIOR_CALCULATOR,
  SOHA_BEHAVIOR_REVIEW,
  SOHA_CIRCLE_FORM,
  SOHA_DISCRIMINANT,
  SOHA_FACTORING_PATTERNS,
  SOHA_FORMULAS_INTRO,
  SOHA_MATH_750_LIST,
  SOHA_MATH_GAP1_AFTER,
  SOHA_MATH_GAP1_INTRO,
  SOHA_MATH_GAP2,
  SOHA_MATH_GAP2_RESOLVE,
  SOHA_MATH_INTRO,
  SOHA_MATH_Q9_CONTEXT,
  SOHA_MATH_REMAINING,
  SOHA_MEMORIZE_TABLE,
  SOHA_PATTERN_RULES,
  SOHA_QUADRATIC_FORMULA,
  SOHA_RW_INTRO,
  SOHA_RW_PATTERNS,
  SOHA_RW_PLAN_NOTE,
  SOHA_SIGN_TRICK,
  SOHA_VERTEX_FORM,
} from "@/lib/soha/diagnostic-analysis-copy";
import {
  DiagnosticHero,
  DifficultyReadout,
  MissTable,
  PatternCard,
  PriorityList,
  QuestionPerformanceMap,
  SectionHead,
} from "@/components/soha/diagnostic-visuals";
import {
  HabitsGrid,
  WorkedExampleQ13,
  WorkedExampleQ9,
} from "@/components/soha/diagnostic-visuals-soha-extras";

function ProseParagraphs({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line) => (
        <p key={line.slice(0, 48)}>{line}</p>
      ))}
    </>
  );
}

export function SohaDiagnosticAnalysisContent() {
  return (
    <article className="diag-report">
      <div className="diag-report__aurora" aria-hidden="true" />

      <div className="diag-report__wrap">
        <header className="diag-report__mast">
          <div className="diag-report__brand">
            <span className="diag-report__star">✦</span>
            <span className="diag-report__brand-name">Illuminairy</span>
          </div>
          <div className="diag-report__meta">
            <div>
              Test · <b>Full Length Diagnostic Test</b>
            </div>
            <div>
              Date · <b>June 17, 2026</b>
            </div>
          </div>
        </header>

        <DiagnosticHero />

        <section className="diag-report__section diag-report__prose" id="soha-overall">
          <SectionHead num="01" title="Performance Overview" />
          <QuestionPerformanceMap />
          <DifficultyReadout />
        </section>

        <section className="diag-report__section diag-report__prose" id="soha-adaptive">
          <SectionHead num="02" title="Adaptive Results" />
          <p>{SOHA_ADAPTIVE_INTRO}</p>
          <p>{SOHA_ADAPTIVE_GOOD_NEWS}</p>
        </section>

        <section className="diag-report__section diag-report__prose" id="soha-rw">
          <SectionHead num="03" title="Reading and Writing Analysis" />
          <ProseParagraphs lines={SOHA_RW_INTRO} />
          <p className="diag-report__lede">Some examples from her diagnostic are below:</p>

          <div className="diag-report__patterns">
            {SOHA_RW_PATTERNS.map((skill, index) => (
              <PatternCard
                key={skill.title}
                index={index + 1}
                title={skill.title}
                body={skill.body}
                fix={skill.fix}
              />
            ))}
          </div>

          <MissTable rows={RW_MISS_TABLE} />
          <p className="diag-report__tnote">
            Correct answer vs. answer marked · sourced from the question-level breakdown.
          </p>

          <p style={{ marginTop: 24 }}>
            As far as order of importance is concerned, I&apos;d estimate she&apos;s losing the
            following points per skill:
          </p>
          <PriorityList items={RW_PRIORITY} />
          <p>{SOHA_RW_PLAN_NOTE}</p>
          <p>
            In the SAT Improvement Plan we would tutor her until she&apos;s reached the required level of
            accuracy, attacking one skill at a time, starting with the one costing the most points.
          </p>
        </section>

        <section className="diag-report__section diag-report__prose" id="soha-math">
          <SectionHead num="04" title="Math Performance" />
          <ProseParagraphs lines={SOHA_MATH_INTRO} />

          <MissTable rows={MATH_MISS_TABLE} />
          <p className="diag-report__tnote">
            Correct answer vs. answer marked · 6 math misses across both modules.
          </p>

          <h3 className="diag-report__gap-title">Gap 1: Factoring and the factor theorem</h3>
          <p>{SOHA_MATH_GAP1_INTRO}</p>
          <WorkedExampleQ13 />
          <p>{SOHA_MATH_GAP1_AFTER}</p>
          <p>{SOHA_MATH_Q9_CONTEXT}</p>
          <WorkedExampleQ9 />

          <h3 className="diag-report__gap-title">Gap 2: Geometry beyond the formula sheet</h3>
          <p>{SOHA_MATH_GAP2}</p>
          <p>{SOHA_MATH_GAP2_RESOLVE}</p>

          <h3 className="diag-report__gap-title">Two remaining misses</h3>
          <div className="diag-report__misslines">
            {SOHA_MATH_REMAINING.map((row) => (
              <div key={row.q} className="diag-report__missline">
                <span className="diag-report__missline-star">✦</span>
                <div>
                  <span className="diag-report__missline-q">{row.q}</span>, {row.text}
                </div>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 24 }}>
            As far as order of importance is concerned, I&apos;d estimate she&apos;s losing the
            following, based on how frequently those questions occur across each module of the SAT and
            their difficulty level:
          </p>
          <PriorityList items={MATH_PRIORITY} />
          <p>
            In the SAT Improvement Plan we would tutor her until she&apos;s reached the required level of
            accuracy, attacking one skill at a time, starting with the one costing the most points.
          </p>
        </section>

        <section className="diag-report__section diag-report__prose" id="soha-behavior">
          <SectionHead num="05" title="Test-Taking Behavior" />
          <HabitsGrid />

          <p style={{ marginTop: 24 }}>
            <b>First, how she reviews.</b> {SOHA_BEHAVIOR_REVIEW}
          </p>
          <p>
            <b>Second, her starting point for each question is to plug in numbers/equations/expressions into the calculator</b>{" "}
            without first identifying what type of math question it is and whether it can be solved
            using the built-in calculator. {SOHA_BEHAVIOR_CALCULATOR}
          </p>

          <p style={{ marginTop: 24 }}>
            Lastly for off formula math that she needs to memorize, such as the following:
          </p>
          <p>{SOHA_FORMULAS_INTRO}</p>
          <p>The two most important forms are:</p>

          <h3 className="diag-report__gap-title">1. Quadratic Vertex Form</h3>
          <div className="diag-report__mathline">{SOHA_VERTEX_FORM.equation}</div>
          <p>You should immediately know:</p>
          <ul className="diag-report__skill-ul">
            {SOHA_VERTEX_FORM.bullets.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p>Example:</p>
          <div className="diag-report__mathline">{SOHA_VERTEX_FORM.example}</div>
          <ul className="diag-report__skill-ul">
            {SOHA_VERTEX_FORM.exampleBullets.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p>{SOHA_VERTEX_FORM.foot}</p>

          <h3 className="diag-report__gap-title">2. Circle Form</h3>
          <div className="diag-report__mathline">{SOHA_CIRCLE_FORM.equation}</div>
          <p>You should immediately know:</p>
          <ul className="diag-report__skill-ul">
            {SOHA_CIRCLE_FORM.bullets.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p>Example:</p>
          <div className="diag-report__mathline">{SOHA_CIRCLE_FORM.example}</div>
          <ul className="diag-report__skill-ul">
            {SOHA_CIRCLE_FORM.exampleBullets.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p>{SOHA_CIRCLE_FORM.foot}</p>

          <h3 className="diag-report__gap-title">Sign Trick (Very Important)</h3>
          <p>{SOHA_SIGN_TRICK.intro}</p>
          {SOHA_SIGN_TRICK.examples.map((ex) => (
            <div key={ex.given} className="diag-report__mathline">
              {ex.given} → {ex.result}
            </div>
          ))}
          <p>{SOHA_SIGN_TRICK.rule}</p>
          <div className="diag-report__tablewrap">
            <table className="diag-report__table">
              <thead>
                <tr>
                  <th>Equation</th>
                  <th>h</th>
                  <th>k</th>
                </tr>
              </thead>
              <tbody>
                {SOHA_SIGN_TRICK.table.map((row) => (
                  <tr key={row.equation}>
                    <td>{row.equation}</td>
                    <td>{row.h}</td>
                    <td>{row.k}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="diag-report__gap-title">What Should Be Memorized for SAT?</h3>
          <p>You should instantly recognize:</p>
          <div className="diag-report__tablewrap">
            <table className="diag-report__table">
              <thead>
                <tr>
                  <th>Form</th>
                  <th>What to Memorize</th>
                </tr>
              </thead>
              <tbody>
                {SOHA_MEMORIZE_TABLE.map((row) => (
                  <tr key={row.form}>
                    <td>{row.form}</td>
                    <td>{row.memorize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            If you&apos;re studying SAT Math, I&apos;d focus less on memorizing the letters h and k
            themselves and more on recognizing the <strong>patterns</strong>:
          </p>
          <ul className="diag-report__skill-ul">
            {SOHA_PATTERN_RULES.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p>Those four rules cover about 95% of the SAT questions where h and k appear.</p>

          <h4 className="diag-report__skill-title">Quadratic Formula</h4>
          <div className="diag-report__mathline">{SOHA_QUADRATIC_FORMULA.formula}</div>
          <p>{SOHA_QUADRATIC_FORMULA.note}</p>

          <h4 className="diag-report__skill-title">Discriminant</h4>
          <div className="diag-report__mathline">{SOHA_DISCRIMINANT.formula}</div>
          <p>Know what it tells you:</p>
          <ul className="diag-report__skill-ul">
            {SOHA_DISCRIMINANT.rules.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <h4 className="diag-report__skill-title">Special Factoring Patterns</h4>
          {SOHA_FACTORING_PATTERNS.map((row) => (
            <div key={row.label}>
              <p>
                <strong>{row.label}:</strong>
              </p>
              <div className="diag-report__mathline">{row.formula}</div>
            </div>
          ))}
          <p>These show up surprisingly often.</p>

          <h4 className="diag-report__skill-title">If Your Goal Is 750–800 Math</h4>
          <p>I would prioritize memorizing these 10 items first:</p>
          <ol className="diag-report__skill-ol">
            {SOHA_MATH_750_LIST.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>

          <p className="diag-report__plan-link">
            For projected scores, checkpoints, and the week-by-week schedule, see the{" "}
            <Link href="/soha/plan">SAT Improvement Plan</Link> tab.
          </p>
        </section>

        <section className="diag-report__section diag-report__appendix" id="soha-appendix">
          <SectionHead num="—" title="Raw Reports" />
          <p className="diag-report__lede">PDF exports from the June 17 diagnostic session.</p>
          <div className="diag-report__doc-links">
            <Link href="/soha/diagnostic/full">Full report →</Link>
            <Link href="/soha/diagnostic/tabular">Tabular report →</Link>
          </div>
        </section>

        <footer className="diag-report__foot">
          <span>
            <span className="diag-report__star">✦</span> Illuminairy · SAT Diagnostic Analysis
          </span>
          <span>Soha Naveed · June 17, 2026</span>
        </footer>
      </div>
    </article>
  );
}
