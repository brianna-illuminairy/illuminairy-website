"use client";

type HeroCtaProps = {
  copy: string;
  cta?: string;
  onClick?: () => void;
};

export function HeroCta({ copy, cta = "Get started", onClick }: HeroCtaProps) {
  return (
    <div className="hero-cta">
      <div className="copy">{copy}</div>
      <button type="button" className="btn" onClick={onClick}>
        {cta} <span className="arrow">→</span>
      </button>
    </div>
  );
}

export function InlineCta({
  label = "Get started",
  onClick,
  className = ""
}: {
  label?: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`btn ${className}`.trim()}
      onClick={onClick}
    >
      {label} <span className="arrow">→</span>
    </button>
  );
}
