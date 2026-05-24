import { Flag, Map, User } from "lucide-react";
import { IlluminairyMark, Wordmark } from "@/components/logo";
import { YcSection } from "@/components/yc-section";
import { Eyebrow } from "@/components/ui";
import { homePlatform } from "@/lib/site";

const partIcons = {
  you: User,
  luminairy: null,
  illuminate: Map
} as const;

export function YcBrandEquation() {
  const { brandEquation: eq } = homePlatform;

  return (
    <YcSection id="formula" className="border-y border-border bg-surface-elevated">
      <Eyebrow>{eq.eyebrow}</Eyebrow>
      <h2 className="mt-3 text-balance text-2xl font-bold tracking-tight text-primary sm:text-3xl">
        {eq.title}
      </h2>
      <p className="mt-3 max-w-2xl text-pretty text-base leading-relaxed text-primary-muted">
        {eq.subtitle}
      </p>

      <div className="brand-equation mt-10" aria-label="How Illuminairy turns ambition into outcomes">
        <ol className="brand-equation-track">
          {eq.parts.map((part, index) => {
            const Icon = partIcons[part.id as keyof typeof partIcons];
            const isLuminairy = part.id === "luminairy";

            return (
              <li key={part.id} className="brand-equation-step">
                {index > 0 && (
                  <span className="brand-equation-op" aria-hidden="true">
                    +
                  </span>
                )}
                <article
                  className={[
                    "brand-equation-card",
                    part.id === "illuminate" ? "brand-equation-card--illuminate" : "",
                    isLuminairy ? "brand-equation-card--luminairy" : "",
                    part.id === "you" ? "brand-equation-card--you" : ""
                  ].join(" ")}
                >
                  <div className="brand-equation-card-icon" aria-hidden>
                    {isLuminairy ? (
                      <IlluminairyMark size={36} />
                    ) : Icon ? (
                      <Icon className="h-8 w-8 text-accent" strokeWidth={1.75} />
                    ) : null}
                  </div>
                  <p className="brand-equation-symbol">
                    {isLuminairy ? (
                      <Wordmark size="lg" className="!text-primary" />
                    ) : (
                      part.symbol
                    )}
                  </p>
                  <p className="brand-equation-role">{part.role}</p>
                  <p className="brand-equation-def">{part.definition}</p>
                </article>
              </li>
            );
          })}

          <li className="brand-equation-step brand-equation-step--result">
            <span className="brand-equation-op brand-equation-op--equals" aria-hidden="true">
              =
            </span>
            <article className="brand-equation-card brand-equation-card--goal">
              <div className="brand-equation-card-icon" aria-hidden>
                <Flag className="h-8 w-8 text-[var(--color-brand-gold)]" strokeWidth={1.75} />
              </div>
              <p className="brand-equation-symbol text-[var(--color-brand-gold)]">
                {eq.result.symbol}
              </p>
              <p className="brand-equation-role">{eq.result.role}</p>
              <p className="brand-equation-def">{eq.result.definition}</p>
            </article>
          </li>
        </ol>
      </div>

      <p className="mt-8 max-w-2xl text-sm leading-relaxed text-primary-muted">{eq.footnote}</p>
    </YcSection>
  );
}
