import type { Metadata } from "next";
import { FunnelIntakeForm } from "@/components/funnel-intake-form";
import { Eyebrow } from "@/components/ui";
import { qualificationIntake } from "@/lib/sat-qualification";

export const metadata: Metadata = {
  title: "Apply for the August Program",
  description:
    "Short application for the Illuminairy SAT Accelerator — August 22, 2026. About three minutes, then schedule your free parent consultation.",
  robots: { index: false, follow: false }
};

export default function GetStartedPage() {
  return (
    <section className="px-5 pb-8 pt-8 sm:px-8 sm:pt-12">
      <div className="mx-auto max-w-xl">
        <Eyebrow tone="gold">{qualificationIntake.eyebrow}</Eyebrow>
        <h1 className="mt-3 font-serif text-[1.65rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2rem]">
          Apply for the August program
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink">
          {qualificationIntake.intro}
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
          {qualificationIntake.introNext}
        </p>
        <FunnelIntakeForm />
      </div>
    </section>
  );
}
