import Link from "next/link";
import { DanielleNotConfigured } from "@/components/danielle/not-configured";
import { DaniellePdfViewer } from "@/components/danielle/pdf-viewer";
import { DaniellePortalShell } from "@/components/danielle/portal-shell";
import { requireDanielleAuth } from "@/lib/danielle-guard";
import { isDanielleConfigured } from "@/lib/danielle-auth";

export default async function DanielleDiagnosticTabularPage() {
  if (!isDanielleConfigured()) {
    return <DanielleNotConfigured />;
  }

  await requireDanielleAuth("/danielle/diagnostic/tabular");

  return (
    <DaniellePortalShell>
      <Link href="/danielle/diagnostic" className="danielle-portal__back">
        ← All diagnostic reports
      </Link>
      <div className="danielle-portal__page-head">
        <p className="danielle-portal__eyebrow">Illuminairy · Skill Diagnostic</p>
        <h1>Tabular diagnostic report</h1>
      </div>
      <DaniellePdfViewer
        src="/danielle/files/tabular"
        title="Danielle Danso tabular diagnostic report"
        openLabel="Open tabular diagnostic PDF"
      />
    </DaniellePortalShell>
  );
}
