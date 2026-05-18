import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";
import { ArrowRight } from "lucide-react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "dark" | "ghost";
  icon?: ComponentType<LucideProps>;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  icon: Icon = ArrowRight
}: ButtonLinkProps) {
  const styles = {
    primary:
      "border-ink bg-ink text-white shadow-[0_18px_40px_rgba(11,13,18,0.18)] hover:-translate-y-0.5 hover:bg-graphite",
    secondary:
      "border-line bg-white text-ink hover:-translate-y-0.5 hover:border-indigo/30 hover:bg-cloud",
    dark:
      "border-white/15 bg-white text-ink hover:-translate-y-0.5 hover:bg-cloud",
    ghost:
      "border-transparent bg-transparent text-ink hover:bg-ink/5"
  };

  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition duration-200 ${styles[variant]}`}
    >
      <span>{children}</span>
      <Icon className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 inline-flex rounded-full border border-indigo/15 bg-indigo/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-indigo">
      {children}
    </p>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  text,
  align = "left"
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-balance text-3xl font-semibold tracking-[-0.045em] text-ink sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {text && (
        <p className="mt-5 text-pretty text-base leading-7 text-slatecopy sm:text-lg">
          {text}
        </p>
      )}
    </div>
  );
}

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
    <article className="rounded-lg border border-line bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-ringed">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-indigo/15 bg-indigo/5 text-indigo">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      {meta && <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-indigo">{meta}</p>}
      <h3 className="text-lg font-semibold tracking-[-0.025em] text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slatecopy">{text}</p>
    </article>
  );
}

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
    <section className="px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <SectionHeader eyebrow={eyebrow} title={title} text={text} />
        <div>{children}</div>
      </div>
    </section>
  );
}

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
    <section className="relative overflow-hidden px-5 pb-12 pt-12 sm:px-8 lg:px-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(91,124,255,0.12),transparent_35%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]" />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div className="max-w-4xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="text-balance text-5xl font-semibold tracking-[-0.065em] text-ink sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-slatecopy sm:text-xl">
            {text}
          </p>
          {(primary || secondary) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
    <section className="px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-ink px-6 py-12 text-white shadow-soft sm:px-10 lg:px-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-electric">
              Next step
            </p>
            <h2 className="max-w-3xl text-balance text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
              {title}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">{text}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <ButtonLink href={primary.href} variant="dark">
              {primary.label}
            </ButtonLink>
            {secondary && (
              <ButtonLink href={secondary.href} variant="ghost">
                <span className="text-white">{secondary.label}</span>
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
