import Link from "next/link";
import { SessionSummarySection } from "@/components/skye/session-summary-section";
import { PRE_DIAGNOSTIC_SESSION } from "@/lib/skye/session-notes/pre-diagnostic";

export function SkyeGettingStartedContent() {
  const session = PRE_DIAGNOSTIC_SESSION;

  return (
    <div className="skye-lesson-deck">
      <header className="aurora-portal__page-head">
        <p className="aurora-eyebrow">Illuminairy · Before Week 1</p>
        <h1 className="aurora-portal__title">{session.title}</h1>
        <p className="aurora-portal__lede">
          {session.dateLabel} · Orientation before the June 18 full-length diagnostic.
        </p>
      </header>

      <SessionSummarySection
        dateLabel={session.dateLabel}
        title="Session notes"
        summary={session.summary}
        wins={session.wins}
      />

      <p className="skye-plan__foot-link">
        See results in{" "}
        <Link href="/skye/diagnostic">diagnostic analysis</Link> or the{" "}
        <Link href="/skye/plan">improvement plan</Link>.
      </p>
    </div>
  );
}
