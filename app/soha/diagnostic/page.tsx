import { SohaDiagnosticAnalysisContent } from "@/components/soha/diagnostic-analysis-content";
import { SohaNotConfigured } from "@/components/soha/not-configured";
import { SohaPortalShell } from "@/components/soha/portal-shell";
import { isSohaConfigured } from "@/lib/soha-auth";
import { requireSohaAuth } from "@/lib/soha-guard";

export default async function SohaDiagnosticHubPage() {
  if (!isSohaConfigured()) {
    return <SohaNotConfigured />;
  }

  await requireSohaAuth("/soha/diagnostic");

  return (
    <SohaPortalShell>
      <SohaDiagnosticAnalysisContent />
    </SohaPortalShell>
  );
}
