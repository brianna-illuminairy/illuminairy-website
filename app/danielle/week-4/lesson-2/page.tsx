import { DanielleWeek4Lesson2Content } from "@/components/danielle/week4-lesson2-content";
import { DanielleNotConfigured } from "@/components/danielle/not-configured";
import { DaniellePortalShell } from "@/components/danielle/portal-shell";
import { requireDanielleAuth } from "@/lib/danielle-guard";
import { isDanielleConfigured } from "@/lib/danielle-auth";

export default async function DanielleWeek4Lesson2Page() {
  if (!isDanielleConfigured()) {
    return <DanielleNotConfigured />;
  }

  await requireDanielleAuth("/danielle/week-4/lesson-2");

  return (
    <DaniellePortalShell>
      <DanielleWeek4Lesson2Content />
    </DaniellePortalShell>
  );
}
