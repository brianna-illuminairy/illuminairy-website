import Link from "next/link";
import { SkyeNotConfigured } from "@/components/skye/not-configured";
import { SkyePortalShell } from "@/components/skye/portal-shell";
import { isSkyeConfigured } from "@/lib/skye-auth";
import { requireSkyeAuth } from "@/lib/skye-guard";

export default async function SkyeDiagnosticHubPage() {
  if (!isSkyeConfigured()) {
    return <SkyeNotConfigured />;
  }

  await requireSkyeAuth("/skye/diagnostic");

  return (
    <SkyePortalShell>
      <div className="aurora-portal__page-head">
        <p className="aurora-eyebrow">Illuminairy · Skill Diagnostic</p>
        <h1 className="aurora-portal__title">Diagnostic reports</h1>
        <p className="aurora-portal__lede">
          Skye&apos;s June 18 full-length diagnostic. Total score range:{" "}
          <strong>1090–1140</strong> (Reading &amp; Writing 540–560 · Math 550–580).
        </p>
      </div>
      <div className="aurora-portal__cards">
        <Link href="/skye/diagnostic/full" className="aurora-portal__link-card">
          <b>Full report</b>
          <span>Complete breakdown with section scores, timing, and question-level detail.</span>
        </Link>
        <Link href="/skye/diagnostic/tabular" className="aurora-portal__link-card">
          <b>Tabular report</b>
          <span>Question-by-question table with domain, topic, difficulty, and your answers.</span>
        </Link>
      </div>
    </SkyePortalShell>
  );
}
