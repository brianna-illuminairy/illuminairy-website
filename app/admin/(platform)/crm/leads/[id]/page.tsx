import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadProfile } from "@/components/admin/crm/lead-profile";
import { getCrmLeadDetail } from "@/lib/admin/crm-queries";

export const metadata = {
  title: "Lead profile",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

export default async function AdminLeadProfilePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getCrmLeadDetail(id);
  if (!detail) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <nav className="text-xs text-muted-foreground">
        <Link href="/admin/crm" className="hover:underline">
          ← All leads
        </Link>
      </nav>
      <LeadProfile initialDetail={detail} leadId={id} />
    </div>
  );
}
