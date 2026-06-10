import { AutomationsDashboard } from "@/components/admin/automations-dashboard";

export const metadata = {
  title: "Automations",
  robots: { index: false, follow: false }
};

export default function AdminAutomationsPage() {
  return <AutomationsDashboard />;
}
