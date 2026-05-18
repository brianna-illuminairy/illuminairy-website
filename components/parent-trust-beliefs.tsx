import { parentTrustBeliefs } from "@/lib/site";
import { FeatureCard, SectionHeader } from "@/components/ui";

export function ParentTrustBeliefs() {
  return (
    <section className="bg-ivory px-5 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow={parentTrustBeliefs.eyebrow}
          title={parentTrustBeliefs.title}
          text="These are the things families look for — and the things we build around."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {parentTrustBeliefs.beliefs.map((belief) => (
            <FeatureCard key={belief.title} {...belief} />
          ))}
        </div>
      </div>
    </section>
  );
}
