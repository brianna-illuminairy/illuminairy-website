"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const statuses = ["pending_payment", "active", "completed", "withdrawn"] as const;

export function EnrollmentUpdateForm({
  enrollmentId,
  initial
}: {
  enrollmentId: string;
  initial: {
    status: string;
    tutor_assigned: string | null;
    baseline_score: string | null;
    target_score: string | null;
  };
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);

    const res = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: String(fd.get("status") ?? ""),
        tutor_assigned: String(fd.get("tutor_assigned") ?? "") || null,
        baseline_score: String(fd.get("baseline_score") ?? "") || null,
        target_score: String(fd.get("target_score") ?? "") || null
      })
    });

    if (!res.ok) {
      setStatus("error");
      return;
    }

    router.refresh();
    setStatus("idle");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
      <label className="grid gap-1 text-[12px] font-medium text-ink">
        Status
        <select
          name="status"
          defaultValue={initial.status}
          className="h-10 rounded-lg border border-line px-3 text-[13px]"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-[12px] font-medium text-ink">
        Tutor assigned
        <input
          name="tutor_assigned"
          defaultValue={initial.tutor_assigned ?? ""}
          className="h-10 rounded-lg border border-line px-3 text-[13px]"
        />
      </label>
      <label className="grid gap-1 text-[12px] font-medium text-ink">
        Baseline score
        <input
          name="baseline_score"
          defaultValue={initial.baseline_score ?? ""}
          className="h-10 rounded-lg border border-line px-3 text-[13px]"
        />
      </label>
      <label className="grid gap-1 text-[12px] font-medium text-ink">
        Target score
        <input
          name="target_score"
          defaultValue={initial.target_score ?? ""}
          className="h-10 rounded-lg border border-line px-3 text-[13px]"
        />
      </label>
      {status === "error" && (
        <p className="text-[12px] text-terracotta-ink">Could not save.</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-10 rounded-lg border border-ink bg-ivory text-[12px] font-semibold text-ink disabled:opacity-60"
      >
        {status === "loading" ? "Saving…" : "Save enrollment"}
      </button>
    </form>
  );
}
