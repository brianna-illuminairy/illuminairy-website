import Link from "next/link";
import { SlideEmbed } from "@/components/shermeen/week1-shared";

export const SHERMEEN_WEEK1_LESSON1_SLIDE_DECK_HREF = "/shermeen/files/transitions-lesson";

export function ShermeenWeek1Lesson1Content() {
  return (
    <div className="shermeen-week1 aurora-portal__content">
      <header className="aurora-portal__page-head" id="lesson-1">
        <p className="aurora-eyebrow">Illuminairy · Week 1 · Lesson 1</p>
        <h1 className="aurora-portal__title">Reading &amp; Writing · Transitions</h1>
        <p className="aurora-portal__lede">
          Interactive lesson deck — name the relationship between two sentences, then pick the
          transition that matches.
        </p>
      </header>

      <section className="shermeen-week1__section" aria-labelledby="lesson-deck">
        <h2 className="shermeen-week1__heading" id="lesson-deck">
          Lesson
        </h2>
        <p className="shermeen-week1__habit">
          <Link href={SHERMEEN_WEEK1_LESSON1_SLIDE_DECK_HREF} className="aurora-btn-primary">
            Open lesson fullscreen
          </Link>
        </p>
        <SlideEmbed title="Reading & Writing · Transitions" src={SHERMEEN_WEEK1_LESSON1_SLIDE_DECK_HREF} />
      </section>
    </div>
  );
}
