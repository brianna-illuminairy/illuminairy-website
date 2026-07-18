import Link from "next/link";
import { SlideEmbed } from "@/components/skye/lesson-shared";

export const SKYE_SAT_ALGEBRA_HREF = "/skye/files/algebra-lesson-1-linear-equations";

export function SkyeSatAlgebraContent() {
  return (
    <div className="skye-lesson-deck">
      <header className="aurora-portal__page-head" id="sat-algebra">
        <p className="aurora-eyebrow">Illuminairy · Bonus session</p>
        <h1 className="aurora-portal__title">SAT Algebra · linear equations</h1>
        <p className="aurora-portal__lede">
          Saturday bonus review (about 3 hours). One-variable equations — use the slides if you
          miss the live session. The recording will be posted here afterward.
        </p>
      </header>

      <section className="skye-lesson-deck__section" aria-labelledby="sat-algebra-deck">
        <h2 className="skye-lesson-deck__heading" id="sat-algebra-deck">
          Lesson slides
        </h2>
        <p className="skye-lesson-deck__habit">
          <Link href={SKYE_SAT_ALGEBRA_HREF} className="aurora-btn-primary">
            Open lesson fullscreen
          </Link>
        </p>
        <SlideEmbed title="SAT Algebra · Linear Equations Lesson 1" src={SKYE_SAT_ALGEBRA_HREF} />
      </section>

      <section className="skye-lesson-deck__section" aria-labelledby="sat-algebra-video">
        <h2 className="skye-lesson-deck__heading" id="sat-algebra-video">
          Session recording
        </h2>
        <p className="skye-lesson-deck__focus">
          Coming after class — the live Saturday review video will appear on this page.
        </p>
      </section>
    </div>
  );
}
