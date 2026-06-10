import { MarketingDashboard } from "@/components/admin/marketing-dashboard";

export const metadata = {
  title: "Marketing",
  robots: { index: false, follow: false }
};

export default function AdminMarketingPage() {
  return <MarketingDashboard />;
}
