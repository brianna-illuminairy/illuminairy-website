"use client";

import { NorthStar } from "@/components/logo";
import { LeadMagnetForm } from "@/components/lead-magnet-form";
import { MagnetFunnelTracker } from "@/components/magnet-funnel-tracker";
import type { MagnetGrowthHero } from "@/funnel/landing/magnets/resolve-hero";
import type { MagnetFunnelContext } from "@/funnel/lib/magnet-funnel";
import { magnetFunnelDownloadPath } from "@/lib/magnet-growth-paths";
import type { LeadMagnet } from "@/lib/lead-magnets";
import { parentSatCopy } from "@/lib/parent-sat-copy";
import { satProgram, site } from "@/lib/site";

export function MagnetFunnelPage({
  magnet,
  hero,
  context,
  mode = "landing"
}: {
  magnet: LeadMagnet;
  hero: MagnetGrowthHero;
  context: MagnetFunnelContext;
  mode?: "landing" | "gate";
}) {
  const downloadPath = magnetFunnelDownloadPath();

  return (
    <>
      <MagnetFunnelTracker context={context} />
      <div className="magnet-funnel-inner flex min-h-dvh flex-col">
        <header className="flex justify-center px-5 pt-8 sm:pt-10">
          <div className="flex items-center gap-2.5" aria-label="Illuminairy SAT">
            <NorthStar size={22} tone="ink" glow />
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-ivory">
              Illuminairy
            </span>
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center px-5 pb-10 pt-6 sm:px-8 sm:pb-14">
          <div
            className={
              mode === "gate"
                ? "mx-auto w-full max-w-md"
                : "mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14"
            }
          >
            {mode === "landing" ? (
              <div className="order-2 lg:order-1">
                <p className="eyebrow text-gold-light">{hero.eyebrow}</p>
                <h1 className="mt-5 text-balance text-[clamp(1.75rem,1.25rem+2.5vw,2.75rem)] font-extralight leading-[1.06] tracking-[-0.035em] text-ivory">
                  {hero.headline}
                </h1>
                <p className="mt-5 max-w-xl text-pretty text-[16px] leading-[1.65] text-ivory/72">
                  {hero.subhead}
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {hero.bullets.map((item) => (
                    <span key={item} className="magnet-funnel-chip">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="magnet-funnel-preview mt-10 hidden lg:block" aria-hidden>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gold-light/80">
                    Inside the PDF
                  </p>
                  <ul className="mt-4 space-y-2.5 text-[13px] leading-snug text-ivory/75">
                    {parentSatCopy.module2LpPreview.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="eyebrow text-gold-light">{hero.eyebrow}</p>
                <h1 className="mt-4 text-[1.5rem] font-light tracking-[-0.03em] text-ivory sm:text-[1.65rem]">
                  {hero.formHeadline}
                </h1>
                <p className="mt-3 text-[15px] text-ivory/65">{hero.formSubline}</p>
              </div>
            )}

            <div
              id="get-guide"
              className={`magnet-funnel-capture scroll-mt-6 rounded-2xl p-6 sm:p-8 ${
                mode === "landing" ? "order-1 lg:order-2" : "mt-8"
              }`}
            >
              {mode === "landing" && (
                <>
                  <p className="text-center text-[11px] font-bold uppercase tracking-[0.16em] text-ivory/50">
                    Free download · instant access
                  </p>
                  <p className="mt-3 text-center text-[1.15rem] font-medium tracking-[-0.02em] text-ivory">
                    {hero.formHeadline}
                  </p>
                </>
              )}
              <LeadMagnetForm
                slug={magnet.slug}
                klaviyoSource={magnet.klaviyoSource}
                downloadPath={downloadPath}
                theme="dark"
                submitLabel={hero.submitLabel}
                successOpenLabel={hero.successOpenLabel}
              />
              <p className="mt-4 text-center text-[11px] leading-relaxed text-ivory/45">
                Save as PDF from your browser · Unsubscribe anytime
              </p>
            </div>
          </div>
        </main>

        <footer className="px-5 pb-8 text-center sm:px-8">
          <p className="text-[11px] leading-relaxed text-ivory/40">
            Atlanta · {site.satDate} SAT · {satProgram.tuitionDisplay} Accelerator · Georgia
            Tech mentors 1450+ · No score or admission guarantees
          </p>
        </footer>
      </div>
    </>
  );
}
