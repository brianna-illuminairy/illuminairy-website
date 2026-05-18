import { Check } from "lucide-react";
import { LeadMagnetForm } from "@/components/lead-magnet-form";
import { NorthStar } from "@/components/logo";
import { getGuideFunnelCopy } from "@/lib/guides-marketing";
import type { LeadMagnet } from "@/lib/lead-magnets";
import { site } from "@/lib/site";

export function GuideLanding({ magnet }: { magnet: LeadMagnet }) {
  const downloadPath = `/guides/${magnet.slug}/download`;
  const funnel = getGuideFunnelCopy(magnet.slug);

  return (
    <section className="guide-hero flex flex-1 flex-col px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
      <div className="guide-hero-grid mx-auto flex w-full max-w-lg flex-1 flex-col">
        <div className="text-center">
          <NorthStar size={24} tone="ink" glow className="mx-auto" />
          <p className="eyebrow mt-5 text-gold-light">{funnel.eyebrow}</p>
          <h1 className="mt-5 text-balance text-[clamp(1.5rem,1.1rem+1.5vw,2.2rem)] font-extralight leading-[1.1] tracking-[-0.03em] text-ivory">
            {magnet.title}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-pretty text-[15px] leading-[1.65] text-ivory/72">
            {magnet.description}
          </p>
        </div>

        <ul className="mt-8 space-y-2.5" aria-label="What is inside this SAT guide">
          {magnet.bullets.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-[14px] leading-snug text-ivory/88"
            >
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-gold-light"
                strokeWidth={2}
                aria-hidden
              />
              {item}
            </li>
          ))}
        </ul>

        <div
          id="download"
          className="guide-card-glass mt-10 scroll-mt-8 rounded-2xl p-7 sm:p-8"
        >
          <p className="text-center text-[1.2rem] font-light tracking-[-0.02em] text-ivory">
            {funnel.formHeadline}
          </p>
          <p className="mt-2 text-center text-[13.5px] leading-relaxed text-ivory/60">
            {funnel.formSubline}
          </p>
          <LeadMagnetForm
            slug={magnet.slug}
            klaviyoSource={magnet.klaviyoSource}
            downloadPath={downloadPath}
            theme="dark"
            submitLabel={funnel.submitLabel}
            successOpenLabel={funnel.successOpenLabel}
          />
        </div>

        <p className="mt-8 text-center text-[11px] leading-relaxed text-ivory/45">
          Illuminairy · Atlanta · August {site.satDate} SAT
        </p>
      </div>
    </section>
  );
}
