import { DanielleWeek4Lesson1Content } from "@/components/danielle/week4-lesson1-content";
import { DanielleNotConfigured } from "@/components/danielle/not-configured";
import { DaniellePortalShell } from "@/components/danielle/portal-shell";
import { requireDanielleAuth } from "@/lib/danielle-guard";
import { isDanielleConfigured } from "@/lib/danielle-auth";

export default async function DanielleWeek4Lesson1Page() {
  if (!isDanielleConfigured()) {
    return <DanielleNotConfigured />;
  }

  await requireDanielleAuth("/danielle/week-4/lesson-1");

  return (
    <DaniellePortalShell>
      <DanielleWeek4Lesson1Content />
    </DaniellePortalShell>
  );
}
