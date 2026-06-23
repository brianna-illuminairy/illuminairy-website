import { PortalShell } from "@/components/portal/portal-shell";
import { requirePortalAuth } from "@/lib/portal-guard";
import { loadPortalDashboard } from "@/lib/portal/load-dashboard";
import {
  PORTAL_PLANS_INTRO,
  portalPlansOutcomeParagraph,
} from "@/lib/portal/portal-product-copy";

export default async function PortalPlanPage() {
  const session = await requirePortalAuth("/portal/plan");
  const dashboard = await loadPortalDashboard(session.leadId, session.email);

  return (
    <PortalShell profile={dashboard.profile}>
      <div className="portal-page-card aurora-hover-card">
        <p>{PORTAL_PLANS_INTRO}</p>
        <p style={{ marginTop: 12 }}>{portalPlansOutcomeParagraph()}</p>
      </div>
    </PortalShell>
  );
}
