import Link from "next/link";
import { SohaNotConfigured } from "@/components/soha/not-configured";
import { SohaPdfViewer } from "@/components/soha/pdf-viewer";
import { SohaPortalShell } from "@/components/soha/portal-shell";
import { isSohaConfigured } from "@/lib/soha-auth";
import { requireSohaAuth } from "@/lib/soha-guard";

export default async function SohaDiagnosticFullPage() {
  if (!isSohaConfigured()) {
    return <SohaNotConfigured />;
  }

  await requireSohaAuth("/soha/diagnostic/full");

  return (
    <SohaPortalShell>
      <Link href="/soha/diagnostic" className="danielle-portal__back">
        ← All diagnostic reports
      </Link>
      <div className="danielle-portal__page-head">
        <p className="danielle-portal__eyebrow">Illuminairy · Skill Diagnostic</p>
        <h1>Full diagnostic report</h1>
      </div>
      <SohaPdfViewer
        src="/soha/files/full"
        title="Soha Naveed full diagnostic report"
        openLabel="Open full diagnostic PDF"
      />
    </SohaPortalShell>
  );
}
