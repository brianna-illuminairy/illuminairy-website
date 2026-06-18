import Link from "next/link";
import {
  MATH_MISS_TABLE,
  RW_MISS_TABLE,
  RW_PRIORITY,
} from "@/lib/soha/diagnostic-report-data";
import { SOHA_PLAN_REALISTIC_PARAGRAPHS } from "@/lib/soha/plan-outlook";
import {
  Callout,
  DiagnosticHero,
  DifficultyReadout,
  HabitsGrid,
  MissTable,
  PatternCard,
  PriorityList,
  QuestionPerformanceMap,
  ScoreProjection,
  SectionHead,
  WorkedExample,
} from "@/components/soha/diagnostic-visuals";

export function SohaDiagnosticAnalysisContent() {
  return (
    <article className="soha-report">
      <div className="soha-report__aurora" aria-hidden="true" />

      <div className="soha-report__wrap">
        <header className="soha-report__mast">
          <div className="soha-report__brand">
            <span className="soha-report__star">✦</span>
            <span className="soha-report__brand-name">Illuminairy</span>
          </div>
          <div className="soha-report__meta">
            <div>
              Test · <b>Full Length Diagnostic Test</b>
            </div>
            <div>
              Date · <b>June 17, 2026</b>
            </div>
          </div>
        </header>

        <DiagnosticHero />

        <section className="soha-report__section" id="soha-overall">
          <SectionHead num="01" title="Question Level Performance" />

          <p className="soha-report__lede">
            Based on the full-length diagnostic taken June 17, 2026, with all four modules complete.
          </p>

          <QuestionPerformanceMap />
          <DifficultyReadout />
        </section>

        <section className="soha-report__section" id="soha-rw">
          <SectionHead num="02" title="Reading & Writing Performance" />

          <p>
            Moving into her section-level performance for reading and writing, she missed 7 total
            questions. She got 3 standard English convention questions incorrect, 2 of which were on
            boundaries. She also got 2 questions incorrect on transitions and 2 incorrect on command of
            evidence.
          </p>

          <MissTable rows={RW_MISS_TABLE} />
          <p className="soha-report__tnote">
            Correct answer vs. answer marked · sourced from the question-level breakdown.
          </p>

          <p>
            Read at face value, it looks like her biggest problem is hard Command of Evidence
            questions, since that has the highest raw count of mistakes. Through the SAT scoring
            model, the opposite is true. The three hard misses in Module 2 do not cost her as many
            points as easy questions on Module 1. The question which likely cost her the most points
            was the easy transition question she missed in Module 1 followed by the three medium
            misses. Those are the ones that actually move her score the most, and the easy miss is
            the one that also puts her routing at risk.
          </p>

          <Callout tag="Area of concern · Module 2 routing">
            <p>
              One area of concern was that she got a total of 4 medium and easy questions incorrect on
              reading and writing, which means there&apos;s still some risk that on test day, if she
              performs similarly, she could end up not testing into the hard version of Module 2
              Reading and Writing. If she misses the cutoff, that can cap her score and could cost her
              up to 130 points alone.
            </p>
          </Callout>

          <p>
            Across every question she missed, the core underlying issue was the same. She was choosing
            answers that were locally plausible but did not satisfy the full sentence or the full
            claim.
          </p>
          <p className="soha-report__lede">Four specific versions of this:</p>

          <div className="soha-report__patterns">
            <PatternCard
              index={1}
              title="Boundaries and complete clauses"
              body='On the Marie Curie question she chose a semicolon plus a participle phrase, "radioactivity; earning." She correctly saw that the sentence needed a break, but she did not test whether both sides of the punctuation were complete sentences. The correct answer added "and she earned," which makes a second full clause.'
              fix="At every punctuation choice, check whether each side is a complete sentence on its own."
            />
            <PatternCard
              index={2}
              title="Transitions"
              body='On the cortisol question she chose "For example," but the second sentence contradicts the first instead of illustrating it, so the answer was "In contrast." On the painting question she chose "Additionally," but the sentence moves to a final interpretation, so "Ultimately" fit. She is picking transitions based on whether the next sentence is related, rather than naming the exact relationship first.'
              fix="Label the relationship before looking at the choices: contrast, example, result, addition, conclusion, or alternative."
            />
            <PatternCard
              index={3}
              title="Command of Evidence"
              body='On the CO2 table she picked an answer about process emissions, but the claim was about total emissions and the "necessary but not sufficient" logic. On the Kurosawa question she picked a true fact about scholars analyzing his films, but the claim needed evidence that the diverse later works reflect his own hybrid approach. Both answers were factually tied to the passage but not matched to the specific claim.'
              fix="Restate the exact claim before reading the choices, then reject anything that is true but off-claim."
            />
            <PatternCard
              index={4}
              title="Subject-verb agreement with interrupting phrases"
              body='On the Henrietta Swan Leavitt question she chose "has remained," matching the nearby singular name, but the real subject was the plural "observations."'
              fix="Cross out the long descriptive phrase in the middle and match the verb to the real subject."
            />
          </div>

          <p style={{ marginTop: 24 }}>
            As far as order of importance is concerned, I&apos;d estimate she&apos;s losing:
          </p>
          <PriorityList items={RW_PRIORITY} />
          <p>
            We would plan to attack them in priority order until she&apos;s able to answer the easy,
            medium, and hard questions at 95% accuracy before moving on to the next topic.
          </p>
        </section>

        <section className="soha-report__section" id="soha-math">
          <SectionHead num="03" title="Math Performance" />

          <p>
            Her math is fairly strong and she&apos;s benefiting from strong use of the Desmos
            calculator; however, her dependency on the Desmos calculator also led her to the questions
            she missed since she resorted to using it by default even for questions that needed to be
            solved by hand.
          </p>
          <p>
            She missed 6 math questions; however, those were not evenly distributed across difficulty
            levels like what we saw in the reading and writing modules. Instead, she was perfect on
            easy questions (13 of 13) and solid on medium (14 of 16). Out of the questions that
            she&apos;s getting incorrect, they trace back to two specific habits, and some minor content
            gaps.
          </p>

          <MissTable rows={MATH_MISS_TABLE} />
          <p className="soha-report__tnote">Correct answer vs. answer marked · 6 math misses across both modules.</p>

          <h3 className="soha-report__gap-title">The big one: she runs to the calculator on problems that need algebra</h3>
          <p>
            This showed up across Module 2 and is the highest-value fix because it hits her most
            frequent question types. Three of her six math misses are factoring or factor-theorem
            questions where the move is algebra by hand, and the calculator either cannot get there or
            actively leads her to the wrong conclusion.
          </p>

          <WorkedExample />

          <p>
            The same pattern produced two more misses. Module 2 Q20 states that x + 2a is a factor of
            f(x) and asks for a. The move is the factor theorem: if x + 2a is a factor, then f(-2a) =
            0, which solves to a = 3/2. She answered 5/2. And Module 1 Q9, the nonlinear equation she
            spent 333 seconds on, was the same family: recognize the structure, bring everything to
            one side, factor, and set each factor to zero. In all three, the answer comes from seeing
            structure, and the calculator hides the structure rather than revealing it.
          </p>
          <p>
            The fix has two parts. First, calculator discipline: the calculator and Desmos are for
            genuinely calculator-friendly problems and for checking work, not for factoring or
            factor-theorem questions. When she sees &quot;is a factor of,&quot; that is a by-hand
            trigger. Second, she needs to drill the SAT&apos;s tricky factoring patterns so factoring
            by hand is fast and automatic: greatest common factor first, factor by grouping, the
            ac-method, the factor theorem with substitution, and the edge cases that look graphable but
            are not.
          </p>

          <h3 className="soha-report__gap-title">
            Next: she&apos;s not defaulting to the zero product property for solving quadratic equations
          </h3>
          <p>
            She struggled with a Module 1 math problem for over 3 minutes trying to figure it out when
            her setup was incorrect. For Math Module 1 Q9, the issue was not &quot;she doesn&apos;t
            understand quadratics.&quot; It was more specifically a setup and strategy issue: she did
            not recognize the equation needed to be rearranged into zero-product form.
          </p>

          <h3 className="soha-report__gap-title">
            The second leak: geometry setup from memory, not just from the formula sheet
          </h3>
          <p>
            On Module 2 Q12, a cube has a volume of 125,000 cubic units and the question asks for its
            surface area. The path is side = cube root of 125,000 = 50, then surface area = 6 times
            50² = 15,000. She answered 25,000, which means the setup was off. The cube volume and
            surface-area relationships are not on the SAT formula sheet, so this question rewards
            remembering the concept, not looking it up. The read here is that she leaned on the formula
            sheet and calculator, but the core setup was not there to begin with. Worth noting: she got
            every circle question right (Module 1 Q13 and Q21, Module 2 Q10), so this is specifically
            an area-and-volume setup gap, not geometry across the board. The fix is a focused geometry
            concept refresh so she has the concept and the tools, not only the tools. It&apos;s common
            for kids who haven&apos;t touched geometry in a couple of years to struggle here.
          </p>

          <h3 className="soha-report__gap-title">Two other misses round out the math</h3>
          <div className="soha-report__misslines">
            <div className="soha-report__missline">
              <span className="soha-report__missline-star">✦</span>
              <div>
                <span className="soha-report__missline-q">Module 2 Q16</span>, a hard algebra question
                about three collinear points, where the move is to set the two slopes equal and simplify
                to ak + bh = hk. She picked a manipulation that did not simplify correctly. This is the
                same precision theme as her Reading and Writing misses, applied to algebra.
              </div>
            </div>
            <div className="soha-report__missline">
              <span className="soha-report__missline-star">✦</span>
              <div>
                <span className="soha-report__missline-q">Module 2 Q22</span>, a profit and loss
                proportional-reasoning question (sell part at a loss, then find the profit percent
                needed on the rest to net 20%). This one is very teachable, but these multi-step
                proportional questions do not appear often on the SAT, so I would schedule it closer to
                the test date, after factoring is solid, since factoring affects far more questions.
              </div>
            </div>
          </div>

          <p>
            My primary focus would be on getting her factoring and all factoring edge/hard cases done
            so that she doesn&apos;t miss problems on equivalent expressions, the factor theorem, or
            quadratic equations that require factoring. And this has to be taught since they cannot be
            done on the calculator. My secondary focus would be geometry refresh for questions that
            cannot be solved solely using the built-in formula sheet.
          </p>
        </section>

        <section className="soha-report__section" id="soha-behavior">
          <SectionHead num="04" title="Test-Taking Behavior" />

          <HabitsGrid />

          <p style={{ marginTop: 24 }}>
            <b>First, how she reviews.</b> She finished early and went back over her answers. On a school
            test I would encourage that. On a test that runs two hours and fourteen minutes, I would not
            have her review every Reading and Writing question twice. Switching back and forth between
            question types drains mental stamina, and that fatigue carries into the math section where
            she needs it most. Two facts from her own session make the case. During review she mostly
            did not change her answers, so the second pass added almost nothing. And the one Reading and
            Writing answer she did change, Q22, she changed from right to wrong, and that is an easy
            question in Module 1, so it is also her most expensive miss in the section. The review habit
            did not just fail to help. On the one question it touched, it cost her the most valuable
            point. My recommendation: one careful pass, use mark for review only for questions she is
            truly unsure of, and bank the leftover time and energy for math.
          </p>
          <p>
            <b>Second, her default to the calculator on algebra problems,</b> which I cover in the math
            section. Her tool use is strong when the problem suits it. The change is knowing when to put
            the calculator down and factor.
          </p>
        </section>

        <section className="soha-report__section" id="soha-realistic">
          <SectionHead num="05" title="What Score Is Realistic" />

          <ScoreProjection />

          {SOHA_PLAN_REALISTIC_PARAGRAPHS.map((paragraph, i) => (
            <p key={i} style={i === 0 ? { marginTop: 24 } : undefined}>
              {paragraph}
            </p>
          ))}

          <p className="soha-report__plan-link">
            The week-by-week schedule is on the{" "}
            <Link href="/soha/plan">Study Plan</Link> tab.
          </p>
        </section>

        <section className="soha-report__section soha-report__appendix" id="soha-appendix">
          <SectionHead num="—" title="Raw Reports" />
          <p className="soha-report__lede">PDF exports from the June 17 diagnostic session.</p>
          <div className="soha-report__doc-links">
            <Link href="/soha/diagnostic/full">Full report →</Link>
            <Link href="/soha/diagnostic/tabular">Tabular report →</Link>
          </div>
        </section>

        <footer className="soha-report__foot">
          <span>
            <span className="soha-report__star">✦</span> Illuminairy · SAT Diagnostic Analysis
          </span>
          <span>Soha Naveed · June 17, 2026</span>
        </footer>
      </div>
    </article>
  );
}
