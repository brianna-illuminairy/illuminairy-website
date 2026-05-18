import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";
import { ArrowRight } from "lucide-react";

/* ----------------------------- Button ----------------------------- */

type ButtonVariant = "primary" | "secondary" | "ghost" | "gold" | "navy";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  icon?: ComponentType<LucideProps> | null;
};

const buttonStyles: Record<ButtonVariant, string> = {
  // Primary: warm near-black on ivory, ivory text
  primary:
    "border-ink bg-ink text-ivory hover:-translate-y-0.5 hover:bg-ink-soft shadow-[0_18px_40px_-12px_rgba(22,18,10,0.30)]",
  // Secondary: ivory with warm line, ink text — restrained
  secondary:
    "border-line-strong bg-ivory text-ink hover:-translate-y-0.5 hover:border-ink/40 hover:bg-ivory-200",
  // Ghost: borderless, used inside dark surfaces
  ghost:
    "border-transparent bg-transparent text-ivory hover:bg-ivory/10",
  // Gold: candlelight CTA — used sparingly for the brand "moment" CTA
  gold:
    "border-gold bg-gold text-ink hover:-translate-y-0.5 hover:bg-gold-light shadow-[0_18px_40px_-14px_rgba(143,110,12,0.40)]",
  // Navy: dark authority on ivory surfaces
  navy:
    "border-navy bg-navy text-ivory hover:-translate-y-0.5 hover:bg-navy-soft shadow-navy"
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  icon: Icon = ArrowRight
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-5 text-[13.5px] font-semibold tracking-[-0.01em] transition duration-200 ${buttonStyles[variant]}`}
    >
      <span>{children}</span>
      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
    </Link>
  );
}

/* ----------------------------- Eyebrow ----------------------------- */

export function Eyebrow({
  children,
  tone = "ink"
}: {
  children: ReactNode;
  tone?: "ink" | "gold" | "ivory" | "navy" | "sage" | "marigold" | "terracotta" | "sky";
}) {
  const toneClass = {
    ink: "text-ink-soft",
    gold: "text-gold-deep",
    ivory: "text-ivory",
    navy: "text-navy",
    sage: "text-sage-ink",
    marigold: "text-marigold-ink",
    terracotta: "text-terracotta-ink",
    sky: "text-sky-ink"
  }[tone];

  return (
    <p className={`eyebrow inline-flex items-center gap-2 ${toneClass}`}>
      <span aria-hidden="true" className="inline-block h-px w-6 bg-current opacity-50" />
      {children}
    </p>
  );
}

/* ----------------------------- Headings ----------------------------- */

export function SectionHeader({
  eyebrow,
  title,
  text,
  align = "left",
  tone = "ink"
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  tone?: "ink" | "ivory";
}) {
  const isLight = tone === "ivory";

  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <Eyebrow tone={isLight ? "ivory" : "ink"}>{eyebrow}</Eyebrow>}
      <h2
        className={`mt-4 text-balance text-[clamp(2rem,1.4rem+2.4vw,3.5rem)] font-light tracking-[-0.035em] leading-[1.04] ${
          isLight ? "text-ivory" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {text && (
        <p
          className={`mt-5 text-pretty text-[1.0625rem] leading-[1.7] sm:text-lg ${
            isLight ? "text-ivory/72" : "text-ink-soft"
          }`}
        >
          {text}
        </p>
      )}
    </div>
  );
}

/* ----------------------------- Feature card ----------------------------- */

export function FeatureCard({
  icon: Icon,
  title,
  text,
  meta
}: {
  icon: ComponentType<LucideProps>;
  title: string;
  text: string;
  meta?: string;
}) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-line bg-ivory-50 p-7 transition duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-gold">
      <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gold/20 bg-gold/10 text-gold-deep">
        <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={1.6} />
      </div>
      {meta && (
        <p className="eyebrow mb-2 text-gold-deep">{meta}</p>
      )}
      <h3 className="text-[1.125rem] font-semibold tracking-[-0.018em] text-ink">
        {title}
      </h3>
      <p className="mt-3 text-[0.9375rem] leading-[1.65] text-ink-soft">{text}</p>
    </article>
  );
}

/* ----------------------------- Split section ----------------------------- */

export function SplitSection({
  eyebrow,
  title,
  text,
  children
}: {
  eyebrow?: string;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <section className="px-5 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <SectionHeader eyebrow={eyebrow} title={title} text={text} />
        <div>{children}</div>
      </div>
    </section>
  );
}

/* ----------------------------- Page hero ----------------------------- */

export function PageHero({
  eyebrow,
  title,
  text,
  primary,
  secondary,
  children
}: {
  eyebrow: string;
  title: string;
  text: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-16 sm:px-8 lg:px-12">
      <div className="absolute inset-0 -z-10 bg-ivory-gradient" />
      <div className="absolute inset-0 -z-10 bg-paper-grain" />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="max-w-3xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 text-balance text-[clamp(2.5rem,1.6rem+3.6vw,4.75rem)] font-light tracking-[-0.038em] leading-[0.98] text-ink">
            {title}
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-[1.65] text-ink-soft sm:text-xl">
            {text}
          </p>
          {(primary || secondary) && (
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {primary && <ButtonLink href={primary.href}>{primary.label}</ButtonLink>}
              {secondary && (
                <ButtonLink href={secondary.href} variant="secondary">
                  {secondary.label}
                </ButtonLink>
              )}
            </div>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

/* ----------------------------- Dark CTA ----------------------------- */

export function DarkCta({
  title,
  text,
  primary,
  secondary
}: {
  title: string;
  text: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="px-5 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-navy-gradient px-7 py-14 text-ivory shadow-navy sm:px-12 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_auto] lg:items-end">
          <div>
            <Eyebrow tone="ivory">Next step</Eyebrow>
            <h2 className="mt-5 max-w-3xl text-balance text-[clamp(2rem,1.4rem+2.4vw,3.5rem)] font-light tracking-[-0.035em] leading-[1.02]">
              {title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-[1.7] text-ivory/70 sm:text-lg">{text}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <ButtonLink href={primary.href} variant="gold">
              {primary.label}
            </ButtonLink>
            {secondary && (
              <ButtonLink href={secondary.href} variant="ghost">
                {secondary.label}
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- West Elm pop panel ----------------------------- */

type PopColor = "marigold" | "sage" | "terracotta" | "sky";

const popPalette: Record<
  PopColor,
  { bg: string; ink: string; eyebrowTone: "marigold" | "sage" | "terracotta" | "sky" }
> = {
  marigold: { bg: "bg-marigold", ink: "text-marigold-ink", eyebrowTone: "marigold" },
  sage: { bg: "bg-sage", ink: "text-sage-ink", eyebrowTone: "sage" },
  terracotta: { bg: "bg-terracotta", ink: "text-terracotta-ink", eyebrowTone: "terracotta" },
  sky: { bg: "bg-sky", ink: "text-sky-ink", eyebrowTone: "sky" }
};

/**
 * West Elm rule: one pop color at a time, owning a full-bleed section.
 * Always paired with ivory (or navy in `against="navy"`) — never combined with
 * another pop color in the same layout section.
 */
export function PopSection({
  color,
  eyebrow,
  title,
  text,
  primary,
  secondary,
  children,
  against = "ivory"
}: {
  color: PopColor;
  eyebrow: string;
  title: string;
  text?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  children?: ReactNode;
  against?: "ivory" | "navy";
}) {
  const p = popPalette[color];

  return (
    <section className={`${p.bg} relative overflow-hidden px-5 py-24 sm:px-8 lg:px-12`}>
      {/* Subtle paper-style noise overlay */}
      <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-30 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(0,0,0,0.10),transparent_50%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <Eyebrow tone={p.eyebrowTone}>{eyebrow}</Eyebrow>
          <h2
            className={`mt-5 text-balance text-[clamp(2.25rem,1.5rem+3vw,4rem)] font-light tracking-[-0.035em] leading-[0.98] ${p.ink}`}
          >
            {title}
          </h2>
          {text && (
            <p className={`mt-6 max-w-xl text-pretty text-lg leading-[1.65] ${p.ink} opacity-85`}>
              {text}
            </p>
          )}
          {(primary || secondary) && (
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {primary && (
                <Link
                  href={primary.href}
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-5 text-[13.5px] font-semibold tracking-[-0.01em] transition duration-200 ${
                    against === "ivory"
                      ? "border-ink bg-ink text-ivory hover:-translate-y-0.5 hover:bg-ink-soft"
                      : "border-navy bg-navy text-ivory hover:-translate-y-0.5 hover:bg-navy-soft"
                  }`}
                >
                  <span>{primary.label}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
              {secondary && (
                <Link
                  href={secondary.href}
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-5 text-[13.5px] font-semibold tracking-[-0.01em] transition duration-200 ${p.ink} border-current/30 bg-transparent hover:bg-white/10`}
                >
                  <span>{secondary.label}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
            </div>
          )}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}
