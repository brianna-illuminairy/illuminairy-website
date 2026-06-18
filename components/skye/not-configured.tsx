import { SkyeLoginChrome } from "@/components/skye/portal-shell";

export function SkyeNotConfigured() {
  return (
    <SkyeLoginChrome>
      <div className="aurora-portal__card">
        <p className="aurora-eyebrow">Illuminairy</p>
        <h1 className="aurora-portal__title">Student portal unavailable</h1>
        <p className="aurora-portal__lede">
          This page is not configured yet. Contact Illuminairy if you need access.
        </p>
      </div>
    </SkyeLoginChrome>
  );
}
