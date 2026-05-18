import Link from "next/link";

type Tone = "ink" | "ivory";

/**
 * 4-pointed North Star with vertical bias.
 * Per brand brief: vertical points longer than horizontal,
 * reads as both star (illumination) and compass point (guidance).
 * Always gold (or gold-gradient on dark grounds).
 */
export function NorthStar({
  size = 36,
  tone = "ivory",
  glow = true,
  className
}: {
  size?: number;
  /**
   * "ivory" = mark sits on ivory/light background (uses gold deep edge for legibility).
   * "ink"   = mark sits on navy/dark background (uses gold-light + gold-gradient + glow).
   */
  tone?: Tone;
  glow?: boolean;
  className?: string;
}) {
  const gradientId = `northStarFill-${tone}`;
  const glowId = `northStarGlow-${tone}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="32" y1="4" x2="32" y2="60" gradientUnits="userSpaceOnUse">
          {tone === "ivory" ? (
            <>
              <stop offset="0" stopColor="#E8C547" />
              <stop offset="0.55" stopColor="#C49A18" />
              <stop offset="1" stopColor="#8F6E0C" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#F1D362" />
              <stop offset="0.5" stopColor="#D4AF3A" />
              <stop offset="1" stopColor="#A07E10" />
            </>
          )}
        </linearGradient>
        {glow && tone === "ink" && (
          <radialGradient id={glowId} cx="32" cy="32" r="26" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#E8C547" stopOpacity="0.45" />
            <stop offset="0.55" stopColor="#C49A18" stopOpacity="0.12" />
            <stop offset="1" stopColor="#C49A18" stopOpacity="0" />
          </radialGradient>
        )}
      </defs>
      {glow && tone === "ink" && <circle cx="32" cy="32" r="26" fill={`url(#${glowId})`} />}
      <path
        d="M32 3 L36.6 26.6 L60 32 L36.6 37.4 L32 61 L27.4 37.4 L4 32 L27.4 26.6 Z"
        fill={`url(#${gradientId})`}
      />
      {/* tiny inner highlight to make it feel candlelit */}
      <path
        d="M32 14 L33.3 28.7 L46 32 L33.3 35.3 L32 50 L30.7 35.3 L18 32 L30.7 28.7 Z"
        fill={tone === "ivory" ? "#F8DC79" : "#F4D976"}
        fillOpacity={tone === "ivory" ? 0.25 : 0.35}
      />
    </svg>
  );
}

/**
 * "illuminairy" wordmark. Lowercase. Plus Jakarta Sans (set via body).
 * Display weight 200 by default; switches to 500 at small sizes per brief.
 * The "ai" letters are gold — the brand's discovery moment.
 */
export function Wordmark({
  size = "md",
  tone = "ink",
  className
}: {
  size?: "sm" | "md" | "lg" | "xl" | "display";
  tone?: "ink" | "ivory";
  className?: string;
}) {
  const sizeClass = {
    sm: "text-[15px] wordmark--sm",
    md: "text-[18px] wordmark--sm",
    lg: "text-[28px] wordmark",
    xl: "text-[44px] wordmark",
    display:
      "text-[68px] sm:text-[88px] lg:text-[112px] wordmark headline-display"
  }[size];

  const colorClass = tone === "ivory" ? "text-ivory wordmark--invert" : "text-ink";

  return (
    <span className={`${sizeClass} ${colorClass} ${className ?? ""}`.trim()}>
      illumin<span className="wordmark__ai">ai</span>ry
    </span>
  );
}

type LogoProps = {
  href?: string;
  /**
   * compact = mark only (favicon-style lockup; used at very small chrome sizes)
   * lockup  = mark + wordmark, horizontal (default; nav/footer)
   * stack   = mark above wordmark, centered (hero identity moment)
   */
  variant?: "lockup" | "compact" | "stack";
  tone?: "ink" | "ivory";
  size?: "sm" | "md" | "lg";
};

export function Logo({
  href = "/",
  variant = "lockup",
  tone = "ink",
  size = "md"
}: LogoProps) {
  const markSize = { sm: 24, md: 30, lg: 44 }[size];
  const wordmarkSize: "sm" | "md" | "lg" = size;
  const gap = { sm: 8, md: 10, lg: 12 }[size];

  const content =
    variant === "compact" ? (
      <NorthStar size={markSize} tone={tone === "ivory" ? "ink" : "ivory"} glow={tone === "ivory"} />
    ) : variant === "stack" ? (
      <span className="flex flex-col items-center gap-3">
        <NorthStar size={48} tone={tone === "ivory" ? "ink" : "ivory"} glow />
        <Wordmark size={wordmarkSize} tone={tone} />
      </span>
    ) : (
      <span className="flex items-center" style={{ gap }}>
        <NorthStar size={markSize} tone={tone === "ivory" ? "ink" : "ivory"} glow={tone === "ivory"} />
        <Wordmark size={wordmarkSize} tone={tone} />
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

/** Back-compat alias for older imports. */
export const BrandMark = NorthStar;
