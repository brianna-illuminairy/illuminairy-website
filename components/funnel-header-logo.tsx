import { IlluminairyLogoV7 } from "@/components/brand/illuminairy-logo-v7";

/** Funnel chrome uses navy header — Logo v7b on-dark from brand guide. */
export function FunnelHeaderLogo() {
  return (
    <span className="qf-brand-lockup">
      <IlluminairyLogoV7 tone="on-dark" height={36} />
    </span>
  );
}
