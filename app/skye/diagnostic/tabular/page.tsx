import Link from "next/link";
import { SkyeNotConfigured } from "@/components/skye/not-configured";
import { SkyePdfViewer } from "@/components/skye/pdf-viewer";
import { SkyePortalShell } from "@/components/skye/portal-shell";
import { isSkyeConfigured } from "@/lib/skye-auth";
import { requireSkyeAuth } from "@/lib/skye-guard";

export default async function SkyeDiagnosticTabularPage() {
  if (!isSkyeConfigured()) {
    return <SkyeNotConfigured />;
  }

  await requireSkyeAuth("/skye/diagnostic/tabular");

  return (
    <SkyePortalShell>
      <Link href="/skye/diagnostic" className="aurora-portal__back">
        ← Back to diagnostic reports
      </Link>
      <div className="aurora-portal__page-head">
        <p className="aurora-eyebrow">Illuminairy · Skill Diagnostic</p>
        <h1 className="aurora-portal__title">Tabular diagnostic report</h1>
      </div>
      <SkyePdfViewer
        src="/skye/files/tabular"
        title="Skye tabular diagnostic report"
        openLabel="Open tabular diagnostic PDF"
      />
    </SkyePortalShell>
  );
}
