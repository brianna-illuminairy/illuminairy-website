import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientProfile } from "@/components/admin/crm/client-profile";
import { getClientDetail } from "@/lib/admin/clients-queries";

export const metadata = {
  title: "Client profile",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

export default async function AdminClientProfilePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getClientDetail(id);
  if (!detail) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <nav className="text-xs text-muted-foreground">
        <Link href="/admin/crm/clients" className="hover:underline">
          ← All clients
        </Link>
      </nav>
      <ClientProfile initialDetail={detail} clientId={id} />
    </div>
  );
}
