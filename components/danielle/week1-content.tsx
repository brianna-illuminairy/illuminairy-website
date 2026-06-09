const LESSON1_AGENDA = [
  {
    time: "Lesson 1 · Tue Jun 9",
    segment: "Deck 1 · Factoring",
    detail:
      "Full session on factoring: common factor, trinomials, AC method, special patterns, and the step-by-step recipe. Three of the five quadratic tools depend on this, and it shows up across the whole Math section."
  },
  {
    time: "Next Math session · ~20 min",
    segment: "Deck 2 · Radical simplification",
    detail:
      "Opens the next Math session. The by-hand tool that finishes quadratic-formula questions like her Module 2 Q4 miss (√72 → 6√2, then divide by 2)."
  },
  {
    time: "After Decks 1 and 2",
    segment: "Deck 3 · Recognition",
    detail:
      "Spot a quadratic, pick from the five tools, decide calculator or by hand, name the approach. Targets her calculator-first habit and the four-minute time sinks."
  },
  {
    time: "After Deck 3",
    segment: "Deck 4 · Quadratics apply",
    detail:
      "Work her two missed questions step by step (M1 Q11 common-factor move; M2 Q4 formula plus simplify), then four in-session mediums to four-in-a-row, then hards as stretch."
  }
] as const;

const MATH_FOUNDATIONS = [
  {
    order: 1,
    title: "Factoring",
    when: "Lesson 1 · Tuesday, June 9",
    why: "The foundation. Three of the five quadratic methods depend on it, and it shows up across the whole Math section.",
    src: "/danielle/files/factoring-slides",
    ready: true
  },
  {
    order: 2,
    title: "Radical simplification",
    when: "Next Math session · first ~20 minutes",
    why: "The other by-hand tool she is missing. It finishes quadratic-formula questions that do not factor cleanly, like her Q4 miss.",
    src: null,
    ready: false
  },
  {
    order: 3,
    title: "Recognition · nonlinear equations and systems",
    when: "After factoring and radicals",
    why: "Now “the approach is factor” or “the approach is the quadratic formula” means something. Name the type, decide calculator or by hand, name the approach.",
    src: "/danielle/files/nonlinear-slides",
    ready: true
  },
  {
    order: 4,
    title: "Quadratics · apply",
    when: "After recognition",
    why: "Her two missed questions, then the in-session practice ladder. This is where the tools and the read come together on her real misses.",
    src: "/danielle/files/quadratics-slides",
    ready: true
  }
] as const;

const LESSON2_AGENDA = [
  {
    time: "6:00 to 6:10",
    segment: "Recognition install (Reading)",
    detail:
      "Rapid-fire naming for reading and writing question types. Name the type only, no solving."
  },
  {
    time: "6:10 to 6:20",
    segment: "Fix the easy miss",
    detail:
      "Start with the easy command-of-evidence question she missed. Install the method and slow down on easy questions."
  },
  {
    time: "6:20 to 6:50",
    segment: "Command of evidence ladder",
    detail:
      "Read the claim, say what would prove it, then find the matching answer. Work missed hard questions, then practice to 4 in a row through hard."
  },
  {
    time: "6:50 to 7:00",
    segment: "Wrap and assign",
    detail:
      "Recap the method. Assign practice, including a few nonlinear-equation questions from Lesson 1 so the skill stays fresh."
  }
] as const;

const WEEK_GOALS = [
  "Name the question type (and for Math, the tool to use) in under 7 seconds on at least 8 of 10 recognition reps.",
  "Get 4 correct in a row at the medium level on nonlinear equations.",
  "Get 4 correct in a row on command of evidence, working up to hard.",
  "Complete at least 90% of the assigned practice."
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
          Lesson 1: Tuesday, June 9, 6:00 to 7:00 PM CT (Math). Lesson 2: Thursday, June 11,
          6:00 to 7:00 PM CT (Reading and Writing).
        </p>
      </div>

      <section className="danielle-week1__section">
        <h2 className="danielle-week1__heading">Week 1 goals</h2>
        <ol className="danielle-week1__goals">
          {WEEK_GOALS.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ol>
      </section>

      <section className="danielle-week1__section danielle-week1__lesson">
        <p className="danielle-week1__lesson-meta">Lesson 1 · Tuesday, June 9 · 6:00 to 7:00 PM CT · Math</p>
        <h2 className="danielle-week1__heading">Math foundations · quadratics</h2>
        <p className="danielle-week1__focus">
          Both questions she missed on the diagnostic were quadratics the calculator could not
          finish: one has a letter constant (Module 1 Q11), one needs an exact radical form
          (Module 2 Q4). Both took her well over the time average. This sequence builds the
          by-hand tools first, then trains the read, then applies everything to her real misses.
        </p>
        <p className="danielle-week1__goal-line">
          <strong>Session goal:</strong> by the end of the quadratics deck, she names the type and
          tool before solving and gets 4 medium nonlinear-equation questions right in a row.
        </p>
        <AgendaTable rows={LESSON1_AGENDA} />
        <p className="danielle-week1__habit">
          <strong>Calculator habit:</strong> read the question first, name the type, decide
          calculator or by hand, then name the approach. The calculator only comes out when it can
          actually finish the problem.
        </p>

        <h3 className="danielle-week1__slides-heading">Math foundations slides (teaching order)</h3>
        <p className="danielle-week1__focus">
          Four decks, one look and one set of controls. Review them in this order.
        </p>
        {MATH_FOUNDATIONS.map((deck) => (
          <MathFoundationsDeck key={deck.order} {...deck} />
        ))}
      </section>

      <section className="danielle-week1__section danielle-week1__lesson">
        <p className="danielle-week1__lesson-meta">
          Lesson 2 · Thursday, June 11 · 6:00 to 7:00 PM CT · Reading and Writing
        </p>
        <h2 className="danielle-week1__heading">Command of evidence</h2>
        <p className="danielle-week1__focus">
          Reading recognition, then command of evidence. She missed 3 on the diagnostic (about +26
          points). One was easy, so this session also focuses on not rushing easy questions.
        </p>
        <p className="danielle-week1__goal-line">
          <strong>Session goal:</strong> state the command-of-evidence method on her own and get 4
          in a row working up to hard.
        </p>
        <AgendaTable rows={LESSON2_AGENDA} />
      </section>

      <section className="danielle-week1__section">
        <h2 className="danielle-week1__heading">Daily practice this week</h2>
        <p className="danielle-week1__focus">About 20 questions a day on non-lesson days.</p>
        <ul className="danielle-week1__practice-list">
          <li>
            <strong>Wed Jun 10:</strong> Nonlinear equations (medium) plus Math recognition
            flashcards
          </li>
          <li>
            <strong>Thu Jun 11:</strong> Lesson 2 day — light recognition flashcards only
          </li>
          <li>
            <strong>Fri Jun 12:</strong> Command of evidence (easy to hard) plus a few nonlinear
            equations
          </li>
          <li>
            <strong>Sat Jun 13:</strong> Mixed practice plus Reading recognition flashcards
          </li>
        </ul>
      </section>
    </div>
  );
}
