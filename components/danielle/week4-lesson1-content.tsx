import { AgendaTable, MathDeck } from "@/components/danielle/week1-shared";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";

const LESSON1_AGENDA = [
  {
    time: "6:00 to 6:15",
    segment: "What Command of Evidence asks",
    detail:
      "Two question families: textual evidence (which quote or detail supports a claim) and quantitative evidence (which data point from a graph or table completes the argument)."
  },
  {
    time: "6:15 to 6:35",
    segment: "Textual evidence method",
    detail:
      "Read the claim first, predict what proof would look like, then find the choice that directly backs it. Eliminate answers that are true but off-topic, or on-topic but unsupported."
  },
  {
    time: "6:35 to 6:55",
    segment: "Quantitative evidence + graphs",
    detail:
      "Match the sentence to the exact row, column, or trend. Watch units, axis labels, and 'increase vs decrease' traps before picking a number."
  },
  {
    time: "6:55 to 7:00",
    segment: "Wrap + homework set",
    detail:
      "Name the two evidence types and the first move for each, then set up the Command of Evidence questions in the Homework Portal."
  }
] as const;

const LESSON1_DECKS = [
  {
    order: 1,
    title: "Command of Evidence",
    when: "Lesson 1 · Tuesday, July 7",
    why: "Textual and quantitative evidence: read the claim, predict the proof, and match it to the passage, graph, or table.",
    src: "/danielle/files/command-of-evidence-slides"
  }
] as const;

export function DanielleWeek4Lesson1Content() {
  return (
    <div className="danielle-week1">
      <div className="danielle-portal__page-head" id="lesson-1">
        <p className="danielle-portal__eyebrow">Illuminairy · Week 4 · Lesson 1</p>
        <h1>Reading &amp; Writing · Command of Evidence</h1>
        <p className="danielle-portal__lede">
          Tuesday, July 7, 6:00 to 7:00 PM CT · Reading &amp; Writing. Today we work through Command
          of Evidence: textual evidence (finding the quote or detail that supports a claim) and
          quantitative evidence (reading graphs and tables to complete an argument).
        </p>
      </div>

      <section className="danielle-week1__section danielle-week1__lesson">
        <p className="danielle-week1__lesson-meta">
          Lesson 1 · Tuesday, July 7 · 6:00 to 7:00 PM CT · Reading &amp; Writing
        </p>
        <h2 className="danielle-week1__heading">What we cover today</h2>
        <p className="danielle-week1__focus">
          Command of Evidence questions ask you to back up a claim with the right proof. We build one
          repeatable habit: read the claim first, predict what the evidence should say, then pick the
          choice that directly supports it. The slides below run the full lesson.
        </p>
        <AgendaTable rows={LESSON1_AGENDA} />
        <p className="danielle-week1__habit">
          <strong>Evidence habit:</strong> read the claim, predict the proof, then match it. Skip
          answers that are true but do not support the specific claim.
        </p>

        <h3 className="danielle-week1__slides-heading">Lesson slides</h3>
        {LESSON1_DECKS.map((deck) => (
          <MathDeck key={deck.order} {...deck} />
        ))}
      </section>

      <section className="danielle-week1__section danielle-week1__notes">
        <h2 className="danielle-week1__heading">After the lesson · homework</h2>
        <div className="danielle-week1__note-card" id="homework-due">
          <p className="danielle-week1__note-label">Practice portal</p>
          <h3 className="danielle-week1__note-title">
            Complete the Command of Evidence questions in the Homework Portal
          </h3>
          <p className="danielle-week1__focus">
            After today&apos;s lesson, log in to the practice portal and finish the Command of
            Evidence question set. Use the read-the-claim-first habit on every question, and review
            each miss: read the explanation and get three of that type in a row correct.
          </p>
          <p className="danielle-week1__habit">
            <a
              href={homeworkPortalLoginUrl}
              className="danielle-portal__pdf-open"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Homework Portal
            </a>
          </p>
        </div>
        <p className="danielle-week1__habit">
          <strong>Portal alerts:</strong> We email and text you when session notes or lesson
          materials are added. No signup needed.
        </p>
      </section>
    </div>
  );
}
