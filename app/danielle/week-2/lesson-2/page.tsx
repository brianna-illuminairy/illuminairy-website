import { DanielleWeek2Lesson2Content } from "@/components/danielle/week2-lesson2-content";
import { DanielleNotConfigured } from "@/components/danielle/not-configured";
import { DaniellePortalShell } from "@/components/danielle/portal-shell";
import { requireDanielleAuth } from "@/lib/danielle-guard";
import { isDanielleConfigured } from "@/lib/danielle-auth";

export default async function DanielleWeek2Lesson2Page() {
  if (!isDanielleConfigured()) {
    return <DanielleNotConfigured />;
  }

  await requireDanielleAuth("/danielle/week-2/lesson-2");

  return (
    <DaniellePortalShell>
      <DanielleWeek2Lesson2Content />
    </DaniellePortalShell>
  );
}
