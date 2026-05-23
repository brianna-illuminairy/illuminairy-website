"use client";

type FunnelCtaProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  showArrow?: boolean;
  type?: "button" | "submit";
};

export function FunnelCta({
  label,
  onClick,
  disabled = false,
  showArrow = false,
  type = "button"
}: FunnelCtaProps) {
  return (
    <button type={type} className="cta" onClick={onClick} disabled={disabled}>
      <span>{label}</span>
      {showArrow ? <span className="arrow" aria-hidden /> : null}
    </button>
  );
}
