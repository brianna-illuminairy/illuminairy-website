import { Check, X } from "lucide-react";
import { inPersonComparison } from "@/lib/site";
import { Eyebrow, SectionHeader } from "@/components/ui";

export function InPersonComparison() {
  return (
    <section className="bg-ivory-200/40 px-5 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow={inPersonComparison.eyebrow}
          title={inPersonComparison.title}
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {inPersonComparison.columns.map((col) => (
            <div
              key={col.label}
              className="rounded-3xl border border-line bg-ivory-50 p-7"
            >
              <Eyebrow tone="ink">{col.label}</Eyebrow>
              <ul className="mt-6 space-y-4">
                {col.problems.map((p) => (
                  <li key={p} className="flex gap-3 text-[14.5px] leading-[1.6] text-ink-muted">
                    <X
                      className="mt-0.5 h-4 w-4 shrink-0 text-terracotta"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="rounded-3xl border border-gold/30 bg-ivory p-7 shadow-gold">
            <Eyebrow tone="gold">{inPersonComparison.illuminairyAnswer.label}</Eyebrow>
            <ul className="mt-6 space-y-4">
              {inPersonComparison.illuminairyAnswer.points.map((p) => (
                <li key={p} className="flex gap-3 text-[14.5px] font-medium leading-[1.6] text-ink">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
