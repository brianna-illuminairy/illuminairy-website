import Link from "next/link";

/**
 * v2 mark — upward mentorship path, gold illumination at apex.
 * Uses currentColor for the path so it follows theme accent in the UI.
 */
export function IlluminairyMark({
  size = 32,
  className = ""
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`text-accent ${className}`.trim()}
    >
      <path
        d="M14 48 C22 40 28 34 32 26"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 26 V18"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="14" cy="48" r="4" className="fill-accent opacity-40" />
      <circle cx="32" cy="26" r="4.5" className="fill-accent" />
      <circle cx="32" cy="14" r="9" className="fill-[var(--color-brand-gold)] opacity-20" />
      <circle cx="32" cy="14" r="5.5" className="fill-[var(--color-brand-gold)]" />
      <circle cx="32" cy="14" r="2" className="fill-[var(--color-brand-gold-deep)] opacity-80" />
    </svg>
  );
}

/** @deprecated Use IlluminairyMark — alias for older imports */
export const NorthStar = IlluminairyMark;

/**
 * "illuminairy" wordmark — gold AI at center of the name.
 */
export function Wordmark({
  size = "md",
  tone = "brand",
  className = ""
}: {
  size?: "sm" | "md" | "lg" | "xl" | "display";
  /** brand = gold ai; solid = single ink color, no mark */
  tone?: "brand" | "solid";
  className?: string;
}) {
  const sizeClass = {
    sm: "text-[15px] font-semibold tracking-tight",
    md: "text-lg font-semibold tracking-tight",
    lg: "text-[1.75rem] font-semibold tracking-tight",
    xl: "text-[2.75rem] font-semibold tracking-tight",
    display: "text-[clamp(3rem,8vw,5.5rem)] font-semibold tracking-tight"
  }[size];

  const classes = `wordmark ${tone === "solid" ? "wordmark--solid" : ""} text-primary ${sizeClass} ${className ?? ""}`.trim();

  if (tone === "solid") {
    return <span className={classes}>illuminairy</span>;
  }

  return (
    <span className={classes}>
      illumin<span className="wordmark__ai">ai</span>ry
    </span>
  );
}

type LogoProps = {
  href?: string;
  variant?: "lockup" | "compact" | "stack";
  size?: "sm" | "md" | "lg";
};

export function Logo({
  href = "/",
  variant = "lockup",
  size = "md"
}: LogoProps) {
  const markSize = { sm: 26, md: 32, lg: 44 }[size];
  const wordmarkSize: "sm" | "md" | "lg" = size;
  const gap = { sm: 8, md: 10, lg: 12 }[size];

  const content =
    variant === "compact" ? (
      <IlluminairyMark size={markSize} />
    ) : variant === "stack" ? (
      <span className="flex flex-col items-center gap-3">
        <IlluminairyMark size={48} />
        <Wordmark size={wordmarkSize} />
      </span>
    ) : (
      <span className="flex items-center" style={{ gap }}>
        <IlluminairyMark size={markSize} />
        <Wordmark size={wordmarkSize} />
      </span>
    );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} aria-label="Illuminairy — home" className="inline-flex items-center">
      {content}
    </Link>
  );
}

/** Back-compat alias */
export const BrandMark = IlluminairyMark;
