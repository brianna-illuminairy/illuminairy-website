import type { Metadata } from "next";
import { ListFitTool } from "@/components/list-fit-check/list-fit-tool";
import { Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Georgia List Fit Check",
  description:
    "See where your student's SAT sits vs published bands for UGA, Georgia Tech, and Emory — honest context, not admission odds.",
  robots: { index: true, follow: true }
};

export default function GeorgiaListFitPage() {
  return (
    <section className="px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
      <div className="mx-auto max-w-lg">
        <Eyebrow tone="gold">Free tool</Eyebrow>
        <h1 className="mt-3 font-serif text-[1.75rem] leading-tight tracking-[-0.02em] text-ink">
          Georgia SAT &amp; GPA list check
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
          Enter your student&apos;s GPA and latest SAT score. See combined and
          section score targets based on published ranges for UGA, Georgia Tech,
          and Emory — not a chance-of-admission calculator.
        </p>
        <div className="mt-8">
          <ListFitTool />
        </div>
      </div>
    </section>
  );
}
