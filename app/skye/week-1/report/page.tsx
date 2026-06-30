import { SkyeNotConfigured } from "@/components/skye/not-configured";
import { SkyePortalShell } from "@/components/skye/portal-shell";
import { isSkyeConfigured } from "@/lib/skye-auth";
import { requireSkyeAuth } from "@/lib/skye-guard";
import { readSkyeWeeklyReportHtml } from "@/lib/skye-content";

export default async function SkyeWeek1ReportPage() {
  if (!isSkyeConfigured()) {
    return <SkyeNotConfigured />;
  }

  await requireSkyeAuth("/skye/week-1/report");
  const { styles, bodyHtml } = readSkyeWeeklyReportHtml("week-1");

  return (
    <SkyePortalShell>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="skye-report-root" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </SkyePortalShell>
  );
}
