import Link from "next/link";
import { SlideEmbed } from "@/components/shermeen/week1-shared";

export const SHERMEEN_SAT_ALGEBRA_HREF = "/shermeen/files/algebra-lesson-1-linear-equations";

export function ShermeenSatAlgebraContent() {
  return (
    <div className="shermeen-week1 aurora-portal__content">
      <header className="aurora-portal__page-head" id="sat-algebra">
        <p className="aurora-eyebrow">Illuminairy · Bonus session</p>
        <h1 className="aurora-portal__title">SAT Algebra · linear equations</h1>
        <p className="aurora-portal__lede">
          Saturday bonus review (about 3 hours). One-variable equations — work the slides if you
          cannot attend live. The session recording will be added here afterward.
        </p>
      </header>

      <section className="shermeen-week1__section" aria-labelledby="sat-algebra-deck">
        <h2 className="shermeen-week1__heading" id="sat-algebra-deck">
          Lesson
        </h2>
        <p className="shermeen-week1__habit">
          <Link href={SHERMEEN_SAT_ALGEBRA_HREF} className="aurora-btn-primary">
            Open lesson fullscreen
          </Link>
        </p>
        <SlideEmbed title="SAT Algebra · Linear Equations Lesson 1" src={SHERMEEN_SAT_ALGEBRA_HREF} />
      </section>

      <section className="shermeen-week1__section" aria-labelledby="sat-algebra-video">
        <h2 className="shermeen-week1__heading" id="sat-algebra-video">
          Session recording
        </h2>
        <p className="aurora-portal__lede">
          Coming after class — the live Saturday review video will appear on this page.
        </p>
      </section>
    </div>
  );
}
