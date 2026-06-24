import Link from "next/link";
import { SlideEmbed } from "@/components/soha/week1-shared";
import { Week1HomeworkWorkflow } from "@/components/soha/week1-homework-workflow";
import { WEEK1_SLIDE_DECK_HREF } from "@/lib/soha-post-session-1-notes";
import {
  SOHA_WEEK1_LESSON1_DIAGNOSTIC_MISSES,
  SOHA_WEEK1_LESSON1_DIAGNOSTIC_NOTE,
  SOHA_WEEK1_LESSON1_OVERVIEW,
  SOHA_WEEK1_LESSON1_PLAN_NOTE,
  SOHA_WEEK1_LESSON1_PLAN_POINTS,
  SOHA_WEEK1_LESSON1_TOPIC,
} from "@/lib/soha/week1-lesson-1-copy";

export function SohaWeek1Lesson1Content() {
  const { section, skill } = SOHA_WEEK1_LESSON1_TOPIC;
  const planPoints = SOHA_WEEK1_LESSON1_PLAN_POINTS;

  return (
    <div className="soha-week1 aurora-portal__content">
      <header className="soha-week1__page-head" id="lesson-1">
        <p className="aurora-eyebrow">Illuminairy · Week 1 · Lesson 1</p>
        <h1 className="soha-week1__title">
          {section} · {skill}
        </h1>
      </header>

      <section className="soha-week1__section" aria-labelledby="lesson-overview">
        <h2 className="soha-week1__heading" id="lesson-overview">
          Overview
        </h2>
        <p className="soha-week1__focus">{SOHA_WEEK1_LESSON1_OVERVIEW}</p>

        <p className="soha-week1__plan-points">{SOHA_WEEK1_LESSON1_PLAN_NOTE(planPoints)}</p>

        <h3 className="soha-week1__subheading">Questions you missed on the diagnostic</h3>
        <p className="soha-week1__focus">{SOHA_WEEK1_LESSON1_DIAGNOSTIC_NOTE}</p>
        <ul className="soha-week1__miss-list">
          {SOHA_WEEK1_LESSON1_DIAGNOSTIC_MISSES.map((miss) => (
            <li key={`${miss.module}-${miss.question}`} className="soha-week1__miss-item">
              <span className="soha-week1__miss-meta">
                {miss.module} · {miss.question} · {miss.difficulty}
              </span>
              <span className="soha-week1__miss-label">
                You chose <strong>{miss.yourAnswer}</strong>. Correct answer:{" "}
                <strong>{miss.correctAnswer}</strong>. {miss.note}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="soha-week1__section" aria-labelledby="lesson-deck">
        <h2 className="soha-week1__heading" id="lesson-deck">
          Lesson
        </h2>
        <p className="soha-week1__habit soha-week1__lesson-open">
          <Link href={WEEK1_SLIDE_DECK_HREF} className="aurora-btn-primary">
            Open lesson fullscreen
          </Link>
        </p>
        <SlideEmbed title={`${section} · ${skill}`} src={WEEK1_SLIDE_DECK_HREF} />
      </section>

      <section className="soha-week1__section" id="homework" aria-labelledby="lesson-homework">
        <h2 className="soha-week1__heading" id="lesson-homework">
          Homework
        </h2>
        <p className="soha-week1__focus">
          Complete these steps after your Lesson 1 session (Wednesday, June 24).
        </p>
        <Week1HomeworkWorkflow />
      </section>
    </div>
  );
}
