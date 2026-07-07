import { DanielleWeek4HubContent } from "@/components/danielle/week4-hub-content";
import { DanielleNotConfigured } from "@/components/danielle/not-configured";
import { DaniellePortalShell } from "@/components/danielle/portal-shell";
import { requireDanielleAuth } from "@/lib/danielle-guard";
import { isDanielleConfigured } from "@/lib/danielle-auth";

export default async function DanielleWeek4Page() {
  if (!isDanielleConfigured()) {
    return <DanielleNotConfigured />;
  }

  await requireDanielleAuth("/danielle/week-4");

  return (
    <DaniellePortalShell>
      <DanielleWeek4HubContent />
    </DaniellePortalShell>
  );
}
