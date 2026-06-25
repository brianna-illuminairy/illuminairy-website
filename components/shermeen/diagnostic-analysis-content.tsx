import Link from "next/link";
import {
  MATH_MISS_TABLE,
  RW_MISS_TABLE,
} from "@/lib/shermeen/diagnostic-report-data";
import { MATH_PRIORITY, RW_PRIORITY } from "@/lib/shermeen/diagnostic-skill-points";
import {
  SHERMEEN_ADAPTIVE_GOOD_NEWS,
  SHERMEEN_ADAPTIVE_INTRO,
  SHERMEEN_BEHAVIOR_REVIEW,
  SHERMEEN_BEHAVIOR_SETUP,
  SHERMEEN_MATH_GAP1_AFTER,
  SHERMEEN_MATH_GAP1_INTRO,
  SHERMEEN_MATH_GAP2,
  SHERMEEN_MATH_GAP2_RESOLVE,
  SHERMEEN_MATH_INTRO,
  SHERMEEN_MATH_PLAN_NOTE,
  SHERMEEN_MATH_Q9_CONTEXT,
  SHERMEEN_MATH_REMAINING,
  SHERMEEN_RW_INTRO,
  SHERMEEN_RW_PATTERNS,
  SHERMEEN_RW_PLAN_NOTE,
} from "@/lib/shermeen/diagnostic-analysis-copy";
import {
  DiagnosticHero,
  DifficultyReadout,
  MissTable,
  PatternCard,
  PriorityList,
  QuestionPerformanceMap,
  SectionHead,
  ShermeenHabitsGrid,
  ShermeenMathFormulaReference,
  WorkedExampleM2Q20,
  WorkedExampleM2Q9,
  WorkedExampleQ9,
} from "@/components/shermeen/diagnostic-visuals";

function ProseParagraphs({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line) => (
        <p key={line.slice(0, 48)}>{line}</p>
      ))}
    </>
  );
}

export function ShermeenDiagnosticAnalysisContent() {
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
              Date · <b>June 23, 2026</b>
            </div>
          </div>
        </header>

        <DiagnosticHero />

        <section className="diag-report__section diag-report__prose" id="shermeen-overall">
          <SectionHead num="01" title="Performance Overview" />
          <QuestionPerformanceMap />
          <DifficultyReadout />
        </section>

        <section className="diag-report__section diag-report__prose" id="shermeen-adaptive">
          <SectionHead num="02" title="Adaptive Results" />
          <p>{SHERMEEN_ADAPTIVE_INTRO}</p>
          <p>{SHERMEEN_ADAPTIVE_GOOD_NEWS}</p>
        </section>

        <section className="diag-report__section diag-report__prose" id="shermeen-rw">
          <SectionHead num="03" title="Reading and Writing Analysis" />
          <ProseParagraphs lines={SHERMEEN_RW_INTRO} />
          <p className="diag-report__lede">Some examples from her diagnostic are below:</p>

          <div className="diag-report__patterns">
            {SHERMEEN_RW_PATTERNS.map((skill, index) => (
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
          <p>{SHERMEEN_RW_PLAN_NOTE}</p>
          <p>
            In the SAT Improvement Plan we would tutor her until she&apos;s reached the required level of
            accuracy, attacking one skill at a time, starting with the one costing the most points.
          </p>
        </section>

        <section className="diag-report__section diag-report__prose" id="shermeen-math">
          <SectionHead num="04" title="Math Performance" />
          <ProseParagraphs lines={SHERMEEN_MATH_INTRO} />

          <MissTable rows={MATH_MISS_TABLE} />
          <p className="diag-report__tnote">
            Correct answer vs. answer marked · 14 Math wrong answers across both modules.
          </p>

          <h3 className="diag-report__gap-title">Gap 1: Factoring and the factor theorem</h3>
          <p>{SHERMEEN_MATH_GAP1_INTRO}</p>
          <WorkedExampleM2Q9 />
          <WorkedExampleM2Q20 />
          <p>{SHERMEEN_MATH_GAP1_AFTER}</p>
          <p>{SHERMEEN_MATH_Q9_CONTEXT}</p>
          <WorkedExampleQ9 />

          <h3 className="diag-report__gap-title">Gap 2: Circles, arc length, and tangency</h3>
          <p>{SHERMEEN_MATH_GAP2}</p>
          <p>{SHERMEEN_MATH_GAP2_RESOLVE}</p>

          <h3 className="diag-report__gap-title">Other misses worth noting</h3>
          <div className="diag-report__misslines">
            {SHERMEEN_MATH_REMAINING.map((row) => (
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
          <p>{SHERMEEN_MATH_PLAN_NOTE}</p>
          <p>
            In the SAT Improvement Plan we would tutor her until she&apos;s reached the required level of
            accuracy, attacking one skill at a time, starting with the one costing the most points.
          </p>

          <ShermeenMathFormulaReference />
        </section>

        <section className="diag-report__section diag-report__prose" id="shermeen-behavior">
          <SectionHead num="05" title="Test-Taking Behavior" />
          <ShermeenHabitsGrid />

          <p style={{ marginTop: 24 }}>
            <b>First, how she uses time on wrong answers.</b> {SHERMEEN_BEHAVIOR_REVIEW}
          </p>
          <p>
            <b>Second, question setup before solving.</b> {SHERMEEN_BEHAVIOR_SETUP}
          </p>

          <p className="diag-report__plan-link">
            For the week-by-week schedule and skill order, see the{" "}
            <Link href="/shermeen/plan">Improvement Plan</Link> tab.
          </p>
        </section>

        <section className="diag-report__section diag-report__appendix" id="shermeen-appendix">
          <SectionHead num="—" title="Raw Reports" />
          <p className="diag-report__lede">PDF exports from the June 23 diagnostic session.</p>
          <div className="diag-report__doc-links">
            <Link href="/shermeen/diagnostic/full">Full report →</Link>
            <Link href="/shermeen/diagnostic/tabular">Tabular report →</Link>
          </div>
        </section>

        <footer className="diag-report__foot">
          <span>
            <span className="diag-report__star">✦</span> Illuminairy · SAT Diagnostic Analysis
          </span>
          <span>Shermeen · June 23, 2026</span>
        </footer>
      </div>
    </article>
  );
}
