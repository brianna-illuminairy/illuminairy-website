import Link from "next/link";
import { notFound } from "next/navigation";
import { EnrollmentUpdateForm } from "@/app/admin/(protected)/clients/[id]/enrollment-update-form";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminClientDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    notFound();
  }

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!client) {
    notFound();
  }

  const { data: students } = await supabase
    .from("students")
    .select("*")
    .eq("client_id", id);

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  const { data: touches } = await supabase
    .from("touch_events")
    .select("id, created_at, event_type, path, source")
    .eq("client_id", id)
    .order("created_at", { ascending: false })
    .limit(30);

  return (
    <div>
      <Link href="/admin/clients" className="text-[13px] text-gold-deep hover:underline">
        ← Clients
      </Link>
      <h1 className="mt-4 text-2xl font-light text-ink">
        {client.parent_first} {client.parent_last}
      </h1>
      <p className="text-[14px] text-ink-muted">{client.parent_email}</p>

      <h2 className="mt-8 text-lg font-semibold text-ink">Students</h2>
      <ul className="mt-3 space-y-2 text-[14px]">
        {(students ?? []).map((s) => (
          <li key={s.id} className="rounded-lg border border-line bg-ivory px-4 py-3">
            {s.first_name} {s.last_name} · {s.grade ?? "—"}
          </li>
        ))}
        {!students?.length && <li className="text-ink-muted">No students.</li>}
      </ul>

      <h2 className="mt-10 text-lg font-semibold text-ink">Enrollments</h2>
      <div className="mt-4 space-y-6">
        {(enrollments ?? []).map((enrollment) => (
          <div
            key={enrollment.id}
            className="rounded-xl border border-line bg-ivory p-5"
          >
            <p className="font-medium text-ink">{enrollment.program_label}</p>
            <p className="text-[13px] text-ink-muted">
              Status: {enrollment.status}
              {enrollment.tutor_assigned
                ? ` · Tutor: ${enrollment.tutor_assigned}`
                : ""}
            </p>
            <EnrollmentUpdateForm
              enrollmentId={enrollment.id}
              initial={{
                status: enrollment.status,
                tutor_assigned: enrollment.tutor_assigned,
                baseline_score: enrollment.baseline_score,
                target_score: enrollment.target_score
              }}
            />
          </div>
        ))}
        {!enrollments?.length && (
          <p className="text-ink-muted">No enrollments yet.</p>
        )}
      </div>

      <h2 className="mt-10 text-lg font-semibold text-ink">Touch log</h2>
      <ul className="mt-4 space-y-2">
        {(touches ?? []).map((t) => (
          <li
            key={t.id}
            className="rounded-lg border border-line bg-ivory px-4 py-3 text-[13px]"
          >
            <span className="font-medium">{t.event_type}</span>
            <span className="text-ink-muted">
              {" "}
              · {new Date(t.created_at).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
