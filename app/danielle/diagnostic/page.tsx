import Link from "next/link";
import { DanielleNotConfigured } from "@/components/danielle/not-configured";
import { DaniellePortalShell } from "@/components/danielle/portal-shell";
import { requireDanielleAuth } from "@/lib/danielle-guard";
import { isDanielleConfigured } from "@/lib/danielle-auth";

export default async function DanielleDiagnosticHubPage() {
  if (!isDanielleConfigured()) {
    return <DanielleNotConfigured />;
  }

  await requireDanielleAuth("/danielle/diagnostic");

  return (
    <DaniellePortalShell>
      <div className="danielle-portal__page-head">
        <p className="danielle-portal__eyebrow">Illuminairy · Skill Diagnostic</p>
        <h1>Diagnostic reports</h1>
        <p className="danielle-portal__lede">
          Raw results from Danielle&apos;s June 6 full-length diagnostic. The SAT plan on the
          previous tab is built from these scores.
        </p>
      </div>
      <div className="danielle-portal__cards">
        <Link href="/danielle/diagnostic/full" className="danielle-portal__link-card">
          <h2>Full report</h2>
          <p>
            Complete diagnostic breakdown with section scores, timing, and question-level detail.
          </p>
        </Link>
        <Link href="/danielle/diagnostic/tabular" className="danielle-portal__link-card">
          <h2>Tabular report</h2>
          <p>Skill-by-skill table view of misses, difficulty, and time spent per question.</p>
        </Link>
      </div>
    </DaniellePortalShell>
  );
}
