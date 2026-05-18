import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return (
      <p className="text-[14px] text-ink-soft">
        Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run{" "}
        <code className="text-ink">supabase db push</code>.
      </p>
    );
  }
  const { data: clients, error } = await supabase
    .from("clients")
    .select("id, parent_email, parent_first, parent_last, status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <p className="text-[14px] text-terracotta-ink">
        Could not load clients. Run the Supabase migration first.
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-light tracking-tight text-ink">Clients</h1>
      <p className="mt-2 text-[14px] text-ink-soft">
        Enrolled families — {clients?.length ?? 0} recent
      </p>
      <div className="mt-8 overflow-x-auto rounded-xl border border-line bg-ivory">
        <table className="w-full min-w-[520px] text-left text-[13px]">
          <thead className="border-b border-line text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Since</th>
            </tr>
          </thead>
          <tbody>
            {(clients ?? []).map((client) => (
              <tr key={client.id} className="border-b border-line/60">
                <td className="px-4 py-3 font-medium text-ink">
                  <Link
                    href={`/admin/clients/${client.id}`}
                    className="hover:text-gold-deep"
                  >
                    {client.parent_first} {client.parent_last}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-muted">{client.parent_email}</td>
                <td className="px-4 py-3">{client.status}</td>
                <td className="px-4 py-3 text-ink-muted">
                  {new Date(client.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!clients?.length && (
          <p className="px-4 py-8 text-center text-ink-muted">No clients yet.</p>
        )}
      </div>
    </div>
  );
}
