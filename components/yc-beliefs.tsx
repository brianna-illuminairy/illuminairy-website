import { YcSection } from "@/components/yc-section";
import { SectionHeader } from "@/components/ui";
import { homePlatform } from "@/lib/site";

export function YcBeliefs() {
  const { beliefs } = homePlatform;

  return (
    <YcSection className="border-y border-border bg-accent-soft/20">
      <SectionHeader eyebrow={beliefs.eyebrow} title={beliefs.title} text={beliefs.intro} />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {beliefs.items.map((item, index) => (
          <li
            key={item.title}
            className="rounded-lg border border-border bg-surface-elevated p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              {index + 1}
            </p>
            <h3 className="mt-1 text-base font-semibold leading-snug text-primary">
              {item.title}
            </h3>
          </li>
        ))}
      </ul>
    </YcSection>
  );
}
