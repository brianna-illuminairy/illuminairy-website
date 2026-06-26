import Link from "next/link";
import { AgendaTable } from "@/components/danielle/week1-shared";
import { Week3PostSessionResources } from "@/components/danielle/week3-post-session-resources";
import {
  LESSON1_AGENDA,
  POST_SESSION_3_LESSON1_SUMMARY,
  POST_SESSION_3_LESSON1_WINS,
  WEEK3_EE_MISS_LESSON1,
  WEEK3_EE_MISS_LESSON2,
  WEEK3_EE_MISS_TOTAL,
  WEEK3_WHITEBOARD_NOTES_URL
} from "@/lib/danielle-post-session-3-notes";

export function DanielleWeek3Lesson1Content() {
  return (
    <div className="danielle-week1">
      <div className="danielle-portal__page-head" id="lesson-1">
        <p className="danielle-portal__eyebrow">Illuminairy · Week 3 · Lesson 1</p>
        <h1>Equivalent expressions · homework review (part 1)</h1>
        <p className="danielle-portal__lede">
          Tuesday, June 23, 6:00 to 7:00 PM CT · Math · Complete. First pass on your incorrect and
          skipped equivalent expressions homework.
        </p>
      </div>

      <section className="danielle-week1__section danielle-week1__notes">
        <p className="danielle-week1__lesson-meta">Post Session · Tuesday, June 23</p>
        <h2 className="danielle-week1__heading">Session summary</h2>

        <p className="danielle-week1__focus">{POST_SESSION_3_LESSON1_SUMMARY}</p>

        <div className="danielle-week1__note-card">
          <p className="danielle-week1__note-label">Progress</p>
          <h3 className="danielle-week1__note-title">
            {WEEK3_EE_MISS_LESSON1} of {WEEK3_EE_MISS_TOTAL} homework misses reviewed
          </h3>
          <p className="danielle-week1__focus">
            {WEEK3_EE_MISS_LESSON2} incorrect or skipped problems left from your equivalent
            expressions homework. We finish those in{" "}
            <Link href="/danielle/week-3/lesson-2" className="danielle-week1__inline-link">
              Lesson 2
            </Link>
            , then run the patterns deck.
          </p>
        </div>

        <div className="danielle-week1__note-card">
          <p className="danielle-week1__note-label">Session format</p>
          <h3 className="danielle-week1__note-title">Live whiteboard session</h3>
          <p className="danielle-week1__focus">
            No slide deck for this session. We worked problems together on a shared whiteboard:
            your miss, then 2 similar examples, then independent reps at the end.
          </p>
          <p className="danielle-week1__habit">
            <a
              href={WEEK3_WHITEBOARD_NOTES_URL}
              className="danielle-portal__pdf-open"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open whiteboard notes (Excalidraw)
            </a>
          </p>
        </div>

        <h3 className="danielle-week1__slides-heading">Skills from this session</h3>
        <ul className="danielle-week1__wins">
          {POST_SESSION_3_LESSON1_WINS.map((win) => (
            <li key={win}>{win}</li>
          ))}
        </ul>

        <p className="danielle-week1__goal-line">
          <strong>Session goal:</strong> name the pattern (GCF, difference of squares, perfect
          square, AC split) before you expand.
        </p>

        <AgendaTable rows={LESSON1_AGENDA} />

        <Week3PostSessionResources />

        <p className="danielle-week1__habit">
          <Link href="/danielle/week-2/report" className="danielle-week1__inline-link">
            Week 2 report · equivalent expressions error patterns
          </Link>
        </p>
      </section>
    </div>
  );
}
