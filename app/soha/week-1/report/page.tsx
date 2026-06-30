import { SohaNotConfigured } from "@/components/soha/not-configured";
import { SohaPortalShell } from "@/components/soha/portal-shell";
import { isSohaConfigured } from "@/lib/soha-auth";
import { requireSohaAuth } from "@/lib/soha-guard";
import { readSohaWeeklyReportHtml } from "@/lib/soha-content";

export default async function SohaWeek1ReportPage() {
  if (!isSohaConfigured()) {
    return <SohaNotConfigured />;
  }

  await requireSohaAuth("/soha/week-1/report");
  const { styles, bodyHtml } = readSohaWeeklyReportHtml("week-1");

  return (
    <SohaPortalShell>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="soha-report-root" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </SohaPortalShell>
  );
}
