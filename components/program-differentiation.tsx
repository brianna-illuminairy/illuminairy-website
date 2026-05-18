import { mentorshipMessaging, programDifferentiation } from "@/lib/site";
import { SectionHeader } from "@/components/ui";

export function ProgramDifferentiation({ showResearchNote = true }: { showResearchNote?: boolean }) {
  return (
    <section className="bg-ivory-200/40 px-5 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow={programDifferentiation.eyebrow}
          title={programDifferentiation.title}
          text={programDifferentiation.intro}
        />

        <div className="mt-12 overflow-hidden rounded-3xl border border-line bg-ivory shadow-editorial">
          <div className="grid border-b border-line bg-navy-gradient px-5 py-4 text-[11px] font-bold uppercase tracking-[0.1em] text-ivory sm:grid-cols-[0.85fr_1fr_1fr] sm:px-6">
            <span className="hidden sm:block" />
            <span className="text-ivory/70">Typical SAT program</span>
            <span className="text-gold-light">Illuminairy</span>
          </div>
          <ul>
            {programDifferentiation.rows.map((row, i) => (
              <li
                key={row.aspect}
                className={`grid gap-4 border-line px-5 py-6 sm:grid-cols-[0.85fr_1fr_1fr] sm:gap-6 sm:px-6 ${
                  i > 0 ? "border-t" : ""
                }`}
              >
                <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-gold-deep">
                  {row.aspect}
                </p>
                <p className="text-[14px] leading-[1.6] text-ink-muted">{row.typical}</p>
                <p className="text-[14px] font-medium leading-[1.6] text-ink">{row.illuminairy}</p>
              </li>
            ))}
          </ul>
        </div>

        {showResearchNote ? (
          <p className="mt-8 max-w-3xl text-[14px] leading-[1.7] text-ink-soft">
            <span className="font-medium text-ink">{mentorshipMessaging.thesis}</span>{" "}
            {mentorshipMessaging.researchNote}
          </p>
        ) : null}
      </div>
    </section>
  );
}
