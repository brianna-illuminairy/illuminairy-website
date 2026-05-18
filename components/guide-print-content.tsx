import { flagshipGuideCopy } from "@/lib/flagship-guide-copy";
import {
  getFlagshipSchool,
  type FlagshipSchoolId
} from "@/lib/georgia-flagship-scores";
import {
  digitalSatTestingLabel,
  digitalSatTestingMinutes,
  satLengthMultipleOf,
  typicalClassTestMinutes
} from "@/lib/digital-sat-timing";
import { getSummerPlanExamDay, getSummerSatPhases } from "@/lib/sat-summer-timeline";
import { parentSatCopy } from "@/lib/parent-sat-copy";
import { site } from "@/lib/site";
import type { LeadMagnetSlug } from "@/lib/lead-magnets";

export function GuidePrintContent({ slug }: { slug: LeadMagnetSlug }) {
  return (
    <>
      <p className="guide-doc-lead">Illuminairy · illuminairy.com</p>
      {slug === "uga-sat-score" && <FlagshipSchoolGuide schoolId="uga" />}
      {slug === "georgia-tech-sat-score" && (
        <FlagshipSchoolGuide schoolId="georgia-tech" />
      )}
      {slug === "emory-sat-score" && <FlagshipSchoolGuide schoolId="emory" />}
      {slug === "rising-junior-summer-timeline" && <SummerTimelineGuide />}
      {slug === "module-2-pacing-check" && <Module2PacingGuide />}
      <footer className="guide-doc-footer print:break-inside-avoid">
        <p>
          © {new Date().getFullYear()} Zytech Development LLC (Illuminairy). For personal
          use only. Score data cited from official sources; verify before applying.
        </p>
        <p className="mt-2">
          illuminairy.com · Atlanta, GA · For personal use only.
        </p>
      </footer>
    </>
  );
}

function FlagshipSchoolGuide({ schoolId }: { schoolId: FlagshipSchoolId }) {
  const school = getFlagshipSchool(schoolId);
  const copy = flagshipGuideCopy[schoolId];
  const shortName =
    schoolId === "georgia-tech"
      ? "Georgia Tech"
      : schoolId === "emory"
        ? "Emory"
        : "UGA";

  return (
    <>
      <h1 className="!mt-4 !text-[1.75rem] !font-light !text-ink">{copy.title}</h1>
      <p className="!text-ink-soft">{copy.lead}</p>

      <h2>{copy.scoresHeading}</h2>
      <table>
        <thead>
          <tr>
            <th>Percentile</th>
            <th>Total SAT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>25th</td>
            <td>{school.composite25}</td>
          </tr>
          <tr>
            <td>50th (typical)</td>
            <td>{school.composite50}</td>
          </tr>
          <tr>
            <td>75th</td>
            <td>{school.composite75}</td>
          </tr>
        </tbody>
      </table>
      <p className="!text-[13px] !text-ink-soft">
        Source:{" "}
        <a href={school.sourceUrl} className="text-gold-deep">
          {school.sourceLabel}
        </a>{" "}
        ({school.dataAsOf}).
      </p>
      {school.sectionNote && <p>{school.sectionNote}</p>}
      {school.testPolicyNote && <p>{school.testPolicyNote}</p>}

      <h2>{copy.worksheetHeading}</h2>
      <p>{copy.worksheetIntro}</p>
      <ul>
        <li>Best SAT total (official or best Bluebook full-length): ________</li>
        {schoolId === "georgia-tech" && (
          <li>Math section score (from the same test): ________</li>
        )}
        <li>Unweighted GPA (or school scale): ________</li>
        <li>Weighted GPA (if your school reports one): ________</li>
        <li>
          Rigor check — AP / IB / Honors / dual enrollment (circle): light · moderate ·
          heavy
        </li>
        <li>Georgia resident applying in-state? yes / no</li>
      </ul>

      <h2>{copy.compareHeading}</h2>
      <p>{copy.compareBody}</p>
      <p>
        Quick SAT check against {shortName}&apos;s table: below {school.composite25} ·
        between {school.composite25} and {school.composite50} · between {school.composite50}{" "}
        and {school.composite75} · above {school.composite75}.
      </p>

      <h2>{parentSatCopy.summerRaiseScoreHeading}</h2>
      <p className="!mb-4 !font-medium !text-ink">{copy.summerHeading}</p>
      <SchoolSummerNotes schoolId={schoolId} school={school} />

      <h2>{parentSatCopy.worksBeforeTestDayHeading}</h2>
      <p>
        <strong>{parentSatCopy.worksBeforeTestDayHelpsLabel}:</strong>{" "}
        {parentSatCopy.worksBeforeTestDayHelps}.
      </p>
      <p>
        <strong>{parentSatCopy.worksBeforeTestDayDoesNotLabel}:</strong>{" "}
        {parentSatCopy.worksBeforeTestDayDoesNot}.
      </p>
      <p className="!font-medium !text-ink">
        Illuminairy does not guarantee SAT scores or admission to {shortName}.
      </p>
      <p className="!text-ink-soft">
        Other Georgia schools? illuminairy.com/guides · Free parent call:
        illuminairy.com/get-started
      </p>
    </>
  );
}

function SchoolSummerNotes({
  schoolId,
  school
}: {
  schoolId: FlagshipSchoolId;
  school: ReturnType<typeof getFlagshipSchool>;
}) {
  const p25 = school.composite25;
  const p50 = school.composite50;
  const p75 = school.composite75;

  if (schoolId === "emory") {
    return (
      <ul>
        <li>
          <strong>3.8+ GPA, score under {p25}:</strong> Many families apply test-optional
          and put energy into essays, rigor, and activities instead of cramming the SAT at
          the last minute.
        </li>
        <li>
          <strong>Strong GPA, score near {p50}–{p75}:</strong> Submitting often helps the
          file read the way you expect at a selective private.
        </li>
        <li>
          <strong>Below ~{p25 - 120} today:</strong> A meaningful score increase over the
          summer is possible with consistent work, but plan section-by-section — not a
          last-week cram.
        </li>
        <li>
          <strong>Near {p50}–{p75}:</strong> Fine-tune timing and Module 2 stamina; submitters
          at Emory often cluster at the high end.
        </li>
      </ul>
    );
  }

  if (schoolId === "georgia-tech") {
    return (
      <ul>
        <li>
          <strong>High GPA, Math SAT lagging:</strong> Common Tech worry — fix Math and
          Module 2 pacing first; the total often follows.
        </li>
        <li>
          <strong>Total under {p25}:</strong> Twelve focused weeks can help many students
          bring the total up by about 100–150 points — not everyone, not guaranteed.
        </li>
        <li>
          <strong>Between {p25} and {p50}:</strong> Push Math precision and Module 2 pacing;
          that combination often helps push the total into Tech&apos;s typical range.
        </li>
        <li>
          <strong>Near {p50}–{p75}:</strong> Protect the score with full-length stamina and
          fewer careless errors — not more random practice tests.
        </li>
      </ul>
    );
  }

  return (
    <ul>
      <li>
        <strong>~3.8+ GPA, SAT still under {p25}:</strong> UGA will weigh rigor — but you
        likely need a stronger score on the August test, not hope alone.
      </li>
      <li>
        <strong>SAT between {p25} and {p50}:</strong> Section work (especially Module 2)
        often matters more than another untimed practice test.
      </li>
      <li>
        <strong>Near {p50}–{p75}:</strong> Protect and push — trap answers and stamina — not a
        marketed &quot;+150 for everyone&quot; promise.
      </li>
    </ul>
  );
}

function SummerTimelineGuide() {
  const phases = getSummerSatPhases();
  const exam = getSummerPlanExamDay();

  return (
    <>
      <h1 className="!mt-4 !text-[1.75rem] !font-light !text-ink">
        August SAT study plan — phases before the {site.satDate} test
      </h1>
      <p className="!text-ink-soft">
        This is a plan you can run on your own — diagnose gaps, cover the content the SAT
        actually tests, practice by topic, take full-length adaptive tests on Bluebook, then
        train pacing and Module 2 stamina. Most families do not have every piece assembled
        (problem sets by skill, lessons for each domain, someone reviewing every miss) — so
        they hire a program. Either way, the sequence below is what works.
      </p>

      <p className="!text-ink-soft">
        <strong>How long each phase takes</strong> depends on how many weeks you have before
        test day. Keep the <em>order</em> — if you are short on time, compress Learn and
        Practice; do not skip Baseline or Diagnose.
      </p>

      {phases.map((phase) => (
        <section key={phase.title}>
          <h2>{phase.title}</h2>
          <p className="!text-ink-soft">
            <strong>{phase.focus}.</strong>
          </p>
          <ul>
            {phase.tasks.map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ul>
        </section>
      ))}

      <p>
        <strong>Exam day:</strong> {exam.weekday}, {exam.dateLabel}.
      </p>

      <h2>What you need to execute this yourself</h2>
      <ul>
        <li>
          <strong>Full-length practice:</strong> College Board Bluebook (free) — adaptive,
          timed, same interface as test day. Aim for several full lengths from baseline
          through Phase 5 (for example after baseline, mid-learn, after mixed practice, and one
          dress rehearsal).
        </li>
        <li>
          <strong>Questions by topic:</strong> Official Question Bank in Bluebook and/or Khan
          Academy SAT — assigned by skill, not random worksheets.
        </li>
        <li>
          <strong>Content for every domain:</strong> Lessons or a book that covers all R&W and
          Math categories on the test — skipping “grammar week” is how scores stall.
        </li>
        <li>
          <strong>Error log:</strong> Spreadsheet or notebook — miss type, section, timed or
          not, fix on the second pass.
        </li>
        <li>
          <strong>Pacing drills:</strong> Timed modules and Module-2-style hard sets — see our{" "}
          <em>digital SAT checklist</em> guide on illuminairy.com/guides for what to watch.
        </li>
        <li>
          <strong>Time:</strong> While Learn and Practice are active, many families need about
          8–12 focused hours per week — less only works if the baseline is already very high.
        </li>
      </ul>

      <h2>Before you start</h2>
      <ul>
        <li>Block recurring study slots on the family calendar — summer camps and travel eat
          the plan.</li>
        <li>Download Bluebook and run a device check (charge, updates, approved calculator).</li>
        <li>Pick one place for the error log and stick to it.</li>
      </ul>

      <h2>What to track as you go (parent checklist)</h2>
      <ul>
        <li>Hours actually spent vs. planned.</li>
        <li>Topics covered (not “studied SAT” — which domains).</li>
        <li>Practice tests completed and scores (total + sections).</li>
        <li>Miss types that keep repeating — those need a lesson or a 1:1, not more volume.</li>
      </ul>

      <h2>{parentSatCopy.summerRaiseScoreHeading}</h2>
      <ul>
        <li>
          <strong>Starting near 1200s:</strong> Raising the total by about 100–150 points is
          plausible with steady hours and real mistake review — not everyone, not promised.
        </li>
        <li>
          <strong>Starting mid-1300s:</strong> Section-specific work toward UGA / Georgia Tech
          ranges; another 150 points on the total is less common.
        </li>
        <li>
          <strong>Starting 1400+:</strong> Pacing and Module 2 matter more than more content
          videos.
        </li>
      </ul>

      <h2>When families outsource instead</h2>
      <p className="!text-ink-soft">
        The plan above is doable with discipline. What is hard to DIY is assembling it every
        week: the right practice problems, live teaching for weak domains, full-length tests on
        schedule, pacing curriculum, and someone who reviews misses so the same errors stop.
        That is what twelve-week SAT programs (including Illuminairy&apos;s August {site.satDate}{" "}
        Accelerator) are selling — not a secret test hack. If you run it yourself, hold yourself
        to the phase order. If you hire help, ask whether their plan maps to baseline → diagnose
        → learn → practice → pace → taper, not random sessions.
      </p>
    </>
  );
}

function Module2PacingGuide() {
  return (
    <>
      <h1 className="!mt-4 !text-[1.75rem] !font-light !text-ink">
        When the practice score looked good — what parents can check at home
      </h1>
      <p className="!text-ink-soft">
        Parents tell us the same pattern: strong Bluebook scores at home, then a lower score
        on the official SAT. We see it constantly — students who <strong>know the content</strong>{" "}
        but cannot figure out how to <strong>finish the section without running out of time</strong>.
        That gap usually does not mean they “don’t test well.” School trains one kind of exam;
        the digital SAT tests another.
      </p>
      <p className="!text-ink-soft">
        The SAT is not only a content test. It also tests whether your student can:
      </p>
      <ol>
        <li>
          <strong>Quickly identify question patterns</strong> and choose an approach before
          the clock wins
        </li>
        <li>
          <strong>Use the calculator and on-screen tools</strong> to work quickly and
          accurately — not do everything by hand
        </li>
        <li>
          <strong>Maintain an intensive pace</strong> for a long, switching, adaptive exam —
          about {digitalSatTestingLabel} — not a {typicalClassTestMinutes[1]}-minute class test
        </li>
      </ol>
      <p className="!text-ink-soft">
        Those are trainable skills. Below is what to watch for at home while they practice
        the real format on Bluebook (laptop, timer, tools).
      </p>

      <h2>1. Question patterns — can they name it and pick a move?</h2>
      <p className="!text-ink-soft">
        Classroom tests often reward showing work step by step. The SAT rewards recognizing
        the pattern in seconds: “systems,” “plug in (C),” “main idea vs. evidence,” “grammar
        rule” — then executing. Without that training, every question feels brand new and
        time disappears.
      </p>
      <p className="!text-ink-soft">
        <strong>Math — what to listen for after a miss:</strong> Can they say the type in a
        few words? Percent / ratio; linear equation or slope; system of two equations;
        quadratic; right triangle; “which graph matches”; plug in the answers.
      </p>
      <ul>
        <li>
          <strong>Vague answer (“just math”):</strong> They are not pattern-matching yet.
        </li>
        <li>
          <strong>Always solves from scratch:</strong> No faster move — test (C), graph in
          Desmos, estimate — even when one would save a minute.
        </li>
      </ul>
      <p className="!text-ink-soft">
        <strong>Reading &amp; Writing — same idea, different patterns:</strong>
      </p>
      <ul>
        <li>
          Reads the whole passage when the question only needs one paragraph or line.
        </li>
        <li>
          Cannot name what the question wants: main idea, evidence pair, vocabulary in
          context, standard English convention — each has a different move.
        </li>
        <li>
          Spends equal time on every item instead of marking hard ones and returning.
        </li>
      </ul>

      <h2>2. Tools — Desmos and the reference sheet for speed and accuracy</h2>
      <p className="!text-ink-soft">
        School math tests rarely reward opening a graphing calculator on screen or an official
        formula sheet mid-problem. The digital SAT does — every student has{" "}
        <strong>Desmos</strong> and an <strong>on-screen reference sheet</strong> built in.
        That is not cheating; it is how the exam is designed to be taken.
      </p>
      <ul>
        <li>
          <strong>Doing everything by hand:</strong> Long algebra on paper-style homework
          carries over. On the screen they rarely open Desmos even for lines, systems,
          quadratics, or “which answer fits” problems where graphing or plugging in is
          faster.
        </li>
        <li>
          <strong>Never opening the reference sheet:</strong> They memorize or guess instead
          of checking a provided formula (for example area, special right triangles, circle
          equations) when the sheet would save thirty seconds.
        </li>
        <li>
          <strong>No “backup plan”:</strong> When their first approach stalls, they stay
          stuck instead of trying answer choices, estimating, or graphing the equation in
          Desmos.
        </li>
      </ul>
      <p className="!text-ink-soft">
        <strong>What to watch in one practice session:</strong> Count how many times they
        open Desmos or the reference sheet. Zero opens on a full math module usually means
        they are still testing the school way — not the SAT way — even when they know the
        math.
      </p>

      <h2>3. Intensive pace — finishing before time runs out</h2>
      <p className="!text-ink-soft">
        Each section has two timed parts. Do well on the first, and the second is usually
        harder — that is built into how the SAT tests. Students who have only practiced
        school-style pacing often cannot keep a <strong>steady pace</strong> through Module 2
        and the full exam. You do not need their score report to notice a training gap — watch
        one timed Bluebook session and listen to how they come out of it.
      </p>
      <p className="!text-ink-soft">
        <strong>What you can actually see or hear at home</strong> (not guesses about how
        scores “slid”):
      </p>
      <ul>
        <li>
          <strong>During practice:</strong> they slow down, sigh, or say questions “got
          harder” or “make no sense” as the clock runs — especially on the second module of a
          section.
        </li>
        <li>
          <strong>Stress shows up:</strong> frustrated, shut down, or wants to quit before
          time is called — not just “tired after a long day.”
        </li>
        <li>
          <strong>Afterward, they tell you:</strong> “I ran out of time,” “I panicked at the
          end,” or “the second part was way harder” — that is their experience, not something
          you have to infer from a score chart.
        </li>
        <li>
          <strong>They cannot say what went wrong</strong> on the last few problems (“I don’t
          know, I just rushed”) — often a patterns-and-tools gap, not mysterious test-day
          failure.
        </li>
        <li>
          <strong>Short practice is fine; full length is not:</strong> they will do a
          worksheet or untimed set but avoid a timed module or full test on the laptop — you
          can see that without any score data.
        </li>
        <li>
          <strong>Wrong setup:</strong> paper, phone, or untimed work — not Bluebook on the
          laptop with the real timer.
        </li>
      </ul>
      <p className="!text-ink-soft">
        If they later share that a practice score was higher than the official test, that
        fits this picture — but you are not diagnosing “mistakes piling up in the last third”
        from the outside. You are listening and watching whether they are trained for harder
        modules, tools, and length.
      </p>

      <h2>School pace vs. SAT pace</h2>
      <p className="!text-ink-soft">
        The SAT asks for a <strong>steady pace</strong> across the whole exam — especially on
        the harder second module. Many students also <strong>burn out</strong> because school
        has not asked them to concentrate this intensely for{" "}
        <strong>{digitalSatTestingLabel}</strong> ({digitalSatTestingMinutes} minutes of
        testing, plus breaks). That is not a character flaw; it is a training gap you can
        close with full-length timed Bluebook practice on a schedule.
      </p>
      <p className="!text-ink-soft">
        <strong>How school tests vs. how the SAT tests:</strong>
      </p>
      <ul>
        <li>
          <strong>Class tests are usually one length:</strong> about{" "}
          {typicalClassTestMinutes.join(", ")}, or {typicalClassTestMinutes[2]} minutes — and
          teachers design them so most students can finish in the period.
        </li>
        <li>
          <strong>The SAT is much longer:</strong> about {satLengthMultipleOf(40)}× a{" "}
          {typicalClassTestMinutes[1]}-minute classroom test,{" "}
          {satLengthMultipleOf(30)}× a {typicalClassTestMinutes[0]}-minute one, or{" "}
          {satLengthMultipleOf(50)}× a {typicalClassTestMinutes[2]}-minute one — same day,
          back to back.
        </li>
        <li>
          <strong>Class tests stay in one lane:</strong> one subject or unit, one kind of
          thinking. The SAT switches from Reading &amp; Writing to Math and many question
          types — constant context switching.
        </li>
        <li>
          <strong>Class tests usually do not get harder as you go.</strong> The digital SAT
          does: if Module 1 goes well, Module 2 is often harder. Students who barely finish
          Module 1 can run out of time on Module 2 even when they know the content.
        </li>
      </ul>
      <p className="!text-ink-soft">
        Train the SAT way in order: tools and problem types on timed modules, then
        Reading &amp; Writing question types, then full-length tests — so pace and length are
        practiced, not discovered for the first time on test day.
      </p>

      <h2>Official SAT vs. Bluebook — parents do not get a miss report</h2>
      <p className="!text-ink-soft">
        After the <strong>official SAT</strong>, College Board releases scores — not which
        questions your child missed, in what order, or why. You are not supposed to diagnose
        “what went wrong on question 17.” You hear how test day felt and you see whether the
        total matches what practice suggested.
      </p>
      <p className="!text-ink-soft">
        After <strong>Bluebook practice</strong> at home, they can open the review screen and
        see missed items. The habits below are for that practice — training patterns, tools,
        and pace while the app still shows answers. Good programs use those practice misses;
        they cannot fix what the official score report never shows item by item.
      </p>

      <h2>Five-minute conversation — right after Bluebook practice</h2>
      <p className="!text-ink-soft">
        Ask while the review screen is still open (or ask them to show you three they missed).
        You are not quizzing them on the real SAT — only on what they just did in the app:
      </p>
      <ol>
        <li>
          On math: <strong>which question numbers</strong> did you open Desmos for? If none,
          which problems could you have graphed?
        </li>
        <li>Did you open the <strong>reference sheet</strong> at all? On which problem?</li>
        <li>
          In Bluebook, pick <strong>three questions you missed</strong> and name the type in a
          few words (percent, system, slope, etc.) — they show you; you are not guessing from
          a score alone.
        </li>
        <li>
          For one miss: was there a <strong>faster approach</strong> (plug in answers,
          graph, estimate) besides your first try?
        </li>
        <li>
          Reading &amp; Writing: did you read the whole passage or go straight to what the
          question asked for?
        </li>
        <li>
          When did it start to feel <strong>harder or stressful</strong> — first module,
          second module, or only at the end?
        </li>
        <li>Which question number did you first feel <strong>rushed or stuck</strong> on?</li>
        <li>
          Did you <strong>mark and return</strong> on hard items, or stay on one problem until
          time ran out?
        </li>
        <li>
          After they finish: did they <strong>open the Bluebook review</strong> and walk through
          a few misses, or shut the laptop because they were too drained? (You can see that —
          you cannot see item-level results from the official SAT.)
        </li>
        <li>
          How did they feel when they finished — calm, frustrated, or wiped? (Mood only —
          not “what they missed” on a test that only returned a score.)
        </li>
      </ol>

      <h2>One week at home — start training the SAT way</h2>
      <ul>
        <li>
          One <strong>timed math module</strong> on Bluebook on the laptop they will use on
          test day. Your only job: note Desmos opens, reference sheet opens, and long stalls
          (same problem for several minutes).
        </li>
        <li>
          Pick <strong>one math rule</strong> for the next session, for example: “Open Desmos
          on every equation or graph question” or “If stuck past ninety seconds, mark it and
          move on.”
        </li>
        <li>
          Pick <strong>one approach rule</strong>: “Before solving, say the problem type out
          loud” or “On multiple choice, try plugging in (B) or (C) before full algebra.”
        </li>
        <li>
          Together in <strong>Bluebook’s review screen</strong>, pick three missed questions
          and write: question #, type (if they can name it), used Desmos (yes/no), used
          reference (yes/no), felt rushed (yes/no). Skip this step for the official SAT — there
          is no question list to review.
        </li>
        <li>
          Then one <strong>timed Reading &amp; Writing module</strong> with one rule: “Read
          what the question asks for first.”
        </li>
        <li>
          Only after that, schedule a <strong>full timed test</strong> — so length is not the
          first variable you are testing.
        </li>
      </ul>

      <h2>{parentSatCopy.goodHelpBeforeTestHeading}</h2>
      <p className="!text-ink-soft">
        If you are hiring help before the {site.satDate} SAT, look for all three — not just
        content review from class:
      </p>
      <ul>
        <li>
          <strong>Patterns:</strong> a running list of your student’s miss types and a default
          approach for each until recognition is automatic.
        </li>
        <li>
          <strong>Tools:</strong> Desmos and the reference sheet on real College Board-style
          problems — speed and accuracy, not by hand only.
        </li>
        <li>
          <strong>Pace:</strong> timed modules and full-length Bluebook tests on a schedule —
          so they learn to finish under pressure, not only on untimed homework.
        </li>
        <li>
          Reviews <strong>Bluebook practice misses</strong> (where the app shows items) and
          rotates the next week’s focus across patterns, tools, and pace — not content-only
          worksheets.
        </li>
        <li>Clear weekly updates for you on what they worked on and what is next.</li>
      </ul>
      <p>
        <strong>Next step:</strong> book a free 15-minute parent call at
        illuminairy.com/get-started — we will help you decide if a guided SAT plan makes
        sense for your student. No score guarantees.
      </p>
    </>
  );
}
