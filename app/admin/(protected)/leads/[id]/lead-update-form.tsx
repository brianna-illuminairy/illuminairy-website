"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const stages = [
  "intake_submitted",
  "call_booked",
  "call_attended",
  "won",
  "lost"
] as const;

export function LeadUpdateForm({
  leadId,
  initial
}: {
  leadId: string;
  initial: {
    stage: string;
    lost_reason: string | null;
    sales_notes: string | null;
    attended: boolean;
  };
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);

    const res = await fetch(`/api/admin/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stage: String(fd.get("stage") ?? ""),
        lost_reason: String(fd.get("lost_reason") ?? "") || null,
        sales_notes: String(fd.get("sales_notes") ?? "") || null,
        attended: fd.get("attended") === "on"
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
    <form onSubmit={handleSubmit} className="mt-8 grid gap-4 rounded-xl border border-line bg-ivory p-5">
      <h3 className="text-[14px] font-semibold text-ink">Update pipeline</h3>
      <label className="grid gap-1 text-[13px] font-medium text-ink">
        Stage
        <select
          name="stage"
          defaultValue={initial.stage}
          className="h-11 rounded-lg border border-line px-3 text-[14px]"
        >
          {stages.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-[13px]">
        <input
          type="checkbox"
          name="attended"
          defaultChecked={initial.attended}
        />
        Consultation attended
      </label>
      <label className="grid gap-1 text-[13px] font-medium text-ink">
        Lost reason
        <input
          name="lost_reason"
          defaultValue={initial.lost_reason ?? ""}
          className="h-11 rounded-lg border border-line px-3 text-[14px]"
        />
      </label>
      <label className="grid gap-1 text-[13px] font-medium text-ink">
        Sales notes
        <textarea
          name="sales_notes"
          rows={3}
          defaultValue={initial.sales_notes ?? ""}
          className="rounded-lg border border-line px-3 py-2 text-[14px]"
        />
      </label>
      {status === "error" && (
        <p className="text-[13px] text-terracotta-ink">Could not save.</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-11 rounded-lg bg-ink text-[13px] font-semibold text-ivory disabled:opacity-60"
      >
        {status === "loading" ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
