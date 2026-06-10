import { AdsDashboard } from "@/components/admin/ads-dashboard";

export const metadata = {
  title: "Ads",
  robots: { index: false, follow: false }
};

export default function AdminAdsPage() {
  return <AdsDashboard />;
}
