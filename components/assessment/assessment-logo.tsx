import { Logo } from "@/components/logo";

type AssessmentLogoProps = {
  className?: string;
  size?: "sm" | "md";
  /** Mark only — tighter quiz header on small screens */
  compact?: boolean;
};

/** Canonical v2 lockup — same mark + wordmark as site header (`components/logo.tsx`). */
export function AssessmentLogo({
  className = "",
  size = "sm",
  compact = false
}: AssessmentLogoProps) {
  return (
    <div className={["assessment-logo", className].filter(Boolean).join(" ")}>
      <Logo href="" size={size} variant={compact ? "compact" : "lockup"} />
    </div>
  );
}
