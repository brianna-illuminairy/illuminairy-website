import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  LEAD_MAGNET_FUNNEL_CTA_LABEL,
  leadMagnetFunnelCtaHref
} from "@/lib/lead-magnet-funnel";
export function GuideFunnelCta({
  className = "",
  variant = "primary"
}: {
  className?: string;
  variant?: "primary" | "onDark";
}) {
  const href = leadMagnetFunnelCtaHref();
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold transition disabled:opacity-60 sm:w-auto";
  const styles =
    variant === "onDark"
      ? "bg-gold text-ink hover:bg-gold-light"
      : "border border-ink bg-ink text-ivory hover:bg-ink-soft";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`.trim()}>
      {LEAD_MAGNET_FUNNEL_CTA_LABEL}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </Link>
  );
}
