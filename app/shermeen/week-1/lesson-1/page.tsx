import { ShermeenWeek1Lesson1Content } from "@/components/shermeen/week1-lesson1-content";
import { ShermeenNotConfigured } from "@/components/shermeen/not-configured";
import { ShermeenPortalShell } from "@/components/shermeen/portal-shell";
import { isShermeenConfigured } from "@/lib/shermeen-auth";
import { requireShermeenAuth } from "@/lib/shermeen-guard";

export default async function ShermeenWeek1Lesson1Page() {
  if (!isShermeenConfigured()) {
    return <ShermeenNotConfigured />;
  }

  await requireShermeenAuth("/shermeen/week-1/lesson-1");

  return (
    <ShermeenPortalShell>
      <ShermeenWeek1Lesson1Content />
    </ShermeenPortalShell>
  );
}
