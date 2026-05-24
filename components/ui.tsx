import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";
import { ArrowRight } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  icon?: ComponentType<LucideProps> | null;
  className?: string;
};

const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    "border-accent bg-accent text-accent-foreground hover:opacity-90 shadow-card",
  secondary:
    "border-border bg-surface-elevated text-primary hover:border-accent/40",
  ghost: "border-transparent bg-transparent text-primary hover:bg-surface-elevated"
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  icon: Icon = ArrowRight,
  className = ""
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-10 items-center justify-center gap-2 border px-4 text-[13px] font-semibold tracking-tight transition duration-200 ${buttonStyles[variant]} ${className}`}
    >
      <span>{children}</span>
      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
    </Link>
  );
}

export function Eyebrow({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
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
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-3 text-balance text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] font-semibold leading-tight tracking-tight text-primary">
        {title}
      </h2>
      {text && (
        <p className="mt-4 text-pretty text-[15px] leading-relaxed text-primary-muted sm:text-base">
          {text}
        </p>
      )}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  text
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <section className="border-b border-border bg-surface px-5 py-12 sm:px-6">
      <div className="mx-auto max-w-content">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
          {title}
        </h1>
        {text && (
          <p className="mt-4 max-w-2xl text-pretty text-primary-muted">{text}</p>
        )}
      </div>
    </section>
  );
}
