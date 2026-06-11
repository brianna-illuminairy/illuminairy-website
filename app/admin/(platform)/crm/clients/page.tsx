import { ClientsDashboard } from "@/components/admin/crm/clients-dashboard";

export const metadata = {
  title: "Clients",
  robots: { index: false, follow: false }
};

export default function AdminClientsPage() {
  return <ClientsDashboard />;
}
