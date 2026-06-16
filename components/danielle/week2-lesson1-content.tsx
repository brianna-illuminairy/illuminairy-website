import Link from "next/link";
import { AgendaTable, SlideEmbed } from "@/components/danielle/week1-shared";

const LESSON1_AGENDA = [
  {
    time: "6:00 to 6:10",
    segment: "Cold open",
    detail:
      "Wallace Stevens diagnostic question. Pick an answer in your head. We revisit it after the method."
  },
  {
    time: "6:10 to 6:25",
    segment: "The method",
    detail:
      "Cover the blank. Name the relationship in plain words. Match to contrast, cause, addition, example, or sequence."
  },
  {
    time: "6:25 to 6:40",
    segment: "Interactive games",
    detail:
      "Category sort, what-follows matching, cheat sheet study board, and copycat elimination round."
  },
  {
    time: "6:40 to 6:55",
    segment: "Your diagnostic misses",
    detail:
      "Module 1 Q24, Module 2 Q23 (Cosmic Canvas), and Module 2 Q24 (rhythmicity) with full walk-throughs."
  },
  {
    time: "6:55 to 7:00",
    segment: "Wrap + homework",
    detail: "Assign Transitions practice in the Homework Portal. Save the cheat sheet slide for review."
  }
] as const;

export function DanielleWeek2Lesson1Content() {
  return (
    <div className="danielle-week1">
      <div className="danielle-portal__page-head" id="lesson-1">
        <p className="danielle-portal__eyebrow">Illuminairy · Week 2 · Lesson 1</p>
        <h1>Transitions · interactive lesson</h1>
        <p className="danielle-portal__lede">
          Tuesday, June 16, 6:00 to 7:00 PM CT · Reading and Writing. Learn the method, play the
          sorting and matching games, then apply it to the transitions questions you missed on the
          diagnostic.
        </p>
      </div>

      <section className="danielle-week1__section danielle-week1__lesson">
        <div className="danielle-week1__note-card">
          <p className="danielle-week1__note-label">Session format</p>
          <h3 className="danielle-week1__note-title">Interactive lesson deck</h3>
          <p className="danielle-week1__focus">
            This session runs on the interactive deck below. Open it fullscreen on your laptop or
            iPad so we can click through slides, run the games, and work practice questions together
            mid-session.
          </p>
          <p className="danielle-week1__habit">
            <Link href="/danielle/files/transitions-lesson" className="danielle-portal__pdf-open">
              Open interactive lesson (fullscreen)
            </Link>
          </p>
        </div>

        <p className="danielle-week1__goal-line">
          <strong>Session goal:</strong> before looking at choices, you can name how two sentences
          relate and pick the transition that matches.
        </p>

        <AgendaTable rows={LESSON1_AGENDA} />

        <h3 className="danielle-week1__slides-heading">Lesson deck preview</h3>
        <p className="danielle-week1__focus">
          Embedded preview below. For games and practice during the session, use the fullscreen link
          above.
        </p>
        <SlideEmbed title="Transitions interactive lesson" src="/danielle/files/transitions-lesson" />
      </section>
    </div>
  );
}
