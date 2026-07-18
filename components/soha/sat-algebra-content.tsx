import Link from "next/link";
import { SlideEmbed } from "@/components/soha/week1-shared";

export const SOHA_SAT_ALGEBRA_HREF = "/soha/files/algebra-lesson-1-linear-equations";

export function SohaSatAlgebraContent() {
  return (
    <div className="soha-week1 aurora-portal__content">
      <header className="soha-week1__page-head" id="sat-algebra">
        <p className="aurora-eyebrow">Illuminairy · Bonus session</p>
        <h1 className="soha-week1__title">SAT Algebra · linear equations</h1>
        <p className="soha-week1__lede">
          Saturday bonus review (about 3 hours). One-variable equations — work the slides if you
          cannot attend live. The session recording will be added here afterward.
        </p>
      </header>

      <section className="soha-week1__section" aria-labelledby="sat-algebra-deck">
        <h2 className="soha-week1__heading" id="sat-algebra-deck">
          Lesson slides
        </h2>
        <p className="soha-week1__habit">
          <Link href={SOHA_SAT_ALGEBRA_HREF} className="aurora-btn-primary">
            Open lesson fullscreen
          </Link>
        </p>
        <SlideEmbed title="SAT Algebra · Linear Equations Lesson 1" src={SOHA_SAT_ALGEBRA_HREF} />
      </section>

      <section className="soha-week1__section" aria-labelledby="sat-algebra-video">
        <h2 className="soha-week1__heading" id="sat-algebra-video">
          Session recording
        </h2>
        <p className="soha-week1__focus">
          Coming after class — the live Saturday review video will appear on this page.
        </p>
      </section>
    </div>
  );
}
