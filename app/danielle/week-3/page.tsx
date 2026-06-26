import { DanielleWeek3HubContent } from "@/components/danielle/week3-hub-content";
import { DanielleNotConfigured } from "@/components/danielle/not-configured";
import { DaniellePortalShell } from "@/components/danielle/portal-shell";
import { requireDanielleAuth } from "@/lib/danielle-guard";
import { isDanielleConfigured } from "@/lib/danielle-auth";

export default async function DanielleWeek3Page() {
  if (!isDanielleConfigured()) {
    return <DanielleNotConfigured />;
  }

  await requireDanielleAuth("/danielle/week-3");

  return (
    <DaniellePortalShell>
      <DanielleWeek3HubContent />
    </DaniellePortalShell>
  );
}
