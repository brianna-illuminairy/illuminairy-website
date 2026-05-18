import { CalendlyInline } from "@/components/calendly-inline";
import { SectionHeader } from "@/components/ui";

type CalendlyBookingSectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  text?: string;
};

export function CalendlyBookingSection({
  id = "schedule",
  eyebrow = "Book a consultation",
  title = "Pick a time that works for you.",
  text = "Schedule a short call to discuss the SAT Accelerator, cohort fit, and next steps. No obligation — just a clear conversation."
}: CalendlyBookingSectionProps) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-line/70 bg-ivory-200/40 px-5 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <SectionHeader eyebrow={eyebrow} title={title} text={text} />
        <div className="mt-10">
          <CalendlyInline />
        </div>
      </div>
    </section>
  );
}
