import Link from "next/link";
import {
  MATH_MISS_TABLE,
  MATH_PRIORITY,
  RW_MISS_TABLE,
  RW_PRIORITY,
} from "@/lib/soha/diagnostic-report-data";
import {
  Callout,
  DiagnosticHero,
  DifficultyReadout,
  HabitsGrid,
  MissTable,
  PatternCard,
  PriorityList,
  QuestionPerformanceMap,
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
          <QuestionPerformanceMap />
          <DifficultyReadout />
        </section>

        <section className="soha-report__section" id="soha-rw">
          <SectionHead num="02" title="Reading & Writing Performance" />

          <p>
            She missed 7 total reading and writing questions. Three which were standard English
            Conventions or grammar and punctuation based questions. Of those, two were on boundaries.
            She also got 2 transition questions incorrect and 2 command of evidence questions
            incorrect. This means 6 out of her 7 total misses were in 3 narrowly defined skills out of
            the total 11 skills that the reading and writing portion of the SAT tests. This is great
            news because it means we can take the time to go deep on those skills, reteach her any
            gaps, and practice them until mastered.
          </p>

          <MissTable rows={RW_MISS_TABLE} />
          <p className="soha-report__tnote">
            Correct answer vs. answer marked · sourced from the question-level breakdown.
          </p>

          <p>
            Looking at the above, the easy question on transitions in module 1 is the single question
            that cost her the most points. The 3 medium questions she got incorrect cost her the second
            most points. And the hard questions she got incorrect in module 2 cost her the least
            points.
          </p>

          <Callout tag="Area of concern · Module 2 routing">
            <p>
              One area of concern was that she got a total of 4 medium and easy questions incorrect on
              reading and writing. Which means there&apos;s still some risk that on test day if she
              performs similarly she could end up not testing into the hard version of the module 2
              reading and writing, if she misses the cutoff that can cap her score and could cost her
              up to 130 points alone.
            </p>
          </Callout>

          <p>
            Going even deeper into each question she missed, the core underlying issue was the same.
            She is choosing answers that are locally plausible but does not satisfy the full sentence
            or the full claim being tested.
          </p>
          <p className="soha-report__lede">Four examples of this from her diagnostic are below:</p>

          <div className="soha-report__patterns">
            <PatternCard
              index={1}
              title="Boundaries and complete clauses"
              body='On the Marie Curie question she chose a semicolon plus a participle phrase, "radioactivity; earning." She correctly saw that the sentence needed a break, but she did not test whether both sides of the punctuation were complete sentences. The correct answer added "and she earned," which makes a second full clause.'
              fix="A single habit: at every punctuation choice, check whether each side is a complete sentence on its own."
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
              fix="The classic move: cross out the long descriptive phrase in the middle and match the verb to the real subject."
            />
          </div>

          <p style={{ marginTop: 24 }}>
            As far as order of importance is concerned, I&apos;d estimate she&apos;s losing the
            following, based on how frequently those questions occur across each module of the SAT and
            their difficulty level:
          </p>
          <PriorityList items={RW_PRIORITY} />
          <p>
            In the SAT Improvement Plan we would tutor her until she&apos;s reached the required level of
            accuracy, attacking one skill at a time, starting with the one costing the most points.
          </p>
        </section>

        <section className="soha-report__section" id="soha-math">
          <SectionHead num="03" title="Math Performance" />

          <p>
            Her math is stronger than her reading and writing, and she&apos;s benefiting significantly
            from her usage of the built-in Desmos calculator. However, she pulls up and uses the
            calculator by default for basically every math question. The problem with this is that
            she&apos;ll often start plugging equations or problems into the calculator that are not
            solvable by the calculator and then get stuck. So her very strength is also her weakness.
            We need to help her identify when a problem is not eligible or solvable with the built-in
            calculator and then teach her how to solve it by hand.
          </p>
          <p>
            She missed a total of 6 math questions, however unlike reading and writing, her misses
            were less evenly distributed across difficulty levels. She achieved 100% accuracy on easy
            questions and only missed 2 medium difficulty questions (14 correct out of 16 total). Out
            of the questions that she&apos;s getting incorrect, they trace back to two specific
            habits, and some minor content gaps.
          </p>

          <MissTable rows={MATH_MISS_TABLE} />
          <p className="soha-report__tnote">
            Correct answer vs. answer marked · 6 math misses across both modules.
          </p>

          <h3 className="soha-report__gap-title">Gap 1: Factoring and the factor theorem</h3>
          <p>
            She struggles with questions that require factoring or the factor theorem, the same
            questions she was trying to plug into the calculator to solve which needed to be factored
            by hand. Three of her six math misses are factoring or factor-theorem questions where the
            move is algebra by hand, and the calculator either cannot get there or actively leads her to
            the wrong conclusion.
          </p>

          <WorkedExample />

          <p>
            The same pattern produced two more misses. Module 2 Q20 gives that x + 2a is a factor of
            f(x) and asks for a. The move is the factor theorem: if x + 2a is a factor, then f(-2a) =
            0, which solves to a = 3/2. She answered 5/2. And Module 1 Q9, the nonlinear (quadratic)
            equation she spent 333 seconds on, which was due to both a quadratic / zero product property
            miss and a factoring miss.
          </p>
          <p>
            For quadratic equations, she&apos;s not defaulting to the zero product property to solve
            them. She never once moved everything to one side. She also missed that it had a shared
            &ldquo;chunk&rdquo; which she should&apos;ve factored out. Then finally she missed that once
            everything was on one side and properly factored, she should implement the zero product
            property. For Math Module 1 Q9, the issue was not &ldquo;she doesn&apos;t understand
            quadratics.&rdquo; It was more specifically a setup and strategy issue: she did not
            recognize the equation needed to be rearranged into zero-product form.
          </p>

          <h3 className="soha-report__gap-title">Gap 2: Geometry beyond the formula sheet</h3>
          <p>
            The second area I saw her struggling, even for some questions she got right (one of them I
            believe she guessed on), was geometry for problems which cannot be solved using the
            built-in formula sheet. On Module 2 Q12, a cube has a volume of 125,000 cubic units and
            the question asks for its surface area. The path is side = cube root of 125,000 = 50, then
            surface area = 6 times 50² = 15,000. She answered 25,000, which means the setup was
            off. The cube volume and surface-area relationships are not on the SAT formula sheet, so
            this question rewards remembering the concept, not looking it up. She leaned on the formula
            sheet and calculator, but struggled when problems required her to remember something from
            courses she likely took 1+ years ago that could not be solved with either resource.
          </p>
          <p>
            To resolve for this, I&apos;ll take the time to re-teach or refresh her on any gaps she has
            on solving quadratic equations and on geometry concepts she needs to know which are not
            provided in the formula sheets.
          </p>

          <h3 className="soha-report__gap-title">Two remaining misses</h3>
          <div className="soha-report__misslines">
            <div className="soha-report__missline">
              <span className="soha-report__missline-star">✦</span>
              <div>
                <span className="soha-report__missline-q">Module 2 Q16</span>, a hard algebra question
                about three collinear points, where the move is to set the two slopes equal and simplify
                to ak + bh = hk. I believe her error here was her inability to simplify the equation
                accurately.
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

        <section className="soha-report__section" id="soha-behavior">
          <SectionHead num="04" title="Test-Taking Behavior" />

          <HabitsGrid />

          <p style={{ marginTop: 24 }}>
            <b>First, how she reviews.</b> She finished early and went back over her answers. On a
            school test I would encourage that. On a test that runs two hours and fourteen minutes, I
            would not have her review every Reading and Writing question twice. Switching back and
            forth between question types drains mental stamina, and that fatigue carries into the math
            section where she needs it most. Two facts from her own session make the case. During
            review she mostly did not change her answers, so the second pass added almost nothing. And
            the one Reading and Writing answer she did change, Q22, she changed from right to wrong, and
            that is an easy question in Module 1, so it is also her most expensive miss in the section.
            The review habit did not just fail to help. On the one question it touched, it cost her the
            most valuable point. My recommendation: one careful pass, use mark for review only for
            questions she is truly unsure of, and bank the leftover time and energy for math.
          </p>
          <p>
            <b>Second, her starting to plug in numbers/equations/expressions into the calculator</b>{" "}
            without first identifying what type of math question it is and whether it can be solved
            using the built-in calculator. We can do some drills to make this more automatic for her,
            so that every time she sees a question as she&apos;s reading it she can quickly identify if
            she should or shouldn&apos;t use the calculator.
          </p>

          <p className="soha-report__plan-link">
            For projected scores, checkpoints, and the week-by-week schedule, see the{" "}
            <Link href="/soha/plan">SAT Improvement Plan</Link> tab.
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
