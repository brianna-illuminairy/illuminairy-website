import type { Metadata } from "next";
import { FunnelSchedule } from "@/components/funnel-schedule";
import { Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Schedule Your Free Consultation",
  description:
    "Book a free SAT Accelerator consultation with Illuminairy after your application.",
  robots: { index: false, follow: false }
};

export default function GetStartedSchedulePage() {
  return (
    <section className="px-5 pb-12 pt-8 sm:px-8 sm:pt-12">
      <div className="mx-auto max-w-3xl">
        <Eyebrow tone="gold">SAT Accelerator</Eyebrow>
        <h1 className="mt-3 font-serif text-[1.65rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2rem]">
          Schedule your free consultation
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
          A parent or guardian should join. We review every application and use
          your answers on the call.
        </p>
        <FunnelSchedule />
      </div>
    </section>
  );
}
