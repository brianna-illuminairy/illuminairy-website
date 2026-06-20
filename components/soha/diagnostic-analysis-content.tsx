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
  SOHA_MATH_GAP1_AFTER,
  SOHA_MATH_GAP1_INTRO,
  SOHA_MATH_GAP2,
  SOHA_MATH_GAP2_RESOLVE,
  SOHA_MATH_INTRO,
  SOHA_MATH_Q9_CONTEXT,
  SOHA_MATH_REMAINING,
  SOHA_RW_INTRO,
  SOHA_RW_PATTERNS,
  SOHA_RW_PLAN_NOTE,
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
  SohaMathFormulaReference,
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

          <SohaMathFormulaReference />
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
