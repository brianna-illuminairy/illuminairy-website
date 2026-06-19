import {
  DIFFICULTY_READOUT,
  MATH_MISS_TABLE,
  QUESTION_MAP,
  RW_MISS_TABLE,
  SKYE_FORMULAS,
  SKYE_HERO,
} from "@/lib/skye/diagnostic-report-data";
import {
  Callout,
  DiagnosticHero,
  DifficultyReadout,
  FormulaGrid,
  MissTable,
  PatternCard,
  QuestionPerformanceMap,
  SectionHead,
  TeachingStepsList,
} from "@/components/diagnostic/report-visuals";
import { SkyeAdaptiveRoutingDiagram } from "@/components/skye/adaptive-routing-diagram";
import Link from "next/link";

export function SkyeDiagnosticAnalysisContent() {
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
              Date · <b>June 18, 2026</b>
            </div>
          </div>
        </header>

        <DiagnosticHero {...SKYE_HERO} />

        <section className="diag-report__section" id="skye-overall">
          <SectionHead num="01" title="Question Level Performance" />
          <QuestionPerformanceMap sections={QUESTION_MAP} totalCorrect={63} totalQuestions={98} />
          <DifficultyReadout rows={DIFFICULTY_READOUT} />
        </section>

        <section className="diag-report__section" id="skye-adaptive">
          <SectionHead num="02" title="Adaptive Routing" />
          <p>
            The Digital SAT adapts Module 2 based on Module 1 performance. Skye answered 14 of 27 on
            Reading and Writing Module 1 (about 4 questions below the hard-module cutoff) and 11 of
            22 on Math Module 1 (about 2–3 below cutoff). That shaped an easier Module 2 mix in both
            sections.
          </p>
          <SkyeAdaptiveRoutingDiagram />
          <Callout tag="Module 2 routing">
            <p>
              On Reading and Writing, missing the Module 1 cutoff means even a strong Module 2 caps
              the section score. The first goal is to find the easiest Module 1 mistakes and fix them.
              On Math, she received only one hard question in Module 2 because of Module 1 routing.
            </p>
          </Callout>
        </section>

        <section className="diag-report__section" id="skye-rw">
          <SectionHead num="03" title="Reading & Writing Analysis" />
          <p>
            Most Reading and Writing misses share one habit: she does not pin down what the question
            is asking before she picks, so she chooses the answer that sounds related to the passage
            instead of the one that matches the exact logic, structure, or main idea.
          </p>
          <MissTable rows={RW_MISS_TABLE} />
          <p className="diag-report__tnote">
            Correct answer vs. answer marked · 19 Reading and Writing misses across both modules.
          </p>

          <div className="diag-report__patterns">
            <PatternCard
              index={1}
              title="Transitions (4 missed, 3 easy in Module 1)"
              body='On the cortisol question she chose "Thus" where the sentences contrast, so the answer was "In contrast." On the poem question she chose "In turn" where the move was "Nonetheless." She picks transition words by surface relation, not by naming the relationship first.'
              fix="Learn the five transition types, memorize which SAT words belong to each, then label the relationship between sentences before looking at choices."
            />
            <PatternCard
              index={2}
              title="Reading logic: structure, detail, main idea, evidence"
              body='On the gravitational-waves function question she chose "highlights skepticism," which the text never states. On the Ferguson evidence question she chose standardized/uniform language when the claim was about varied recovery by country.'
              fix="Name the question job first (main idea, detail, function, structure, or evidence), then reject any choice that does a different job even if it repeats passage words."
            />
            <PatternCard
              index={3}
              title="Boundaries"
              body='She used a semicolon before a phrase that was not a complete sentence, missed a comma before "and" joining two full sentences, and missed the closing comma on an interrupting phrase.'
              fix="Label each side as independent or dependent, then apply comma, semicolon, or period rules."
            />
            <PatternCard
              index={4}
              title="Words in Context"
              body='She chose "impedes" in a positive sentence, "transient" when the clue was "approaching," and "involved in" where grammar after "to" required a plain verb.'
              fix="Cover choices, read tone and grammar, predict the missing word, then match an answer to both meaning and form."
            />
            <PatternCard
              index={5}
              title="Rhetorical Synthesis"
              body='She chose an answer that was not an advantage when the goal asked for one, and she did not hold the stated goal in mind long enough to eliminate off-goal choices.'
              fix="Read the goal first, name the task in plain words, then eliminate any answer that does not do exactly that job."
            />
          </div>

          <h3 className="diag-report__gap-title">Transitions teaching order</h3>
          <TeachingStepsList
            steps={[
              {
                title: "Learn the transition types",
                body: "Addition, contrast, cause and effect, example, and emphasis or restatement cover almost every question.",
              },
              {
                title: "Memorize SAT words in each group",
                body: "Her errors were words filed in the wrong type. Drill sorting until it is automatic.",
              },
              {
                title: "Relationship first, word second",
                body: "On each question, decide how the two sentences relate, then pick from that group only.",
              },
            ]}
          />
        </section>

        <section className="diag-report__section" id="skye-math">
          <SectionHead num="04" title="Math Analysis" />
          <p>
            The math is not about raw ability. The SAT asks familiar topics in unfamiliar wording.
            She was often unsure how to start and tried different approaches until something seemed
            to fit. When she is not sure what a question is asking, even Desmos cannot tell her what
            to enter.
          </p>
          <MissTable rows={MATH_MISS_TABLE} />
          <p className="diag-report__tnote">
            Correct answer vs. answer marked · 15 math misses across both modules.
          </p>

          <Callout tag="Module 1 pattern">
            <p>
              She missed every systems-of-equations question and every nonlinear-equation question in
              Math Module 1 (0 of 2 and 0 of 4). Medium questions are core SAT content; three easy
              misses in Module 1 also hurt adaptive routing.
            </p>
          </Callout>

          <h3 className="diag-report__gap-title">Formulas to know by heart</h3>
          <p>None of these are on the SAT reference sheet. They showed up in 9 of her 15 math misses.</p>
          <FormulaGrid items={SKYE_FORMULAS} />

          <h3 className="diag-report__gap-title">Skills to build (in session order)</h3>
          <ul>
            <li>Systems of equations: crossings and number of solutions</li>
            <li>Factoring and the zero-product rule</li>
            <li>Slope from two points and line equations</li>
            <li>Exponential form a · b^x from words</li>
            <li>Circle measures: radians, degrees, arc length</li>
            <li>Perpendicular slope (negative reciprocal)</li>
            <li>Function transformations such as h(x + 2)</li>
            <li>Equation manipulation: divide every term, isolate a variable</li>
          </ul>
        </section>

        <section className="diag-report__section" id="skye-focus">
          <SectionHead num="05" title="Where to Focus" />
          <Callout tag="Strengths to keep">
            <p>
              Inferences (all correct), most Command of Evidence where the claim match was clear,
              Problem-Solving and Data Analysis in Math Module 1, linear equations, lines and angles,
              and area/volume. Her trouble is the specific logic-matching habit on the skills above,
              not passage comprehension overall.
            </p>
          </Callout>
          <p className="diag-report__plan-link">
            For skill priority, recoverable points, and the week-by-week schedule, see the{" "}
            <Link href="/skye/plan">Improvement Plan</Link> tab.
          </p>
        </section>

        <section className="diag-report__section diag-report__appendix" id="skye-appendix">
          <SectionHead num="—" title="Raw Reports" />
          <p className="diag-report__lede">PDF exports from the June 18 diagnostic session.</p>
          <div className="diag-report__doc-links">
            <Link href="/skye/diagnostic/full">Full report →</Link>
            <Link href="/skye/diagnostic/tabular">Tabular report →</Link>
          </div>
        </section>

        <footer className="diag-report__foot">
          <span>
            <span className="diag-report__star">✦</span> Illuminairy · SAT Diagnostic Analysis
          </span>
          <span>Skye · June 18, 2026</span>
        </footer>
      </div>
    </article>
  );
}
