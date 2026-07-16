import Link from "next/link";
import { AgendaTable, SlideEmbed } from "@/components/skye/lesson-shared";
import {
  SKYE_TRIANGLES_LESSON_HREF,
  WEEK4_LESSON1,
  WEEK4_LESSON1_HOMEWORK_SETS,
} from "@/lib/skye/session-notes/week4-lesson1";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";

const LESSON1_AGENDA = [
  {
    time: "Start",
    segment: "Reading triangles",
    detail: "Marks, side and angle relationships, and how the SAT labels a figure.",
  },
  {
    time: "Deck",
    segment: "Basic tools",
    detail: "Angle sum, right triangles, Pythagorean theorem, labeling sides.",
  },
  {
    time: "Deck",
    segment: "Trig ratios",
    detail: "SOH CAH TOA — match the ratio to the side the question asks for.",
  },
  {
    time: "Wrap",
    segment: "Homework",
    detail: "Triangles 1 in the Homework Portal.",
  },
] as const;

export function SkyeWeek4Lesson1Content() {
  const session = WEEK4_LESSON1;

  return (
    <div className="skye-lesson-deck">
      <header className="aurora-portal__page-head">
        <p className="aurora-eyebrow">Illuminairy · Week 4 · Session 1</p>
        <h1 className="aurora-portal__title">{session.title}</h1>
        <p className="aurora-portal__lede">
          {session.dateLabel} · {session.lede}
        </p>
      </header>

      <section className="skye-lesson-deck__section" id="homework-due">
        <p className="skye-lesson-deck__lesson-meta">Homework</p>
        <h2 className="skye-lesson-deck__heading">{session.homework.headline}</h2>
        <p className="skye-lesson-deck__focus">{session.homework.body}</p>
        <ul className="skye-lesson-deck__homework-list">
          {WEEK4_LESSON1_HOMEWORK_SETS.map((set) => (
            <li key={set.id}>
              <strong>{set.title}</strong> — {set.note}
            </li>
          ))}
        </ul>
        <p className="skye-lesson-deck__habit">
          <a href={homeworkPortalLoginUrl} target="_blank" rel="noopener noreferrer">
            Open Homework Portal →
          </a>
        </p>

        <div className="skye-lesson-deck__callout" style={{ marginTop: 20 }}>
          <p className="skye-lesson-deck__note-label">{session.nextSession.headline}</p>
          <h3 className="skye-lesson-deck__note-title">Miss review</h3>
          <p className="skye-lesson-deck__focus">{session.nextSession.body}</p>
        </div>
      </section>

      <section className="skye-lesson-deck__section">
        <p className="skye-lesson-deck__lesson-meta">Lesson</p>
        <h2 className="skye-lesson-deck__heading">Slide deck</h2>
        <AgendaTable rows={LESSON1_AGENDA} />

        <p className="skye-lesson-deck__habit">
          <Link href={SKYE_TRIANGLES_LESSON_HREF} className="skye-lesson-deck__inline-link">
            Open lesson deck (fullscreen)
          </Link>
        </p>
        <SlideEmbed
          title="Right Triangles Lesson 1 · Reading triangles and the basic tools"
          src={SKYE_TRIANGLES_LESSON_HREF}
        />
      </section>

      <p className="skye-plan__foot-link">
        <Link href="/skye/week-1/lesson-2">Week 1 · equivalent expressions</Link>
        {" · "}
        <Link href="/skye/plan">Improvement plan</Link>
        {" · "}
        <Link href="/skye/diagnostic">Diagnostic analysis</Link>
      </p>
    </div>
  );
}
