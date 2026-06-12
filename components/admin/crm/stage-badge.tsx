const TONE: Record<string, string> = {
  intake_submitted: "bg-slate-100 text-slate-800",
  call_booked: "bg-sky-100 text-sky-800",
  no_show: "bg-amber-100 text-amber-900",
  call_attended: "bg-violet-100 text-violet-800",
  diagnostic_scheduled: "bg-indigo-100 text-indigo-800",
  won: "bg-emerald-100 text-emerald-800",
  lost: "bg-rose-100 text-rose-800"
};

const LABEL: Record<string, string> = {
  intake_submitted: "Intake",
  call_booked: "Booked",
  no_show: "No-show",
  call_attended: "Attended",
  diagnostic_scheduled: "Diagnostic",
  won: "Won",
  lost: "Lost"
};

export function stageBadgeTone(stage: string): string {
  return TONE[stage] ?? "bg-muted text-muted-foreground";
}

export function stageLabel(stage: string): string {
  return LABEL[stage] ?? stage;
}

export function StageBadge({ stage }: { stage: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${stageBadgeTone(
        stage
      )}`}
    >
      {stageLabel(stage)}
    </span>
  );
}
