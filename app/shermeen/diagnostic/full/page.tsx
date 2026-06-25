import Link from "next/link";
import { ShermeenNotConfigured } from "@/components/shermeen/not-configured";
import { ShermeenPdfViewer } from "@/components/shermeen/pdf-viewer";
import { ShermeenPortalShell } from "@/components/shermeen/portal-shell";
import { isShermeenConfigured } from "@/lib/shermeen-auth";
import { requireShermeenAuth } from "@/lib/shermeen-guard";

export default async function ShermeenDiagnosticFullPage() {
  if (!isShermeenConfigured()) {
    return <ShermeenNotConfigured />;
  }

  await requireShermeenAuth("/shermeen/diagnostic/full");

  return (
    <ShermeenPortalShell>
      <Link href="/shermeen/diagnostic" className="aurora-portal__back">
        ← Back to diagnostic analysis
      </Link>
      <div className="aurora-portal__page-head">
        <p className="aurora-eyebrow">Illuminairy · Skill Diagnostic</p>
        <h1 className="aurora-portal__title">Full diagnostic report</h1>
      </div>
      <ShermeenPdfViewer
        src="/shermeen/files/full"
        title="Shermeen full diagnostic report"
        openLabel="Open full diagnostic PDF"
      />
    </ShermeenPortalShell>
  );
}
