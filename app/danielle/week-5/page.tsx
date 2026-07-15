import { DanielleWeek5HubContent } from "@/components/danielle/week5-hub-content";
import { DanielleNotConfigured } from "@/components/danielle/not-configured";
import { DaniellePortalShell } from "@/components/danielle/portal-shell";
import { requireDanielleAuth } from "@/lib/danielle-guard";
import { isDanielleConfigured } from "@/lib/danielle-auth";

export default async function DanielleWeek5Page() {
  if (!isDanielleConfigured()) {
    return <DanielleNotConfigured />;
  }

  await requireDanielleAuth("/danielle/week-5");

  return (
    <DaniellePortalShell>
      <DanielleWeek5HubContent />
    </DaniellePortalShell>
  );
}
