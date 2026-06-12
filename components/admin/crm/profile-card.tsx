"use client";

import type { ReactNode } from "react";

export function ProfileCard({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <div className="mt-3 space-y-2 text-sm">{children}</div>
    </section>
  );
}

/**
 * A two-column label/value row that handles long unbreakable strings
 * (URLs, emails, IDs) without overflowing its container.
 *
 * - `minmax(0,1fr)` on the value column lets it shrink below content size.
 * - `min-w-0` on the value cell unblocks shrinking inside the grid.
 * - `overflow-wrap: anywhere` breaks long strings at any character if needed
 *   (kinder than `word-break: break-all` for ordinary prose).
 */
export function ProfileRow({
  label,
  value,
  labelWidth = "110px"
}: {
  label: string;
  value: ReactNode;
  labelWidth?: string;
}) {
  const empty = value === null || value === undefined || value === "";
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `${labelWidth} minmax(0, 1fr)` }}
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="min-w-0 break-words [overflow-wrap:anywhere]">
        {empty ? <span className="text-muted-foreground">—</span> : value}
      </span>
    </div>
  );
}
