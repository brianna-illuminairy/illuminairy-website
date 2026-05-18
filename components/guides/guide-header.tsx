import { NorthStar } from "@/components/logo";

/** Logo mark only — no navigation (standalone funnel). */
export function GuideHeader() {
  return (
    <header className="guide-funnel-header border-b border-white/10 bg-navy/95 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-center px-5 sm:px-8">
        <div className="flex items-center gap-2.5" aria-label="Illuminairy">
          <NorthStar size={20} tone="ink" glow />
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-ivory">
            Illuminairy <span className="font-normal text-ivory/55">· SAT</span>
          </span>
        </div>
      </div>
    </header>
  );
}
