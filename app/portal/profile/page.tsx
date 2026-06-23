import { PortalProfileEditor } from "@/components/portal/portal-profile-editor";
import { PortalShell } from "@/components/portal/portal-shell";
import { requirePortalAuth } from "@/lib/portal-guard";
import { loadPortalDashboard } from "@/lib/portal/load-dashboard";

export default async function PortalProfilePage() {
  const session = await requirePortalAuth("/portal/profile");
  const dashboard = await loadPortalDashboard(session.leadId, session.email);

  return (
    <PortalShell profile={dashboard.profile} enrollTab={dashboard.enrollTab}>
      <PortalProfileEditor profile={dashboard.profile} canEdit={Boolean(session.leadId)} />
    </PortalShell>
  );
}
