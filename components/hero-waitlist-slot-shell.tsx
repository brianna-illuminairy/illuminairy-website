import { Suspense } from "react";
import { HeroWaitlistSlot } from "@/components/hero-waitlist-slot";
import { heroGenericOutcomes, heroOutcomePrefix } from "@/lib/hero-search-outcomes";
import { homePlatform } from "@/lib/site";

function HeroWaitlistFallback() {
  const first = heroGenericOutcomes[0];
  return (
    <div className="max-w-xl">
      <h1 className="text-balance text-[clamp(1.65rem,1rem+3.2vw,3rem)] font-bold leading-[1.12] tracking-tight text-primary">
        {heroOutcomePrefix} <span className="text-accent">{first}</span>
      </h1>
      <div className="hero-slot-cabinet mt-6">
        <p className="hero-slot-cabinet-title">{homePlatform.waitlist.slotTitle}</p>
      </div>
    </div>
  );
}

export function HeroWaitlistSlotShell() {
  return (
    <Suspense fallback={<HeroWaitlistFallback />}>
      <HeroWaitlistSlot />
    </Suspense>
  );
}
