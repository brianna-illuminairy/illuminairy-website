import { DanielleNotConfigured } from "@/components/danielle/not-configured";
import { DaniellePortalShell } from "@/components/danielle/portal-shell";
import { requireDanielleAuth } from "@/lib/danielle-guard";
import { readDaniellePlanHtml } from "@/lib/danielle-content";
import { isDanielleConfigured } from "@/lib/danielle-auth";

export default async function DaniellePlanPage() {
  if (!isDanielleConfigured()) {
    return <DanielleNotConfigured />;
  }

  await requireDanielleAuth("/danielle/plan");
  const { styles, bodyHtml } = readDaniellePlanHtml();

  return (
    <DaniellePortalShell>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="danielle-plan-root" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </DaniellePortalShell>
  );
}
