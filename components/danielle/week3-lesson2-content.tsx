import Link from "next/link";
import { AgendaTable, SlideEmbed } from "@/components/danielle/week1-shared";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";
import {
  LESSON2_AGENDA,
  POST_SESSION_3_LESSON2_HOMEWORK,
  WEEK3_EE_MISS_LESSON1,
  WEEK3_EE_MISS_LESSON2,
  WEEK3_EE_MISS_TOTAL,
  WEEK3_HOMEWORK_PORTAL_SETS,
  WEEK3_SLIDE_DECK_HREF
} from "@/lib/danielle-post-session-3-notes";

export function DanielleWeek3Lesson2Content() {
  return (
    <div className="danielle-week1">
      <div className="danielle-portal__page-head" id="lesson-2">
        <p className="danielle-portal__eyebrow">Illuminairy · Week 3 · Lesson 2</p>
        <h1>Equivalent expressions · homework review (part 2) + patterns deck</h1>
        <p className="danielle-portal__lede">
          Thursday, June 26, 6:00 to 7:00 PM CT · Math · Finish the {WEEK3_EE_MISS_LESSON2}{" "}
          remaining incorrect or skipped EE homework problems ({WEEK3_EE_MISS_LESSON1} of{" "}
          {WEEK3_EE_MISS_TOTAL} done in Lesson 1), then run the patterns deck.
        </p>
      </div>

      <section className="danielle-week1__section danielle-week1__lesson">
        <div className="danielle-week1__note-card">
          <p className="danielle-week1__note-label">Progress</p>
          <h3 className="danielle-week1__note-title">
            {WEEK3_EE_MISS_LESSON2} of {WEEK3_EE_MISS_TOTAL} homework misses left today
          </h3>
          <p className="danielle-week1__focus">
            We reviewed {WEEK3_EE_MISS_LESSON1} incorrect or skipped problems on Tuesday. Today we
            finish the rest on the whiteboard, then work the patterns deck for speed.
          </p>
        </div>

        <div className="danielle-week1__note-card">
          <p className="danielle-week1__note-label">Session format</p>
          <h3 className="danielle-week1__note-title">Whiteboard misses, then interactive deck</h3>
          <p className="danielle-week1__focus">
            First half: live whiteboard on your remaining homework misses (same format as Lesson 1).
            Second half: the patterns deck below for memorizing identities and running practice
            questions.
          </p>
          <p className="danielle-week1__habit">
            <Link href={WEEK3_SLIDE_DECK_HREF} className="danielle-portal__pdf-open">
              Open patterns deck (fullscreen)
            </Link>
          </p>
        </div>

        <p className="danielle-week1__goal-line">
          <strong>Session goal:</strong> all {WEEK3_EE_MISS_TOTAL} incorrect or skipped EE homework
          problems reviewed; pattern recognition feels faster on medium reps.
        </p>

        <AgendaTable rows={LESSON2_AGENDA} />

        <h3 className="danielle-week1__slides-heading">Patterns deck preview</h3>
        <p className="danielle-week1__focus">
          Embedded preview below. For practice questions and the cheat sheet during session, use the
          fullscreen link above.
        </p>
        <SlideEmbed title="Equivalent expressions · patterns to memorize" src={WEEK3_SLIDE_DECK_HREF} />
      </section>

      <section
        className="danielle-week1__section danielle-week1__notes"
        id="post-session-homework"
      >
        <p className="danielle-week1__lesson-meta">Post Session · Thursday, June 26</p>
        <h2 className="danielle-week1__heading">Homework</h2>
        <p className="danielle-week1__focus">{POST_SESSION_3_LESSON2_HOMEWORK.body}</p>

        <div className="danielle-week2__homework-list">
          {WEEK3_HOMEWORK_PORTAL_SETS.map((set) => (
            <article key={set.id} className="danielle-week2__homework-card">
              <div className="danielle-week2__homework-card-head">
                <h3 className="danielle-week1__note-title">{set.title}</h3>
              </div>
              <p className="danielle-week1__focus">{set.note}</p>
            </article>
          ))}
        </div>

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
      </section>
    </div>
  );
}
