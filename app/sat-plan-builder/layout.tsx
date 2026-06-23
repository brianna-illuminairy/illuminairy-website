import { landingAdFontClassName } from "@/lib/funnel-fonts";

export default function SatPlanBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={landingAdFontClassName}>{children}</div>;
}
