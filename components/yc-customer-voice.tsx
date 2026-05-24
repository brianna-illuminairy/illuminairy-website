import { YcSection } from "@/components/yc-section";
import { SectionHeader } from "@/components/ui";
import { homePlatform } from "@/lib/site";

export function YcCustomerVoice() {
  const { customerVoice } = homePlatform;

  return (
    <YcSection className="bg-surface-elevated">
      <SectionHeader
        eyebrow={customerVoice.eyebrow}
        title={customerVoice.title}
      />
      <ul className="mt-10 space-y-6">
        {customerVoice.quotes.map((q) => (
          <li key={q.text.slice(0, 48)} className="border-l-2 border-accent pl-5">
            <blockquote className="text-base leading-relaxed text-primary">
              &ldquo;{q.text}&rdquo;
            </blockquote>
            <p className="mt-2 text-xs text-primary-muted">{q.source}</p>
          </li>
        ))}
      </ul>
    </YcSection>
  );
}
