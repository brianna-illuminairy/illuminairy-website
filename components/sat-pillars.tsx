import { satPillars } from "@/lib/site";
import { FeatureCard, SectionHeader } from "@/components/ui";

export function SatPillars() {
  return (
    <section className="bg-ivory px-5 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow={satPillars.eyebrow}
          title={satPillars.title}
          text={satPillars.intro}
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {satPillars.cards.map((card) => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
