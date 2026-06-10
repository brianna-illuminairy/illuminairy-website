import { DanielleNotConfigured } from "@/components/danielle/not-configured";
import { DanielleNotificationPreferencesPage } from "@/components/danielle/notification-preferences";
import { requireDanielleAuth } from "@/lib/danielle-guard";
import { isDanielleConfigured } from "@/lib/danielle-auth";

export default async function DanielleNotificationsPage() {
  if (!isDanielleConfigured()) {
    return <DanielleNotConfigured />;
  }

  await requireDanielleAuth("/danielle/notifications");

  return <DanielleNotificationPreferencesPage />;
}
