import Link from "next/link";
import { SohaNotConfigured } from "@/components/soha/not-configured";
import { SohaPdfViewer } from "@/components/soha/pdf-viewer";
import { SohaPortalShell } from "@/components/soha/portal-shell";
import { isSohaConfigured } from "@/lib/soha-auth";
import { requireSohaAuth } from "@/lib/soha-guard";

export default async function SohaDiagnosticTabularPage() {
  if (!isSohaConfigured()) {
    return <SohaNotConfigured />;
  }

  await requireSohaAuth("/soha/diagnostic/tabular");

  return (
    <SohaPortalShell>
      <Link href="/soha/diagnostic" className="aurora-portal__back">
        ← Back to diagnostic analysis
      </Link>
      <div className="aurora-portal__page-head">
        <p className="aurora-eyebrow">Illuminairy · Skill Diagnostic</p>
        <h1>Tabular diagnostic report</h1>
      </div>
      <SohaPdfViewer
        src="/soha/files/tabular"
        title="Soha Naveed tabular diagnostic report"
        openLabel="Open tabular diagnostic PDF"
      />
    </SohaPortalShell>
  );
}
