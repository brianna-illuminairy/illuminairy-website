import { YcSection } from "@/components/yc-section";
import { SectionHeader } from "@/components/ui";
import { homePlatform } from "@/lib/site";

export function YcFounderStory() {
  const { founderStory } = homePlatform;

  return (
    <YcSection id="founder">
      <SectionHeader eyebrow={founderStory.eyebrow} title={founderStory.title} />
      <div className="mt-8 max-w-3xl space-y-5">
        {founderStory.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="text-base leading-relaxed text-primary-muted">
            {paragraph}
          </p>
        ))}
      </div>
    </YcSection>
  );
}
