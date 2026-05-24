import { YcBeforeAfter } from "@/components/yc-before-after";
import { PainRankChart } from "@/components/pain-rank-chart";
import { YcSection } from "@/components/yc-section";
import { Eyebrow } from "@/components/ui";
import { homePlatform } from "@/lib/site";

export function YcPainVoice() {
  const { painVoice } = homePlatform;

  return (
    <YcSection id="pain" className="overflow-hidden border-y border-border bg-surface">
      <div className="mx-auto max-w-content">
        <Eyebrow>{painVoice.eyebrow}</Eyebrow>
        <h2 className="mt-3 max-w-2xl text-balance text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          {painVoice.title}
        </h2>
        <p className="mt-3 max-w-2xl text-pretty text-base leading-relaxed text-primary-muted">
          {painVoice.lead}
        </p>
        <p className="mt-2 text-xs text-primary-muted">{painVoice.methodNote}</p>
      </div>

      <PainRankChart />

      <YcBeforeAfter />

      <p className="mx-auto mt-8 max-w-content text-center text-sm font-medium text-accent">
        {painVoice.bridge}
      </p>
    </YcSection>
  );
}
