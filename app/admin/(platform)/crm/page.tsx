import { CrmDashboard } from "@/components/admin/crm-dashboard";

export const metadata = {
  title: "CRM",
  robots: { index: false, follow: false }
};

export default function AdminCrmPage() {
  return <CrmDashboard />;
}
