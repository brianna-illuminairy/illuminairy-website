import { Check } from "lucide-react";
import { noGuarantee } from "@/lib/site";
import { Eyebrow } from "@/components/ui";

export function NoGuaranteeSection() {
  return (
    <section className="px-5 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-line bg-ivory-50 p-9 shadow-editorial sm:p-11">
          <Eyebrow tone="gold">{noGuarantee.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-balance text-[clamp(1.75rem,1.1rem+2.4vw,3rem)] font-light leading-[1.1] tracking-[-0.025em] text-ink">
            {noGuarantee.title}
          </h2>
          <p className="mt-6 max-w-2xl text-[15.5px] leading-[1.75] text-ink-soft">
            {noGuarantee.summary}
          </p>

          <div className="mt-8 border-t border-line pt-8">
            <p className="eyebrow text-gold-deep">What we commit to instead</p>
            <ul className="mt-5 space-y-4">
              {noGuarantee.commitments.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-[1.65] text-ink">
                  <Check
                    className="mt-1 h-4 w-4 shrink-0 text-gold-deep"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 border-t border-line pt-8 text-[14.5px] leading-[1.7] text-ink-soft">
            {noGuarantee.closing}
          </p>
        </div>
      </div>
    </section>
  );
}
