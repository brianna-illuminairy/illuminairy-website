"use client";

type AssessmentCtaProps = {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "full";
  variantTone?: "default" | "inverted";
};

export function AssessmentCta({
  label = "get started →",
  onClick,
  disabled = false,
  variant = "primary",
  variantTone = "default"
}: AssessmentCtaProps) {
  return (
    <button
      type="button"
      className={[
        "assessment-cta",
        variant === "secondary" ? "assessment-cta--secondary" : "",
        variant === "full" ? "assessment-cta--full" : "",
        variantTone === "inverted" ? "assessment-cta--inverted" : ""
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
