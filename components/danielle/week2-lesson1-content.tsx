import Link from "next/link";
import { AgendaTable, SlideEmbed } from "@/components/danielle/week1-shared";
import { Week2ExerciseList } from "@/components/danielle/week2-exercise-list";
import { Week2HomeworkPortalList } from "@/components/danielle/week2-homework-portal-list";
import { Week2HomeworkWorkflow } from "@/components/danielle/week2-homework-workflow";
import {
  POST_SESSION_2_HOMEWORK,
  POST_SESSION_2_WINS
} from "@/lib/danielle-post-session-2-notes";

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
      "Cover the blank. Name the relationship in plain words. Match to contrast, causation, addition, or similarity."
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
    detail:
      "Post-session flashcard exercise on the portal (95% goal) plus Transitions practice in the Homework Portal."
  }
] as const;

export function DanielleWeek2Lesson1Content() {
  return (
    <div className="danielle-week1">
      <div className="danielle-portal__page-head" id="lesson-1">
        <p className="danielle-portal__eyebrow">Illuminairy · Week 2 · Lesson 1</p>
        <h1>Transitions · interactive lesson</h1>
        <p className="danielle-portal__lede">
          Tuesday, June 16, 6:00 to 7:00 PM CT · Reading and Writing. Complete. We ran the method,
          the sorting and matching games, and walked your three diagnostic transition misses.
        </p>
      </div>

      <section
        className="danielle-week1__section danielle-week1__notes"
        id="post-session-exercise"
      >
        <p className="danielle-week1__lesson-meta">Post Session · Tuesday, June 16</p>
        <h2 className="danielle-week1__heading">Session summary + homework</h2>
        <p className="danielle-week1__focus">
          Strong Transitions session. You worked through the full interactive deck, named relationships
          in plain words before uncovering choices, and applied the method to Wallace Stevens, Cosmic
          Canvas, and the rhythmicity concession question.
        </p>

        <h3 className="danielle-week1__slides-heading">What you locked in</h3>
        <ul className="danielle-week1__wins">
          {POST_SESSION_2_WINS.map((win) => (
            <li key={win}>{win}</li>
          ))}
        </ul>

        <h3 className="danielle-week1__slides-heading" id="homework-workflow">Homework order</h3>
        <p className="danielle-week1__focus">
          Follow these steps in order. Portal practice first, then Homework Portal sets.
        </p>
        <Week2HomeworkWorkflow />

        <h3 className="danielle-week1__slides-heading">Week 2 post-session exercise</h3>
        <p className="danielle-week1__focus">
          Your main homework on the portal this week is the category flashcard deck below. Run rounds
          until overall accuracy is 95%. Round scores and history save automatically in your browser.
        </p>
        <Week2ExerciseList />

        <div className="danielle-week1__note-card" id="homework-due">
          <p className="danielle-week1__note-label">Homework Portal</p>
          <h3 className="danielle-week1__note-title">{POST_SESSION_2_HOMEWORK.headline}</h3>
          <p className="danielle-week1__focus">{POST_SESSION_2_HOMEWORK.body}</p>
          <Week2HomeworkPortalList />
        </div>

        <p className="danielle-week1__habit">
          <Link href="/danielle/week-2/exercises" className="danielle-week1__inline-link">
            All Week 2 exercises
          </Link>
        </p>
      </section>

      <section className="danielle-week1__section danielle-week1__lesson">
        <p className="danielle-week1__lesson-meta">Lesson replay · Tuesday, June 16</p>
        <h2 className="danielle-week1__heading">Interactive lesson deck</h2>

        <div className="danielle-week1__note-card">
          <p className="danielle-week1__note-label">Session format</p>
          <h3 className="danielle-week1__note-title">Interactive lesson deck</h3>
          <p className="danielle-week1__focus">
            Reopen the deck to review slides, rerun the sorting and matching games, or reread the
            cheat sheet study board.
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
          Embedded preview below. For games during review, use the fullscreen link above.
        </p>
        <SlideEmbed title="Transitions interactive lesson" src="/danielle/files/transitions-lesson" />
      </section>
    </div>
  );
}
