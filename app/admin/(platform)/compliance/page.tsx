import { CompliancePanel } from "@/components/admin/compliance-panel";

export const metadata = {
  title: "Compliance",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

export default function AdminCompliancePage() {
  return <CompliancePanel />;
}
