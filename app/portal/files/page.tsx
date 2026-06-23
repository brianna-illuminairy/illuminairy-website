import { PortalShell } from "@/components/portal/portal-shell";
import { requirePortalAuth } from "@/lib/portal-guard";
import { loadPortalDashboard } from "@/lib/portal/load-dashboard";

export default async function PortalFilesPage() {
  const session = await requirePortalAuth("/portal/files");
  const dashboard = await loadPortalDashboard(session.leadId, session.email);

  return (
    <PortalShell profile={dashboard.profile} enrollTab={dashboard.enrollTab}>
      <div className="portal-page-card">
        <p>
          Session notes, practice sets, and reports from your mentor will appear here after your
          free lesson and Skill Diagnostic.
        </p>
      </div>
    </PortalShell>
  );
}
