"use client";

import { useEffect, useState } from "react";
import {
  CATEGORY_META,
  SUGGESTIONS_BY_CATEGORY,
  URGENCY_LEVELS,
  URGENCY_META,
  suggestionLabel,
  type TagCategory,
  type UrgencyLevel
} from "@/lib/admin/lead-tag-suggestions";
import type { LeadTag } from "@/lib/admin/lead-tags";

type Props = {
  leadId: string;
  initialUrgencyLevel?: UrgencyLevel | null;
  initialUrgencyReason?: string | null;
};

const CATEGORY_ORDER: TagCategory[] = ["buying_trigger", "objection", "priority"];

export function LeadProfileTags({
  leadId,
  initialUrgencyLevel,
  initialUrgencyReason
}: Props) {
  const [tags, setTags] = useState<LeadTag[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel | null>(
    initialUrgencyLevel ?? null
  );
  const [urgencyReason, setUrgencyReason] = useState(initialUrgencyReason ?? "");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/leads/${leadId}/tags`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((json: { tags: LeadTag[] } | null) => {
        if (cancelled) return;
        if (!json) {
          setError("Could not load tags.");
          setTags([]);
          return;
        }
        setTags(json.tags ?? []);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load tags.");
          setTags([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [leadId, reloadKey]);

  function bumpReload() {
    setReloadKey((k) => k + 1);
  }

  async function addTag(category: TagCategory, slug: string, note?: string) {
    if (!slug) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, tag: slug, note: note ?? null })
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setError(j.error ?? "Could not add tag.");
        return;
      }
      bumpReload();
    } finally {
      setBusy(false);
    }
  }

  async function tagAction(
    tagId: string,
    action: "resolve" | "reopen" | "delete",
    note?: string
  ) {
    setBusy(true);
    try {
      if (action === "delete") {
        if (!confirm("Remove this tag?")) {
          setBusy(false);
          return;
        }
        await fetch(`/api/admin/lead-tags/${tagId}`, { method: "DELETE" });
      } else {
        await fetch(`/api/admin/lead-tags/${tagId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, note: note ?? null })
        });
      }
      bumpReload();
    } finally {
      setBusy(false);
    }
  }

  async function saveUrgency(level: UrgencyLevel | null, reason: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/urgency`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, reason: reason || null })
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setError(j.error ?? "Could not save urgency.");
        return;
      }
    } finally {
      setBusy(false);
    }
  }

  const groupedTags: Record<TagCategory, LeadTag[]> = {
    buying_trigger: [],
    objection: [],
    priority: []
  };
  for (const t of tags ?? []) {
    if (groupedTags[t.category]) groupedTags[t.category].push(t);
  }

  return (
    <section className="rounded-xl border border-border bg-surface">
      <header className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Sales intel</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Tags + urgency drive your prep for every touchpoint. Gemini auto-populates these from call transcripts; you can edit any of them.
        </p>
      </header>

      {error && (
        <p className="mx-4 mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <UrgencyEditor
        level={urgencyLevel}
        reason={urgencyReason}
        busy={busy}
        onChange={(lvl, rsn) => {
          setUrgencyLevel(lvl);
          setUrgencyReason(rsn);
        }}
        onSave={(lvl, rsn) => saveUrgency(lvl, rsn)}
      />

      <div className="divide-y divide-border">
        {CATEGORY_ORDER.map((cat) => (
          <CategorySection
            key={cat}
            category={cat}
            tags={groupedTags[cat]}
            busy={busy}
            loading={tags === null}
            onAdd={(slug, note) => addTag(cat, slug, note)}
            onAction={(id, act) => tagAction(id, act)}
          />
        ))}
      </div>
    </section>
  );
}

function UrgencyEditor({
  level,
  reason,
  busy,
  onChange,
  onSave
}: {
  level: UrgencyLevel | null;
  reason: string;
  busy: boolean;
  onChange: (level: UrgencyLevel | null, reason: string) => void;
  onSave: (level: UrgencyLevel | null, reason: string) => Promise<void>;
}) {
  return (
    <div className="border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Urgency
        </h3>
        {level && (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${URGENCY_META[level].tone}`}
          >
            {URGENCY_META[level].label}
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        <UrgencyPill
          active={level === null}
          tone="bg-slate-100 text-slate-500"
          label="Unset"
          onClick={() => {
            onChange(null, "");
            void onSave(null, "");
          }}
        />
        {URGENCY_LEVELS.map((lvl) => (
          <UrgencyPill
            key={lvl}
            active={level === lvl}
            tone={URGENCY_META[lvl].tone}
            label={URGENCY_META[lvl].label}
            onClick={() => {
              onChange(lvl, reason);
              void onSave(lvl, reason);
            }}
          />
        ))}
      </div>
      <input
        type="text"
        value={reason}
        disabled={busy || !level}
        placeholder={level ? URGENCY_META[level].description : "Pick an urgency level to add a reason."}
        onChange={(e) => onChange(level, e.target.value)}
        onBlur={() => void onSave(level, reason)}
        className="mt-2 block w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs disabled:opacity-50"
      />
    </div>
  );
}

function UrgencyPill({
  active,
  tone,
  label,
  onClick
}: {
  active: boolean;
  tone: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase transition-opacity ${
        active ? tone : "bg-transparent text-muted-foreground hover:text-foreground"
      } ${active ? "" : "border border-border"}`}
    >
      {label}
    </button>
  );
}

function CategorySection({
  category,
  tags,
  busy,
  loading,
  onAdd,
  onAction
}: {
  category: TagCategory;
  tags: LeadTag[];
  busy: boolean;
  loading: boolean;
  onAdd: (slug: string, note?: string) => Promise<void>;
  onAction: (id: string, action: "resolve" | "reopen" | "delete") => Promise<void>;
}) {
  const meta = CATEGORY_META[category];
  const suggestions = SUGGESTIONS_BY_CATEGORY[category];
  const common = suggestions.filter((s) => s.common);
  const [showAll, setShowAll] = useState(false);
  const [customTag, setCustomTag] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const usedSlugs = new Set(tags.filter((t) => !t.resolved_at).map((t) => t.tag));

  return (
    <div className="px-4 py-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {meta.label}
        </h3>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.tone}`}
        >
          {tags.filter((t) => !t.resolved_at).length}
        </span>
      </div>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{meta.helper}</p>

      {loading ? (
        <p className="mt-2 text-xs text-muted-foreground">Loading…</p>
      ) : (
        <>
          {tags.length === 0 && (
            <p className="mt-2 text-xs text-muted-foreground">No tags yet.</p>
          )}
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <li key={t.id}>
                <TagChip
                  tag={t}
                  category={category}
                  busy={busy}
                  onAction={onAction}
                />
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-3 space-y-1.5">
        <div className="flex flex-wrap gap-1.5">
          {(showAll ? suggestions : common).map((s) => {
            const isUsed = usedSlugs.has(s.tag);
            return (
              <button
                key={s.tag}
                type="button"
                disabled={busy || isUsed}
                onClick={() => void onAdd(s.tag)}
                className={`rounded-full border border-dashed px-2 py-0.5 text-[10px] transition-colors ${
                  isUsed
                    ? "border-border bg-muted/30 text-muted-foreground opacity-60"
                    : "border-border hover:border-foreground hover:bg-background"
                }`}
                title={s.group ?? ""}
              >
                {isUsed ? "✓ " : "+ "}
                {s.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          {!showAll && suggestions.length > common.length && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="underline text-muted-foreground hover:text-foreground"
            >
              Show all {suggestions.length}
            </button>
          )}
          {showAll && (
            <button
              type="button"
              onClick={() => setShowAll(false)}
              className="underline text-muted-foreground hover:text-foreground"
            >
              Show common only
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowCustom((v) => !v)}
            className="underline text-muted-foreground hover:text-foreground"
          >
            {showCustom ? "Cancel custom" : "+ Custom tag"}
          </button>
        </div>
        {showCustom && (
          <div className="mt-2 space-y-1.5 rounded-lg border border-dashed border-border bg-background p-2">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="Tag (e.g. fall_test_date_only)"
              className="block w-full rounded-md border border-border bg-background px-2 py-1 text-xs"
            />
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Note (optional)"
              className="block w-full rounded-md border border-border bg-background px-2 py-1 text-xs"
            />
            <button
              type="button"
              disabled={!customTag.trim() || busy}
              onClick={async () => {
                await onAdd(customTag.trim(), customNote.trim() || undefined);
                setCustomTag("");
                setCustomNote("");
                setShowCustom(false);
              }}
              className="rounded-md bg-foreground px-2 py-1 text-xs font-semibold text-background hover:opacity-90 disabled:opacity-50"
            >
              Add custom tag
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TagChip({
  tag,
  category,
  busy,
  onAction
}: {
  tag: LeadTag;
  category: TagCategory;
  busy: boolean;
  onAction: (id: string, action: "resolve" | "reopen" | "delete") => Promise<void>;
}) {
  const meta = CATEGORY_META[category];
  const label = suggestionLabel(category, tag.tag);
  const isObjection = category === "objection";
  const isResolved = !!tag.resolved_at;
  const tone = isResolved
    ? "bg-slate-100 text-slate-500 line-through decoration-1"
    : meta.tone;

  return (
    <div
      className={`group inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${tone}`}
      title={`${tag.note ?? ""}\n\nSource: ${tag.source}${tag.source_detail ? ` (${tag.source_detail})` : ""}`}
    >
      <span>{label}</span>
      {tag.source === "gemini" && (
        <span className="rounded-sm bg-white/40 px-1 text-[9px] uppercase">AI</span>
      )}
      {isObjection && !isResolved && (
        <button
          type="button"
          disabled={busy}
          onClick={() => void onAction(tag.id, "resolve")}
          className="rounded-sm bg-white/40 px-1 text-[9px] hover:bg-white/80 disabled:opacity-50"
          title="Mark this objection as addressed"
        >
          ✓
        </button>
      )}
      {isObjection && isResolved && (
        <button
          type="button"
          disabled={busy}
          onClick={() => void onAction(tag.id, "reopen")}
          className="rounded-sm bg-white/40 px-1 text-[9px] hover:bg-white/80 disabled:opacity-50"
          title="Reopen this objection"
        >
          ↺
        </button>
      )}
      <button
        type="button"
        disabled={busy}
        onClick={() => void onAction(tag.id, "delete")}
        className="rounded-sm px-0.5 text-[10px] opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-60 disabled:opacity-50"
        title="Remove"
      >
        ×
      </button>
    </div>
  );
}
