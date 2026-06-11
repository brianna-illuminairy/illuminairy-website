"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CrmLeadRow } from "@/lib/admin/crm-queries";
import { formatBookingDateTime, formatFollowup } from "@/lib/admin/format-booking";
import { stageBadgeTone, stageLabel } from "./stage-badge";

const COLUMNS: Array<{ id: string; label: string }> = [
  { id: "intake_submitted", label: "Intake" },
  { id: "call_booked", label: "Booked" },
  { id: "call_attended", label: "Attended" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" }
];

function daysAgo(iso: string): number {
  const diff = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function LeadsPipeline({
  leads,
  onChange
}: {
  leads: CrmLeadRow[];
  onChange: () => Promise<void> | void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const [optimistic, setOptimistic] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const byStage = useMemo(() => {
    const map: Record<string, CrmLeadRow[]> = {};
    for (const col of COLUMNS) map[col.id] = [];
    for (const lead of leads) {
      const stage = optimistic[lead.id] ?? lead.stage;
      (map[stage] ?? (map[stage] = [])).push(lead);
    }
    return map;
  }, [leads, optimistic]);

  const activeLead = activeId
    ? leads.find((l) => l.id === activeId) ?? null
    : null;

  async function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const leadId = String(e.active.id);
    const targetStage = e.over?.id ? String(e.over.id) : null;
    if (!targetStage) return;
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.stage === targetStage) return;

    setOptimistic((s) => ({ ...s, [leadId]: targetStage }));
    setError(null);

    const res = await fetch(`/api/admin/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: targetStage })
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setError(j.error ?? "Could not move card.");
      setOptimistic((s) => {
        const next = { ...s };
        delete next[leadId];
        return next;
      });
      return;
    }
    await onChange();
    setOptimistic((s) => {
      const next = { ...s };
      delete next[leadId];
      return next;
    });
  }

  return (
    <div className="space-y-3">
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <DndContext
        sensors={sensors}
        onDragStart={(e) => setActiveId(String(e.active.id))}
        onDragCancel={() => setActiveId(null)}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-3 lg:grid-cols-5">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              id={col.id}
              label={col.label}
              leads={byStage[col.id] ?? []}
            />
          ))}
        </div>
        <DragOverlay>
          {activeLead ? <CardContents lead={activeLead} dragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function Column({
  id,
  label,
  leads
}: {
  id: string;
  label: string;
  leads: CrmLeadRow[];
}) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`flex h-full min-h-[300px] flex-col rounded-xl border bg-muted/20 p-3 ${
        isOver ? "border-foreground/40 bg-muted/40" : "border-border"
      }`}
    >
      <header className="mb-3 flex items-center justify-between">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${stageBadgeTone(
            id
          )}`}
        >
          {label}
        </span>
        <span className="text-xs text-muted-foreground">{leads.length}</span>
      </header>
      <div className="flex flex-col gap-2">
        {leads.map((lead) => (
          <DraggableCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}

function DraggableCard({ lead }: { lead: CrmLeadRow }) {
  const { attributes, listeners, setNodeRef, isDragging, transform } =
    useDraggable({ id: lead.id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.4 : 1
      }
    : { opacity: isDragging ? 0.4 : 1 };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab touch-none rounded-lg border border-border bg-background p-3 text-left text-sm shadow-sm hover:border-foreground/30"
    >
      <CardContents lead={lead} />
    </div>
  );
}

function CardContents({
  lead,
  dragging
}: {
  lead: CrmLeadRow;
  dragging?: boolean;
}) {
  const booking = formatBookingDateTime(lead.bookedCallAt);
  const followup = formatFollowup(lead.nextFollowupAt);

  const parentName =
    [lead.parentFirst, lead.parentLast].filter(Boolean).join(" ") ||
    lead.parentEmail;

  return (
    <div
      className={`space-y-1 ${dragging ? "rounded-lg border border-border bg-background p-3 shadow-lg" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium leading-tight">{parentName}</p>
        {lead.convertedClientId ? (
          <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800">
            Client
          </span>
        ) : null}
      </div>
      <p className="text-xs text-muted-foreground">
        {lead.studentFirst ?? "—"} · {stageLabel(lead.stage)}
      </p>
      {booking ? (
        <p className="text-[11px] text-muted-foreground">📅 {booking.absolute}</p>
      ) : null}
      {followup ? (
        <p
          className={`text-[11px] ${
            followup.tone === "overdue"
              ? "text-rose-700 font-medium"
              : followup.tone === "today"
                ? "text-amber-700 font-medium"
                : "text-muted-foreground"
          }`}
        >
          ⏰ {followup.relative}
        </p>
      ) : null}
      <p className="flex items-center justify-between gap-2 pt-1 text-[10px] text-muted-foreground">
        <span>{daysAgo(lead.createdAt)}d in pipeline</span>
        {!dragging ? (
          <Link
            href={`/admin/crm/leads/${lead.id}`}
            className="underline"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            open
          </Link>
        ) : null}
      </p>
    </div>
  );
}
