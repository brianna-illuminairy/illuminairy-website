import Link from "next/link";
import { DanielleNotConfigured } from "@/components/danielle/not-configured";
import { DaniellePdfViewer } from "@/components/danielle/pdf-viewer";
import { DaniellePortalShell } from "@/components/danielle/portal-shell";
import { requireDanielleAuth } from "@/lib/danielle-guard";
import { isDanielleConfigured } from "@/lib/danielle-auth";

export default async function DanielleDiagnosticFullPage() {
  if (!isDanielleConfigured()) {
    return <DanielleNotConfigured />;
  }

  await requireDanielleAuth("/danielle/diagnostic/full");

  return (
    <DaniellePortalShell>
      <Link href="/danielle/diagnostic" className="danielle-portal__back">
        ← All diagnostic reports
      </Link>
      <div className="danielle-portal__page-head">
        <p className="danielle-portal__eyebrow">Illuminairy · Skill Diagnostic</p>
        <h1>Full diagnostic report</h1>
      </div>
      <DaniellePdfViewer
        src="/danielle/files/full"
        title="Danielle Danso full diagnostic report"
        openLabel="Open full diagnostic PDF"
      />
    </DaniellePortalShell>
  );
}
