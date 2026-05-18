import Link from "next/link";

type LogoProps = {
  href?: string;
  compact?: boolean;
  inverted?: boolean;
};

export function BrandMark({ inverted = false }: { inverted?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`relative grid h-9 w-9 place-items-center overflow-hidden rounded-lg border ${
        inverted
          ? "border-white/15 bg-white text-ink"
          : "border-ink/10 bg-ink text-white"
      }`}
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(91,124,255,0.95),transparent_38%),radial-gradient(circle_at_72%_78%,rgba(139,92,246,0.8),transparent_42%)]" />
      <span className="relative text-[13px] font-semibold tracking-[-0.01em]">
        AI
      </span>
    </span>
  );
}

export function Wordmark({ inverted = false }: { inverted?: boolean }) {
  return (
    <span
      className={`text-[18px] font-semibold tracking-[-0.03em] ${
        inverted ? "text-white" : "text-ink"
      }`}
    >
      Illumin
      <span className={inverted ? "text-electric" : "text-indigo"}>ai</span>
      ry
    </span>
  );
}

export function Logo({ href = "/", compact = false, inverted = false }: LogoProps) {
  const content = (
    <span className="flex items-center gap-3">
      <BrandMark inverted={inverted} />
      {!compact && <Wordmark inverted={inverted} />}
    </span>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="inline-flex items-center" aria-label="Illuminairy home">
      {content}
    </Link>
  );
}
