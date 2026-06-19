import { SohaNotConfigured } from "@/components/soha/not-configured";
import { SohaPortalShell } from "@/components/soha/portal-shell";
import { isSohaConfigured } from "@/lib/soha-auth";
import { readSohaPlanHtml } from "@/lib/soha-content";
import { requireSohaAuth } from "@/lib/soha-guard";

export default async function SohaPlanPage() {
  if (!isSohaConfigured()) {
    return <SohaNotConfigured />;
  }

  await requireSohaAuth("/soha/plan");
  const { styles, bodyHtml } = readSohaPlanHtml();

  return (
    <SohaPortalShell>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="aurora-portal__plan-root" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </SohaPortalShell>
  );
}
