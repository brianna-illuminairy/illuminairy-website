import Link from "next/link";

export function ShermeenWeek1HubContent() {
  return (
    <div className="shermeen-week1 aurora-portal__content">
      <header className="aurora-portal__page-head">
        <p className="aurora-eyebrow">Illuminairy · Week 1</p>
        <h1 className="aurora-portal__title">Reading &amp; Writing · Transitions</h1>
        <p className="aurora-portal__lede">
          Lesson 1 interactive deck — name the relationship between two sentences, then pick the
          transition that matches.
        </p>
      </header>

      <section className="shermeen-week1__section">
        <h2 className="shermeen-week1__heading">This week</h2>
        <ul className="shermeen-week1__goals">
          <li>
            <Link href="/shermeen/week-1/lesson-1" className="shermeen-week1__inline-link">
              Lesson 1 · Transitions · interactive lesson deck
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
