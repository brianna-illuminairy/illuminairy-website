import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return (
      <p className="text-[14px] text-ink-soft">
        Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run{" "}
        <code className="text-ink">supabase db push</code>.
      </p>
    );
  }
  const { data: leads, error } = await supabase
    .from("leads")
    .select(
      "id, parent_email, parent_first, parent_last, stage, lead_source, first_touch_at, created_at, student_first"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <p className="text-[14px] text-terracotta-ink">
        Could not load leads. Run the Supabase migration first.
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-light tracking-tight text-ink">Leads</h1>
      <p className="mt-2 text-[14px] text-ink-soft">
        Sales pipeline — {leads?.length ?? 0} recent
      </p>
      <div className="mt-8 overflow-x-auto rounded-xl border border-line bg-ivory">
        <table className="w-full min-w-[640px] text-left text-[13px]">
          <thead className="border-b border-line text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Parent</th>
              <th className="px-4 py-3 font-semibold">Student</th>
              <th className="px-4 py-3 font-semibold">Stage</th>
              <th className="px-4 py-3 font-semibold">Source</th>
              <th className="px-4 py-3 font-semibold">Created</th>
            </tr>
          </thead>
          <tbody>
            {(leads ?? []).map((lead) => (
              <tr key={lead.id} className="border-b border-line/60">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="font-medium text-ink hover:text-gold-deep"
                  >
                    {lead.parent_first} {lead.parent_last}
                  </Link>
                  <div className="text-ink-muted">{lead.parent_email}</div>
                </td>
                <td className="px-4 py-3">{lead.student_first ?? "—"}</td>
                <td className="px-4 py-3">{lead.stage}</td>
                <td className="px-4 py-3">{lead.lead_source}</td>
                <td className="px-4 py-3 text-ink-muted">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!leads?.length && (
          <p className="px-4 py-8 text-center text-ink-muted">No leads yet.</p>
        )}
      </div>
    </div>
  );
}
