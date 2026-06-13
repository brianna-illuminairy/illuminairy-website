"use client";

import { useEffect, useRef, useState } from "react"; // useEffect is still used for autofocus

/**
 * Click-to-edit row used inside ProfileCard. Reads like ProfileRow when idle;
 * swaps to an <input> when the user clicks the value. Saves on Enter or blur;
 * cancels on Escape. Empty strings are sent as `null` so the field clears.
 *
 * onSave returns true on success so we can collapse back to the read state;
 * on failure (e.g. validation error) we stay in edit mode and surface the
 * error inline via the parent's error toast.
 */
export function EditableRow({
  label,
  value,
  field,
  onSave,
  saving,
  placeholder,
  type = "text",
  labelWidth = "110px",
  formatDisplay,
  inputMode
}: {
  label: string;
  value: string | null | undefined;
  field: string;
  onSave: (body: Record<string, unknown>) => Promise<boolean>;
  saving: boolean;
  placeholder?: string;
  type?: "text" | "email" | "tel";
  labelWidth?: string;
  formatDisplay?: (v: string) => string;
  inputMode?: "text" | "email" | "tel" | "numeric";
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");
  const [prevValue, setPrevValue] = useState(value ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  // React 19 "adjusting state on prop change" pattern: sync the draft to a
  // server refresh during render (not in an effect), but only when the user
  // isn't mid-edit (otherwise a refresh would clobber what they're typing).
  const incoming = value ?? "";
  if (!editing && incoming !== prevValue) {
    setPrevValue(incoming);
    setDraft(incoming);
  }

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = async () => {
    const next = draft.trim();
    const current = (value ?? "").trim();
    if (next === current) {
      setEditing(false);
      return;
    }
    const ok = await onSave({ [field]: next === "" ? null : next });
    if (ok) setEditing(false);
  };

  const cancel = () => {
    setDraft(value ?? "");
    setEditing(false);
  };

  const display = value ? (formatDisplay ? formatDisplay(value) : value) : null;
  const empty = display === null || display === "";

  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `${labelWidth} minmax(0, 1fr)` }}
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            type={type}
            inputMode={inputMode}
            disabled={saving}
            value={draft}
            placeholder={placeholder}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void commit();
              } else if (e.key === "Escape") {
                e.preventDefault();
                cancel();
              }
            }}
            className="w-full rounded border border-border bg-background px-2 py-1 text-sm focus:border-foreground focus:outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="block w-full rounded border border-transparent px-2 py-1 text-left text-sm break-words [overflow-wrap:anywhere] hover:border-border hover:bg-muted/40 focus-visible:border-foreground focus-visible:outline-none"
            title="Click to edit"
          >
            {empty ? (
              <span className="text-muted-foreground italic">
                {placeholder ?? "—"}
              </span>
            ) : (
              display
            )}
          </button>
        )}
      </span>
    </div>
  );
}
