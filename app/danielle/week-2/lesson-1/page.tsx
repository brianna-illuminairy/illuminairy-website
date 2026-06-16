import { DanielleWeek2Lesson1Content } from "@/components/danielle/week2-lesson1-content";
import { DanielleNotConfigured } from "@/components/danielle/not-configured";
import { DaniellePortalShell } from "@/components/danielle/portal-shell";
import { requireDanielleAuth } from "@/lib/danielle-guard";
import { isDanielleConfigured } from "@/lib/danielle-auth";

export default async function DanielleWeek2Lesson1Page() {
  if (!isDanielleConfigured()) {
    return <DanielleNotConfigured />;
  }

  await requireDanielleAuth("/danielle/week-2/lesson-1");

  return (
    <DaniellePortalShell>
      <DanielleWeek2Lesson1Content />
    </DaniellePortalShell>
  );
}
