import { DanielleNotConfigured } from "@/components/danielle/not-configured";
import { DaniellePortalShell } from "@/components/danielle/portal-shell";
import { requireDanielleAuth } from "@/lib/danielle-guard";
import { readDanielleWeeklyReportHtml } from "@/lib/danielle-content";
import { isDanielleConfigured } from "@/lib/danielle-auth";

export default async function DanielleWeek1ReportPage() {
  if (!isDanielleConfigured()) {
    return <DanielleNotConfigured />;
  }

  await requireDanielleAuth("/danielle/week-1/report");
  const { styles, bodyHtml } = readDanielleWeeklyReportHtml("week-1");

  return (
    <DaniellePortalShell>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="danielle-report-root" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </DaniellePortalShell>
  );
}
