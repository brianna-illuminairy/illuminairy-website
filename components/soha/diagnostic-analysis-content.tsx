import Link from "next/link";
import type { ReactNode } from "react";
import {
  AccuracyByDifficulty,
  GoalRangeVisual,
  MathMissHabits,
  MathStatsStrip,
  RwMissBreakdown,
  ScoreOverviewCards,
  ScoringModelCompare,
  SectionScoreCompare,
  TotalScoreScale,
  TutoringPriorityLadder,
  WeeklyProgramStrip,
} from "@/components/soha/diagnostic-visuals";

function MissLine({
  difficulty,
  children,
}: {
  difficulty?: "easy" | "medium" | "hard";
  children: ReactNode;
}) {
  const cls = difficulty
    ? `soha-diag__plain-miss soha-diag__plain-miss--${difficulty}`
    : "soha-diag__plain-miss";
  return <li className={cls}>{children}</li>;
}

function PatternBlock({ index, title, body }: { index: number; title: string; body: string }) {
  return (
    <div className="soha-diag__pattern">
      <span className="soha-diag__pattern-num" aria-hidden="true">
        {index}
      </span>
      <div>
        <h4>{title}</h4>
        <p>{body}</p>
      </div>
    </div>
  );
}

export function SohaDiagnosticAnalysisContent() {
  return (
    <article className="soha-diag">
      <header className="soha-diag__hero">
        <p className="danielle-portal__eyebrow">Illuminairy · Skill Diagnostic</p>
        <h1>Diagnostic analysis</h1>
      </header>

      <nav className="soha-diag__toc" aria-label="On this page">
        <a href="#soha-overall">Overall</a>
        <a href="#soha-rw">Reading and Writing</a>
        <a href="#soha-math">Math</a>
        <a href="#soha-behavior">Test habits</a>
        <a href="#soha-realistic">What to expect</a>
      </nav>

      <section className="soha-diag__panel" id="soha-overall" aria-labelledby="soha-overall-h">
        <h2 id="soha-overall-h">Overall performance</h2>

        <p>
          Based on the full-length diagnostic taken June 17, 2026, with all four modules complete.
        </p>

        <ScoreOverviewCards />
        <TotalScoreScale />
        <SectionScoreCompare />

        <ul className="soha-diag__score-lines">
          <li>
            <strong>Total score:</strong> 1380 to 1430
          </li>
          <li>
            <strong>Reading and Writing:</strong> 670 to 690 (Module 1: 25 of 27, Module 2: 22 of
            27)
          </li>
          <li>
            <strong>Math:</strong> 710 to 740 (Module 1: 21 of 22, Module 2: 17 of 22)
          </li>
        </ul>

        <p className="soha-diag__subhead">By difficulty</p>
        <AccuracyByDifficulty />
        <ul className="soha-diag__score-lines">
          <li>Reading and Writing, 47 of 54: 88% easy, 87% medium, 87% hard</li>
          <li>Math, 38 of 44: 100% easy, 88% medium, 73% hard</li>
        </ul>

        <p>
          Soha is performing in the upper 1300s to the lower 1400s; we estimate her current
          performance is between 1380 and 1430. Her math is stronger than her reading and writing;
          she scored 710-740 on math and 670-690 on reading and writing.
        </p>

        <div className="soha-diag__alert">
          <p>
            One area of concern was that she got a total of 4 medium and easy questions incorrect on
            reading and writing, which means there&apos;s still some risk that on test day, if she
            performs similarly, she could end up not testing into the hard version of Module 2
            Reading and Writing. If she misses the cutoff, that can cap her score and could cost her
            up to 130 points alone.
          </p>
        </div>
      </section>

      <section className="soha-diag__panel" id="soha-rw" aria-labelledby="soha-rw-h">
        <h2 id="soha-rw-h">Reading and writing performance</h2>

        <p>
          Moving into her section-level performance for reading and writing, she missed 7 total
          questions. She got 3 standard English convention questions incorrect, 2 of which were on
          boundaries. She also got 2 questions incorrect on transitions and 2 incorrect on command of
          evidence.
        </p>
        <RwMissBreakdown />
        <p>
          Here is what she missed, sorted by difficulty, because difficulty is what determines the
          cost.
        </p>

        <p className="soha-diag__group-label">Module 1</p>
        <ul className="soha-diag__miss-list">
          <MissLine difficulty="easy">
            <strong>Q22 Transitions: Easy.</strong> This is the single most expensive miss in the
            section. She also changed this answer during review, from a likely-correct choice to the
            wrong one. More on that below.
          </MissLine>
          <MissLine difficulty="medium">
            <strong>Q18 Boundaries: Medium.</strong>
          </MissLine>
        </ul>

        <p className="soha-diag__group-label">Module 2</p>
        <ul className="soha-diag__miss-list">
          <MissLine difficulty="medium">
            <strong>Q22 Subject-Verb Agreement: Medium</strong>
          </MissLine>
          <MissLine difficulty="medium">
            <strong>Q23 Transitions: Medium</strong>
          </MissLine>
          <MissLine difficulty="hard">
            <strong>Q12 Command of Evidence: Hard</strong>
          </MissLine>
          <MissLine difficulty="hard">
            <strong>Q14 Command of Evidence: Hard</strong>
          </MissLine>
          <MissLine difficulty="hard">
            <strong>Q20 Boundaries: Hard</strong>
          </MissLine>
        </ul>

        <ScoringModelCompare />

        <div className="soha-diag__insight">
          <p>
            Read at face value, it looks like her biggest problem is hard Command of Evidence
            questions, since that has the highest raw count of mistakes. Through the SAT scoring
            model, the opposite is true. The three hard misses in Module 2 do not cost her as many
            points as easy questions on Module 1. The question which likely cost her the most
            points was the easy transition question she missed in Module 1 followed by the three
            medium misses. Those are the ones that actually move her score the most, and the easy
            miss is the one that also puts her routing at risk.
          </p>
          <p>
            Across every question she missed, the core underlying issue was the same. She was choosing
            answers that were locally plausible but did not satisfy the full sentence or the full
            claim.
          </p>
        </div>

        <p className="soha-diag__subhead">Four specific versions of this</p>
        <PatternBlock
          index={1}
          title="Boundaries and complete clauses"
          body='On the Marie Curie question she chose a semicolon plus a participle phrase, "radioactivity; earning." She correctly saw that the sentence needed a break, but she did not test whether both sides of the punctuation were complete sentences. The correct answer added "and she earned," which makes a second full clause. The fix is a single habit: at every punctuation choice, check whether each side is a complete sentence on its own.'
        />
        <PatternBlock
          index={2}
          title="Transitions"
          body='On the cortisol question she chose "For example," but the second sentence contradicts the first instead of illustrating it, so the answer was "In contrast." On the painting question she chose "Additionally," but the sentence moves to a final interpretation, so "Ultimately" fit. She is picking transitions based on whether the next sentence is related, rather than naming the exact relationship first. The fix is to label the relationship before looking at the choices: contrast, example, result, addition, conclusion, or alternative.'
        />
        <PatternBlock
          index={3}
          title="Command of Evidence"
          body='On the CO2 table she picked an answer about process emissions, but the claim was about total emissions and the "necessary but not sufficient" logic. On the Kurosawa question she picked a true fact about scholars analyzing his films, but the claim needed evidence that the diverse later works reflect his own hybrid approach. Both answers were factually tied to the passage but not matched to the specific claim. The fix is to restate the exact claim before reading the choices, then reject anything that is true but off-claim.'
        />
        <PatternBlock
          index={4}
          title="Subject-verb agreement with interrupting phrases"
          body='On the Henrietta Swan Leavitt question she chose "has remained," matching the nearby singular name, but the real subject was the plural "observations." The fix is the classic move: cross out the long descriptive phrase in the middle and match the verb to the real subject.'
        />

        <p className="soha-diag__subhead">Order of importance</p>
        <TutoringPriorityLadder />
        <p>As far as order of importance is concerned, I&apos;d estimate she&apos;s losing:</p>
        <ul className="soha-diag__score-lines">
          <li>Transitions X pts</li>
          <li>Boundaries X pts</li>
          <li>Command of Evidence X pts</li>
          <li>Subject-Verb Agreement X pts</li>
        </ul>
        <p>
          We would plan to attack them in priority order until she&apos;s able to answer the easy,
          medium, and hard questions at 95% accuracy before moving on to the next topic.
        </p>
      </section>

      <section className="soha-diag__panel" id="soha-math" aria-labelledby="soha-math-h">
        <h2 id="soha-math-h">Math performance</h2>

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
          she&apos;s getting incorrect, they trace back to two specific habits, and some minor
          content gaps.
        </p>
        <MathStatsStrip />
        <MathMissHabits />

        <p className="soha-diag__subhead">
          The big one: she runs to the calculator on problems that need algebra
        </p>
        <p>
          This showed up across Module 2 and is the highest-value fix because it hits her most
          frequent question types. Three of her six math misses are factoring or factor-theorem
          questions where the move is algebra by hand, and the calculator either cannot get there or
          actively leads her to the wrong conclusion.
        </p>
        <p>
          The clearest example is Module 2 Q13. The question gives 9x³ - 6x² - 24x and says 3x + k
          is a factor, then asks for k. The path is to factor: 9x³ - 6x² - 24x = 3x(3x² - 2x - 8) =
          3x(x - 2)(3x + 4), so 3x + k matches 3x + 4 and k = 4. Instead of factoring, she tried to
          graph her way to the answer and entered 13.15, which was a point where two curves crossed
          on the graphing calculator. There is no graphing path to k here. The question is built to
          reward factoring, and the calculator pulled her away from it.
        </p>
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

        <p className="soha-diag__subhead">
          Next: She&apos;s not defaulting to the zero product property for solving quadratic
          equations
        </p>
        <p>
          She struggled with a Module 1 math problem for over 3 minutes trying to figure it out when
          her setup was incorrect. For Math Module 1 Q9, the issue was not &quot;she doesn&apos;t
          understand quadratics.&quot; It was more specifically a setup and strategy issue: she did
          not recognize the equation needed to be rearranged into zero-product form.
        </p>

        <p className="soha-diag__subhead">
          The second leak: geometry setup from memory, not just from the formula sheet
        </p>
        <p>
          On Module 2 Q12, a cube has a volume of 125,000 cubic units and the question asks for its
          surface area. The path is side = cube root of 125,000 = 50, then surface area = 6 times
          50² = 15,000. She answered 25,000, which means the setup was off. The cube volume and
          surface-area relationships are not on the SAT formula sheet, so this question rewards
          remembering the concept, not looking it up. The read here is that she leaned on the formula
          sheet and calculator, but the core setup was not there to begin with. Worth noting: she
          got every circle question right (Module 1 Q13 and Q21, Module 2 Q10), so this is
          specifically an area-and-volume setup gap, not geometry across the board. The fix is a
          focused geometry concept refresh so she has the concept and the tools, not only the tools.
          It&apos;s common for kids who haven&apos;t touched geometry in a couple of years to
          struggle here.
        </p>

        <p className="soha-diag__subhead">Two other misses round out the math</p>
        <p>
          Module 2 Q16, a hard algebra question about three collinear points, where the move is to
          set the two slopes equal and simplify to ak + bh = hk. She picked a manipulation that did
          not simplify correctly. This is the same precision theme as her Reading and Writing
          misses, applied to algebra.
        </p>
        <p>
          Module 2 Q22, a profit and loss proportional-reasoning question (sell part at a loss, then
          find the profit percent needed on the rest to net 20%). This one is very teachable, but
          these multi-step proportional questions do not appear often on the SAT, so I would schedule
          it closer to the test date, after factoring is solid, since factoring affects far more
          questions.
        </p>
        <p>
          My primary focus would be on getting her factoring and all factoring edge/hard cases done
          so that she doesn&apos;t miss problems on equivalent expressions, the factor theorem, or
          quadratic equations that require factoring. And this has to be taught since they cannot be
          done on the calculator. My secondary focus would be geometry refresh for questions that
          cannot be solved solely using the built-in formula sheet.
        </p>
      </section>

      <section className="soha-diag__panel" id="soha-behavior" aria-labelledby="soha-behavior-h">
        <h2 id="soha-behavior-h">Test-taking behavior</h2>

        <div className="soha-diag__habits">
          <div className="soha-diag__habit-col">
            <h3>Strong habits worth keeping</h3>
            <ul>
              <li>Fast, efficient pace</li>
              <li>Used the mark for review tool well</li>
              <li>Comfortable with Desmos and the calculator</li>
              <li>Used the built-in formula sheet</li>
              <li>Used scratch paper when she needed it</li>
            </ul>
          </div>
          <div className="soha-diag__habit-col">
            <h3>Two habits to adjust</h3>
            <ul>
              <li>
                <strong>First, how she reviews.</strong> She finished early and went back over her
                answers. On a school test I would encourage that. On a test that runs two hours and
                fourteen minutes, I would not have her review every Reading and Writing question
                twice. Switching back and forth between question types drains mental stamina, and
                that fatigue carries into the math section where she needs it most. Two facts from
                her own session make the case. During review she mostly did not change her answers,
                so the second pass added almost nothing. And the one Reading and Writing answer she
                did change, Q22, she changed from right to wrong, and that is an easy question in
                Module 1, so it is also her most expensive miss in the section. The review habit did
                not just fail to help. On the one question it touched, it cost her the most valuable
                point. My recommendation: one careful pass, use mark for review only for questions
                she is truly unsure of, and bank the leftover time and energy for math.
              </li>
              <li>
                <strong>Second, her default to the calculator on algebra problems,</strong> which I
                cover in the math section. Her tool use is strong when the problem suits it. The
                change is knowing when to put the calculator down and factor.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="soha-diag__panel" id="soha-realistic" aria-labelledby="soha-realistic-h">
        <h2 id="soha-realistic-h">What score is realistic</h2>

        <GoalRangeVisual />
        <WeeklyProgramStrip />

        <p>
          Based on her gaps being fairly concentrated, I&apos;m confident that in the 9 weeks
          between now and test day she could reach the upper 1400s, say 1480, no problem. I also
          think if she really pushed and put in the work we could get her into the 1500s. To get
          into the 1500s requires near-perfect performance, but I feel strongly she&apos;s a
          candidate for that level of performance. I think it would take 3 tutoring sessions a week,
          where the first 2 are tutoring and reteaching concepts and approaches, then the final
          we&apos;d test what she&apos;d learn. We&apos;d also use the tutoring lessons to go over
          questions she got wrong, show her how to do them correctly, and then have her practice
          until she was able to solve them correctly and accurately for easy, medium, and hard by
          herself for several in a row. Her final tutoring session each week would be a timed module
          test where she&apos;d complete a full set of math or reading and writing problems, and
          then afterwards we would review and discuss any of the questions she got wrong. I&apos;d
          expect her to complete 100 problems or more each week and around 1000 total problems
          between now and test day to hit 1500+. Each week I&apos;d report back on her improvements
          in accuracy and her estimated score improvement for that week.
        </p>

        <p className="soha-diag__note">
          The week-by-week schedule is on the{" "}
          <Link href="/soha/plan" className="soha-diag__inline-link">
            Study Plan
          </Link>{" "}
          tab.
        </p>
      </section>

      <section className="soha-diag__appendix" aria-labelledby="soha-appendix-h">
        <h2 id="soha-appendix-h">Raw reports</h2>
        <p>PDF exports from the June 17 diagnostic session.</p>
        <div className="soha-diag__doc-links">
          <Link href="/soha/diagnostic/full">Full report →</Link>
          <Link href="/soha/diagnostic/tabular">Tabular report →</Link>
        </div>
      </section>
    </article>
  );
}
