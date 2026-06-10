import {
  POST_SESSION_1_HOMEWORK,
  POST_SESSION_1_NEXT,
  POST_SESSION_1_WINS,
  QUADRATICS_SCORE_CONTEXT
} from "@/lib/danielle-post-session-1-notes";

const LESSON1_AGENDA = [
  {
    time: "Lesson 1 · Tue Jun 9",
    segment: "Deck 1 · Factoring",
    detail:
      "Common factor, trinomials, AC method, special patterns, and the step-by-step recipe."
  },
  {
    time: "Lesson 1 · Tue Jun 9",
    segment: "Deck 2 · Nonlinear recognition",
    detail:
      "Five nonlinear types, calculator vs by-hand rules, and when exact form means no graphing."
  },
  {
    time: "Lesson 1 · Tue Jun 9",
    segment: "Diagnostic walk-through",
    detail:
      "Module 1 Q4 (shared-expression quadratic) and Module 2 Q11 (quadratic with radical answer)."
  }
] as const;

const MATH_FOUNDATIONS = [
  {
    order: 1,
    title: "Factoring",
    when: "Lesson 1 · Tuesday, June 9",
    why: "The foundation for every quadratic solve-by-factoring problem on the SAT.",
    src: "/danielle/files/factoring-slides",
    ready: true
  },
  {
    order: 2,
    title: "Recognition · nonlinear equations and systems",
    when: "Lesson 1 · Tuesday, June 9",
    why: "Name the type, decide calculator or by hand, then pick the approach.",
    src: "/danielle/files/nonlinear-slides",
    ready: true
  },
  {
    order: 3,
    title: "Radical simplification",
    when: "Thursday Lesson 2 · preview",
    why: "Opens Thursday. Needed for exact-form quadratic answers like your Module 2 miss.",
    src: "/danielle/files/radicals-slides",
    ready: true
  }
] as const;

const LESSON2_AGENDA = [
  {
    time: "6:00 to 6:15",
    segment: "Post Session 1 recap",
    detail:
      "Quick wins check-in, then more worked examples on shared-expression factoring (including the y minus c pattern)."
  },
  {
    time: "6:15 to 6:35",
    segment: "Factoring depth",
    detail:
      "AC method reps, negative leading terms, difference of squares, perfect squares, and the \"keep the 1\" step when you split the middle term."
  },
  {
    time: "6:35 to 6:50",
    segment: "Radicals + quadratic formula",
    detail:
      "Radical simplification deck, then the quadratic formula for equations that do not factor cleanly."
  },
  {
    time: "6:50 to 7:00",
    segment: "Wrap and assign",
    detail:
      "Revisit Module 2 Q11 with the new tools. Assign updated practice with solutions visible in the Homework Portal."
  }
] as const;

const WEEK_GOALS = [
  "Name the nonlinear question type (and the Math tool to use) in under 7 seconds on recognition reps.",
  "Move any quadratic to one side, set equal to zero, and start factoring without hesitating.",
  "Complete assigned Homework Portal practice and note any problem types that still feel slow.",
  "Thursday: leave with clearer shared-expression factoring and one clean quadratic-formula rep."
] as const;

function AgendaTable({ rows }: { rows: readonly { time: string; segment: string; detail: string }[] }) {
  return (
    <div className="danielle-week1__table-wrap">
      <table className="danielle-week1__table">
        <thead>
          <tr>
            <th>When</th>
            <th>Segment</th>
            <th>What happens</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.time}-${row.segment}`}>
              <td>{row.time}</td>
              <td>{row.segment}</td>
              <td>{row.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SlideEmbed({ title, src }: { title: string; src: string }) {
  return (
    <div className="danielle-week1__slides-block">
      <h4 className="danielle-week1__slides-title">{title}</h4>
      <iframe src={src} title={title} className="danielle-week1__slide-frame" />
    </div>
  );
}

function MathFoundationsDeck({
  order,
  title,
  when,
  why,
  src,
  ready
}: {
  order: number;
  title: string;
  when: string;
  why: string;
  src: string | null;
  ready: boolean;
}) {
  return (
    <article className="danielle-week1__deck">
      <p className="danielle-week1__deck-order">Deck {order}</p>
      <h3 className="danielle-week1__deck-title">{title}</h3>
      <p className="danielle-week1__deck-when">{when}</p>
      <p className="danielle-week1__deck-why">{why}</p>
      {ready && src ? (
        <SlideEmbed title={title} src={src} />
      ) : (
        <div className="danielle-week1__deck-pending">
          Slides for this deck are coming to the portal after the next Math session.
        </div>
      )}
    </article>
  );
}

export function DanielleWeek1Content() {
  return (
    <div className="danielle-week1">
      <div className="danielle-portal__page-head">
        <p className="danielle-portal__eyebrow">Illuminairy · Week 1</p>
        <h1>Lesson schedule</h1>
        <p className="danielle-portal__lede">
          Lesson 1: Tuesday, June 9, 6:00 to 7:00 PM CT (Math, complete). Lesson 2: Thursday,
          June 11, 6:00 to 7:00 PM CT (Math, factoring depth).
        </p>
      </div>

      <section className="danielle-week1__section danielle-week1__notes" id="post-session-1">
        <p className="danielle-week1__lesson-meta">Post Session 1 · Tuesday, June 9</p>
        <h2 className="danielle-week1__heading">Session 1 summary</h2>
        <p className="danielle-week1__focus">
          Strong first Math session. You showed up prepared (you had already reviewed the diagnostic
          and said it matched what you saw on test day), stayed engaged for the full hour, and asked
          for examples when you needed them. We covered a lot of ground in one session.
        </p>

        <h3 className="danielle-week1__slides-heading">What you locked in</h3>
        <ul className="danielle-week1__wins">
          {POST_SESSION_1_WINS.map((win) => (
            <li key={win}>{win}</li>
          ))}
        </ul>

        <p className="danielle-week1__focus">
          You started building factoring fluency, including trinomials, the AC method, and special
          patterns. The shared-expression step from Module 1 (factoring out a common term like y
          minus 42) is the piece we will keep training until it feels easy. That is normal at this
          stage, not a setback.
        </p>

        <div className="danielle-week1__score-card">
          <h3 className="danielle-week1__score-card-title">{QUADRATICS_SCORE_CONTEXT.headline}</h3>
          <p className="danielle-week1__focus">{QUADRATICS_SCORE_CONTEXT.lede}</p>
          <ul className="danielle-week1__score-list">
            {QUADRATICS_SCORE_CONTEXT.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>

        <div className="danielle-week1__note-card" id="homework-due">
          <p className="danielle-week1__note-label">Session note</p>
          <h3 className="danielle-week1__note-title">{POST_SESSION_1_HOMEWORK.headline}</h3>
          <p className="danielle-week1__focus">
            <strong>Due {POST_SESSION_1_HOMEWORK.dueLabel}.</strong> {POST_SESSION_1_HOMEWORK.body}
          </p>
        </div>

        <h3 className="danielle-week1__slides-heading">Building on Thursday</h3>
        <ul className="danielle-week1__practice-list">
          {POST_SESSION_1_NEXT.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="danielle-week1__habit">
          <strong>Homework:</strong> Work through assigned quadratics practice in the Homework Portal
          by <strong>Sunday, June 15</strong>. Solutions are visible so you can study worked
          examples. Answer what you can; bring anything still confusing to Thursday&apos;s session.
        </p>
        <p className="danielle-week1__habit">
          <strong>Portal alerts:</strong> We email and text you when session notes or lesson materials
          are added. No signup needed.
        </p>
      </section>

      <section className="danielle-week1__section">
        <h2 className="danielle-week1__heading">Week 1 goals</h2>
        <ol className="danielle-week1__goals">
          {WEEK_GOALS.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ol>
      </section>

      <section className="danielle-week1__section danielle-week1__lesson">
        <p className="danielle-week1__lesson-meta">Lesson 1 · Tuesday, June 9 · Complete · Math</p>
        <h2 className="danielle-week1__heading">Math foundations · Session 1</h2>
        <p className="danielle-week1__focus">
          Both diagnostic misses were quadratics the calculator could not finish: Module 1 Q4
          (shared-expression pattern) and Module 2 Q11 (exact radical form). Session 1 built the
          recognition rules and factoring base. Slides stay here for review.
        </p>
        <AgendaTable rows={LESSON1_AGENDA} />
        <p className="danielle-week1__habit">
          <strong>Calculator habit:</strong> read the question first, name the type, decide
          calculator or by hand, then name the approach.
        </p>

        <h3 className="danielle-week1__slides-heading">Session 1 slides (review)</h3>
        {MATH_FOUNDATIONS.map((deck) => (
          <MathFoundationsDeck key={deck.order} {...deck} />
        ))}
      </section>

      <section
        className="danielle-week1__section danielle-week1__lesson"
        id="lesson-2"
      >
        <p className="danielle-week1__lesson-meta">
          Lesson 2 · Thursday, June 11 · 6:00 to 7:00 PM CT · Math
        </p>
        <h2 className="danielle-week1__heading">Factoring depth + quadratics apply</h2>
        <p className="danielle-week1__focus">
          Thursday stays in Math. We go one level deeper on factoring, shared-expression recognition,
          radicals, and the quadratic formula before moving to Reading and Writing. Both concepts
          are worth a large share of your Math score, so it is worth taking the time to master them.
        </p>
        <p className="danielle-week1__goal-line">
          <strong>Session goal:</strong> shared-expression factoring feels clearer, and you can
          walk through one quadratic-formula problem that ends in simplified radical form.
        </p>
        <AgendaTable rows={LESSON2_AGENDA} />

        <h3 className="danielle-week1__slides-heading">Thursday lesson deck</h3>
        <p className="danielle-week1__focus">
          Updated quadratics deck for Lesson 2. Review before Thursday if you want a head start.
        </p>
        <SlideEmbed
          title="Quadratic equations · Lesson 2"
          src="/danielle/files/quadratics-slides"
        />
      </section>

      <section className="danielle-week1__section">
        <h2 className="danielle-week1__heading">Daily practice this week</h2>
        <p className="danielle-week1__focus">About 20 questions a day on non-lesson days.</p>
        <ul className="danielle-week1__practice-list">
          <li>
            <strong>Wed Jun 10:</strong> Homework Portal practice (quadratics and factoring) plus
            Math recognition flashcards
          </li>
          <li>
            <strong>Thu Jun 11:</strong> Lesson 2 day — focus on session; keep chipping away at
            homework when you have time
          </li>
          <li>
            <strong>Fri Jun 12:</strong> Homework Portal practice (quadratics and factoring) plus a
            few nonlinear equation reps
          </li>
          <li>
            <strong>Sat Jun 13:</strong> Homework Portal practice plus Math recognition flashcards
          </li>
          <li>
            <strong>Sun Jun 15:</strong> Finish quadratics homework in the Homework Portal (due date)
          </li>
        </ul>
      </section>
    </div>
  );
}
