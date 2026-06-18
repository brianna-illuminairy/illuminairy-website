import { PreDiagnosticLesson } from "@/components/skye/pre-diagnostic-lesson";
import { SkyeNotConfigured } from "@/components/skye/not-configured";
import { SkyePortalShell } from "@/components/skye/portal-shell";
import { isSkyeConfigured } from "@/lib/skye-auth";
import { requireSkyeAuth } from "@/lib/skye-guard";

export default async function SkyePreDiagnosticPage() {
  if (!isSkyeConfigured()) {
    return <SkyeNotConfigured />;
  }

  await requireSkyeAuth("/skye/pre-diagnostic");

  return (
    <SkyePortalShell>
      <PreDiagnosticLesson />
    </SkyePortalShell>
  );
}
