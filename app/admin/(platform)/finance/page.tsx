import { FinanceDashboard } from "@/components/admin/finance-dashboard";

export const metadata = {
  title: "Finance",
  robots: { index: false, follow: false }
};

export default function AdminFinancePage() {
  return <FinanceDashboard />;
}
