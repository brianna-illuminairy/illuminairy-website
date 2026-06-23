import Link from "next/link";
import { PortalShell } from "@/components/portal/portal-shell";
import { requirePortalAuth } from "@/lib/portal-guard";
import { loadPortalDashboard } from "@/lib/portal/load-dashboard";
import {
  PORTAL_DIAGNOSTIC_ENROLLED,
  PORTAL_DIAGNOSTIC_FREE_SESSION,
} from "@/lib/portal/portal-product-copy";

export default async function PortalDiagnosticPage() {
  const session = await requirePortalAuth("/portal/diagnostic");
  const dashboard = await loadPortalDashboard(session.leadId, session.email);

  return (
    <PortalShell profile={dashboard.profile}>
      <div className="portal-page-card aurora-hover-card">
        <p>{PORTAL_DIAGNOSTIC_FREE_SESSION}</p>
        <p style={{ marginTop: 12 }}>{PORTAL_DIAGNOSTIC_ENROLLED}</p>
        <p style={{ marginTop: 16 }}>
          <Link href="/portal/plan" className="portal-page-card__link">
            View SAT improvement plan
          </Link>
        </p>
      </div>
    </PortalShell>
  );
}
