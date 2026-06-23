import Link from "next/link";
import { PortalShell } from "@/components/portal/portal-shell";
import { requirePortalAuth } from "@/lib/portal-guard";
import { loadPortalDashboard } from "@/lib/portal/load-dashboard";

export default async function PortalDiagnosticPage() {
  const session = await requirePortalAuth("/portal/diagnostic");
  const dashboard = await loadPortalDashboard(session.leadId, session.email);

  return (
    <PortalShell profile={dashboard.profile}>
      <div className="portal-page-card">
        <p>
          After your free lesson, we schedule the 2 hr 14 min Skill Diagnostic. Results rank the
          5–6 skills that move your student&apos;s score fastest.
        </p>
        <p style={{ marginTop: 12 }}>
          Diagnostic not completed yet. Your mentor will share the report here when it is ready.
        </p>
        <p style={{ marginTop: 16 }}>
          <Link href="/portal/plan" style={{ color: "var(--portal-accent)", fontWeight: 600 }}>
            View SAT Improvement Plan
          </Link>
        </p>
      </div>
    </PortalShell>
  );
}
