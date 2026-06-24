import Link from "next/link";
import { AgendaTable, SlideEmbed } from "@/components/danielle/week1-shared";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";
import { POST_SESSION_2_LESSON_2_HOMEWORK } from "@/lib/danielle-post-session-2-notes";

const LESSON2_AGENDA = [
  {
    time: "6:00 to 6:10",
    segment: "Score recap",
    detail:
      "Easy practice set results, then where medium misses cluster: cause and effect, sequence, and reinforcement."
  },
  {
    time: "6:10 to 6:25",
    segment: "Seven jobs framework",
    detail:
      "Name what sentence two is doing before you look at choices. Run the \"so\" test on cause-and-effect words."
  },
  {
    time: "6:25 to 6:45",
    segment: "Medium walk-throughs",
    detail:
      "Live reps on missed medium questions: Billy Joel, Yeats, Stoclet House, Bauhaus, baklava, BLS, gamma-ray bursts."
  },
  {
    time: "6:45 to 6:55",
    segment: "Word drill + trap detector",
    detail:
      "Ten transition words to know cold, matching activity, and trap naming on short passages."
  },
  {
    time: "6:55 to 7:00",
    segment: "Wrap + homework",
    detail:
      "Timed Transitions practice in the Homework Portal: 30 questions, 37-minute timer. One sitting, test conditions."
  }
] as const;

export function DanielleWeek2Lesson2Content() {
  return (
    <div className="danielle-week1">
      <div className="danielle-portal__page-head" id="lesson-2">
        <p className="danielle-portal__eyebrow">Illuminairy · Week 2 · Lesson 2</p>
        <h1>Transitions · medium depth session</h1>
        <p className="danielle-portal__lede">
          Thursday, June 18, 6:00 to 7:00 PM CT · Reading and Writing. This session targets
          medium misses: cause and effect, the seven jobs, and the words that look alike until you
          name the relationship first.
        </p>
      </div>

      <section className="danielle-week1__section danielle-week1__lesson">
        <div className="danielle-week1__note-card">
          <p className="danielle-week1__note-label">Session format</p>
          <h3 className="danielle-week1__note-title">Interactive lesson deck</h3>
          <p className="danielle-week1__focus">
            Open the deck below for score recap slides, medium walk-throughs, word matching, and
            trap drills. Use fullscreen during session or review after class.
          </p>
          <p className="danielle-week1__habit">
            <Link
              href="/danielle/files/transitions-lesson-02"
              className="danielle-portal__pdf-open"
            >
              Open lesson deck (fullscreen)
            </Link>
          </p>
        </div>

        <p className="danielle-week1__goal-line">
          <strong>Session goal:</strong> on medium transitions, you can name the job sentence two
          is doing and eliminate choices that fail the &quot;so&quot; test before you commit.
        </p>

        <AgendaTable rows={LESSON2_AGENDA} />

        <h3 className="danielle-week1__slides-heading">Lesson deck preview</h3>
        <p className="danielle-week1__focus">
          Embedded preview below. For matching games and trap drills during review, use the
          fullscreen link above.
        </p>
        <SlideEmbed
          title="Transitions Lesson 02"
          src="/danielle/files/transitions-lesson-02"
        />
      </section>

      <section
        className="danielle-week1__section danielle-week1__notes"
        id="post-session-homework"
      >
        <p className="danielle-week1__lesson-meta">Post Session · Thursday, June 18</p>
        <h2 className="danielle-week1__heading">Homework</h2>
        <p className="danielle-week1__focus">
          Your assignment is in the Homework Portal (same login as the header button on this site).
          It is not on this page.
        </p>

        <div className="danielle-week1__note-card" id="homework-due">
          <p className="danielle-week1__note-label">Homework Portal</p>
          <h3 className="danielle-week1__note-title">{POST_SESSION_2_LESSON_2_HOMEWORK.title}</h3>
          <p className="danielle-week2__homework-due-badge">
            Due {POST_SESSION_2_LESSON_2_HOMEWORK.dueLabel}
          </p>
          <p className="danielle-week1__focus">
            <strong>
              {POST_SESSION_2_LESSON_2_HOMEWORK.problemCount} hard Transitions questions · timed.
            </strong>{" "}
            {POST_SESSION_2_LESSON_2_HOMEWORK.body}
          </p>
          <ul className="danielle-week1__score-list">
            {POST_SESSION_2_LESSON_2_HOMEWORK.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
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
      </section>
    </div>
  );
}
