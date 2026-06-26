import Link from "next/link";
import { EquivalentExpressionsFormulaSheet } from "@/components/danielle/equivalent-expressions-formula-sheet";
import { DanielleNotConfigured } from "@/components/danielle/not-configured";
import { DaniellePortalShell } from "@/components/danielle/portal-shell";
import { requireDanielleAuth } from "@/lib/danielle-guard";
import { isDanielleConfigured } from "@/lib/danielle-auth";

export default async function DanielleWeek3FormulaSheetPage() {
  if (!isDanielleConfigured()) {
    return <DanielleNotConfigured />;
  }

  await requireDanielleAuth("/danielle/week-3/formula-sheet");

  return (
    <DaniellePortalShell>
      <div className="danielle-week1">
        <div className="danielle-portal__page-head">
          <p className="danielle-portal__eyebrow">Illuminairy · Week 3 · Quick reference</p>
          <h1>Equivalent expressions formula sheet</h1>
          <p className="danielle-portal__lede">
            Step 1 in the post-session workflow. Review this before the patterns deck and practice
            hub. Keep it open for Equivalent Expressions 3.
          </p>
          <p className="danielle-portal__lede danielle-week2__exercise-due-inline">
            <Link href="/danielle/week-3/lesson-2#post-session-resources" className="danielle-week1__inline-link">
              Post-session resources
            </Link>
            {" · "}
            <Link href="/danielle/week-3/lesson-2#post-session-homework" className="danielle-week1__inline-link">
              Homework
            </Link>
          </p>
        </div>

        <section className="danielle-week1__section">
          <EquivalentExpressionsFormulaSheet />
        </section>
      </div>
    </DaniellePortalShell>
  );
}
