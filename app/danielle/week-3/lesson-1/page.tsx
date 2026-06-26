import { DanielleWeek3Lesson1Content } from "@/components/danielle/week3-lesson1-content";
import { DanielleNotConfigured } from "@/components/danielle/not-configured";
import { DaniellePortalShell } from "@/components/danielle/portal-shell";
import { requireDanielleAuth } from "@/lib/danielle-guard";
import { isDanielleConfigured } from "@/lib/danielle-auth";

export default async function DanielleWeek3Lesson1Page() {
  if (!isDanielleConfigured()) {
    return <DanielleNotConfigured />;
  }

  await requireDanielleAuth("/danielle/week-3/lesson-1");

  return (
    <DaniellePortalShell>
      <DanielleWeek3Lesson1Content />
    </DaniellePortalShell>
  );
}
