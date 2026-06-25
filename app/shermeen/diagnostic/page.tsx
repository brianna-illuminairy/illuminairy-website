import { ShermeenDiagnosticAnalysisContent } from "@/components/shermeen/diagnostic-analysis-content";
import { ShermeenNotConfigured } from "@/components/shermeen/not-configured";
import { ShermeenPortalShell } from "@/components/shermeen/portal-shell";
import { isShermeenConfigured } from "@/lib/shermeen-auth";
import { requireShermeenAuth } from "@/lib/shermeen-guard";

export default async function ShermeenDiagnosticHubPage() {
  if (!isShermeenConfigured()) {
    return <ShermeenNotConfigured />;
  }

  await requireShermeenAuth("/shermeen/diagnostic");

  return (
    <ShermeenPortalShell>
      <ShermeenDiagnosticAnalysisContent />
    </ShermeenPortalShell>
  );
}
