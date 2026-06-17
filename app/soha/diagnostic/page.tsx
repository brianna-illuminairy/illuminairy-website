import Link from "next/link";
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
      <div className="danielle-portal__page-head">
        <p className="danielle-portal__eyebrow">Illuminairy · Skill Diagnostic</p>
        <h1>Diagnostic reports</h1>
        <p className="danielle-portal__lede">
          Raw results from Soha&apos;s June 17 full-length diagnostic. The study plan is built from
          these scores.
        </p>
      </div>
      <div className="danielle-portal__cards">
        <Link href="/soha/diagnostic/full" className="danielle-portal__link-card">
          <h2>Full report</h2>
          <p>
            Complete diagnostic breakdown with section scores, timing, and question-level detail.
          </p>
        </Link>
        <Link href="/soha/diagnostic/tabular" className="danielle-portal__link-card">
          <h2>Tabular report</h2>
          <p>Skill-by-skill table view of misses, difficulty, and time spent per question.</p>
        </Link>
      </div>
    </SohaPortalShell>
  );
}
