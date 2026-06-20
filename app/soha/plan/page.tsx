import { SohaNotConfigured } from "@/components/soha/not-configured";
import { SohaPlanScheduleContent } from "@/components/soha/plan-schedule-content";
import { SohaPortalShell } from "@/components/soha/portal-shell";
import { isSohaConfigured } from "@/lib/soha-auth";
import { readSohaPlanHtmlParts } from "@/lib/soha-content";
import { requireSohaAuth } from "@/lib/soha-guard";

export default async function SohaPlanPage() {
  if (!isSohaConfigured()) {
    return <SohaNotConfigured />;
  }

  await requireSohaAuth("/soha/plan");
  const { styles, overviewHtml, tailHtml } = readSohaPlanHtmlParts();

  return (
    <SohaPortalShell>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="aurora-portal__plan-root">
        <div dangerouslySetInnerHTML={{ __html: overviewHtml }} />
        <SohaPlanScheduleContent />
        {tailHtml ? <div dangerouslySetInnerHTML={{ __html: tailHtml }} /> : null}
      </div>
    </SohaPortalShell>
  );
}
