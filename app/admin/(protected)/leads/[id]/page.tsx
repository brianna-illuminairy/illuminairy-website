import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadUpdateForm } from "@/app/admin/(protected)/leads/[id]/lead-update-form";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminLeadDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    notFound();
  }

  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!lead) {
    notFound();
  }

  const { data: touches } = await supabase
    .from("touch_events")
    .select("id, created_at, event_type, path, full_url, source, utm_source, utm_campaign")
    .eq("lead_id", id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <Link href="/admin/leads" className="text-[13px] text-gold-deep hover:underline">
        ← Leads
      </Link>
      <h1 className="mt-4 text-2xl font-light text-ink">
        {lead.parent_first} {lead.parent_last}
      </h1>
      <p className="text-[14px] text-ink-muted">{lead.parent_email}</p>

      <dl className="mt-8 grid gap-3 text-[14px] sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-ink-muted">Stage</dt>
          <dd>{lead.stage}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink-muted">Source</dt>
          <dd>{lead.lead_source}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink-muted">Student</dt>
          <dd>
            {lead.student_first} · {lead.student_grade}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-ink-muted">Campaign</dt>
          <dd>{lead.utm_campaign ?? "—"}</dd>
        </div>
      </dl>

      <LeadUpdateForm
        leadId={lead.id}
        initial={{
          stage: lead.stage,
          lost_reason: lead.lost_reason,
          sales_notes: lead.sales_notes,
          attended: Boolean(lead.attended_at)
        }}
      />

      <h2 className="mt-10 text-lg font-semibold text-ink">Touch log</h2>
      <ul className="mt-4 space-y-2">
        {(touches ?? []).map((t) => (
          <li
            key={t.id}
            className="rounded-lg border border-line bg-ivory px-4 py-3 text-[13px]"
          >
            <span className="font-medium">{t.event_type}</span>
            <span className="text-ink-muted"> · {new Date(t.created_at).toLocaleString()}</span>
            {t.path && <span className="block text-ink-muted">{t.path}</span>}
          </li>
        ))}
        {!touches?.length && (
          <li className="text-ink-muted">No touches linked yet.</li>
        )}
      </ul>
    </div>
  );
}
