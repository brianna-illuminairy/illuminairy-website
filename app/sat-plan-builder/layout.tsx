import { landingAdTutorFontClassName } from "@/lib/funnel-fonts";

export default function SatPlanBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${landingAdTutorFontClassName} lp-ad-tutor-fonts`}>
      {children}
    </div>
  );
}
