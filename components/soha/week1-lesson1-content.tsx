import Link from "next/link";
import { AgendaTable, SlideEmbed } from "@/components/soha/week1-shared";
import { SohaMistakeLogSetup } from "@/components/soha/soha-mistake-log-setup";
import { Week1ExerciseList } from "@/components/soha/week1-exercise-list";
import { Week1HomeworkPortalList } from "@/components/soha/week1-homework-portal-list";
import { Week1HomeworkWorkflow } from "@/components/soha/week1-homework-workflow";
import {
  POST_SESSION_1_HOMEWORK,
  POST_SESSION_1_WINS,
  WEEK1_SLIDE_DECK_HREF,
} from "@/lib/soha-post-session-1-notes";

const LESSON1_AGENDA = [
  {
    time: "Open",
    segment: "Cold open",
    detail:
      "Cortisol diagnostic question (Module 1, Q22). Pick an answer in your head. We revisit it after the method.",
  },
  {
    time: "Next",
    segment: "The method",
    detail:
      "Cover the blank. Name the relationship in plain words. Match to contrast, causation, addition, or similarity.",
  },
  {
    time: "Next",
    segment: "Interactive games",
    detail:
      "Category sort, what-follows matching, cheat sheet study board, and copycat elimination round.",
  },
  {
    time: "Next",
    segment: "Your diagnostic misses",
    detail: "Module 1 Q22 (cortisol) and Module 2 Q23 (Cosmic Canvas) with full walk-throughs.",
  },
  {
    time: "Close",
    segment: "Wrap + homework",
    detail:
      "Mistake log setup, flashcards (3 rounds at 95%+), then Transitions 1 and Transitions 2 in the Homework Portal.",
  },
] as const;

export function SohaWeek1Lesson1Content() {
  return (
    <div className="soha-week1 aurora-portal__content">
      <div className="soha-week1__page-head" id="lesson-1">
        <p className="aurora-eyebrow">Illuminairy · Week 1 · Lesson 1</p>
        <h1 className="soha-week1__title">Transitions · interactive lesson</h1>
        <p className="soha-week1__lede">
          Wednesday, June 24 · Reading and Writing. We ran the method, the sorting and matching
          games, and walked your two diagnostic transition misses (cortisol and Cosmic Canvas).
        </p>
      </div>

      <section className="soha-week1__section soha-week1__notes" id="post-session-exercise">
        <p className="soha-week1__lesson-meta">Post session · Wednesday, June 24</p>
        <h2 className="soha-week1__heading">Session summary + homework</h2>
        <p className="soha-week1__focus">
          Strong Transitions session. You worked through the full interactive deck, named relationships
          in plain words before uncovering choices, and applied the method to your cortisol and Cosmic
          Canvas misses.
        </p>

        <h3 className="soha-week1__slides-heading">What you locked in</h3>
        <ul className="soha-week1__wins">
          {POST_SESSION_1_WINS.map((win) => (
            <li key={win}>{win}</li>
          ))}
        </ul>

        <h3 className="soha-week1__slides-heading" id="homework-workflow">
          Homework order
        </h3>
        <p className="soha-week1__focus">
          Follow these five steps in order. Portal practice first, then Homework Portal sets, then log
          your misses.
        </p>
        <Week1HomeworkWorkflow />

        <SohaMistakeLogSetup />

        <h3 className="soha-week1__slides-heading">Week 1 post-session exercise</h3>
        <p className="soha-week1__focus">
          Step 2 on the list above: the category flashcard deck. Run full rounds until three in a row hit
          95% or higher. Round scores and history save automatically in your browser.
        </p>
        <Week1ExerciseList />

        <div className="soha-week1__note-card" id="homework-due">
          <p className="soha-week1__note-label">Homework Portal</p>
          <h3 className="soha-week1__note-title">{POST_SESSION_1_HOMEWORK.headline}</h3>
          <p className="soha-week1__focus">{POST_SESSION_1_HOMEWORK.body}</p>
          <Week1HomeworkPortalList />
        </div>

        <p className="soha-week1__habit">
          <Link href="/soha/week-1/exercises" className="soha-week1__inline-link">
            All Week 1 exercises
          </Link>
        </p>
      </section>

      <section className="soha-week1__section soha-week1__lesson">
        <p className="soha-week1__lesson-meta">Lesson replay · Wednesday, June 24</p>
        <h2 className="soha-week1__heading">Interactive lesson deck</h2>

        <div className="soha-week1__note-card">
          <p className="soha-week1__note-label">Session format</p>
          <h3 className="soha-week1__note-title">Interactive lesson deck</h3>
          <p className="soha-week1__focus">
            Reopen the deck to review slides, rerun the sorting and matching games, or reread the cheat
            sheet study board.
          </p>
          <p className="soha-week1__habit">
            <Link href={WEEK1_SLIDE_DECK_HREF} className="aurora-btn-primary">
              Open interactive lesson (fullscreen)
            </Link>
          </p>
        </div>

        <p className="soha-week1__goal-line">
          <strong>Session goal:</strong> before looking at choices, you can name how two sentences relate
          and pick the transition that matches.
        </p>

        <AgendaTable rows={LESSON1_AGENDA} />

        <h3 className="soha-week1__slides-heading">Lesson deck preview</h3>
        <p className="soha-week1__focus">
          Embedded preview below. For games during review, use the fullscreen link above.
        </p>
        <SlideEmbed title="Transitions interactive lesson" src={WEEK1_SLIDE_DECK_HREF} />
      </section>
    </div>
  );
}
