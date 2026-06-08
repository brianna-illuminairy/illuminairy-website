import { DanielleLoginChrome } from "@/components/danielle/portal-shell";

export function DanielleNotConfigured() {
  return (
    <DanielleLoginChrome>
      <div className="danielle-portal__card">
        <p className="danielle-portal__eyebrow">Illuminairy</p>
        <h1 className="danielle-portal__title">Student portal unavailable</h1>
        <p className="danielle-portal__lede">
          This page is not configured yet. Contact Illuminairy if you need access.
        </p>
      </div>
    </DanielleLoginChrome>
  );
}
