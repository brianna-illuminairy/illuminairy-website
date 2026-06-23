"use client";

import { useEffect, useRef, useState } from "react";
import type { PortalProfile } from "@/lib/portal/load-dashboard";

type Props = {
  profile: PortalProfile;
};

export function PortalProfileChip({ profile }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="portal-profile" ref={rootRef}>
      <button
        type="button"
        className="portal-profile__chip"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="portal-profile__avatar" aria-hidden="true">
          {profile.studentInitials}
        </span>
        <span className="portal-profile__name">{profile.studentName}</span>
      </button>

      {open ? (
        <div className="portal-profile__panel" role="dialog" aria-label="Student profile">
          <p className="portal-profile__panel-title">{profile.studentName}</p>
          {profile.parentName ? (
            <p className="portal-profile__panel-meta">Parent: {profile.parentName}</p>
          ) : null}
          <dl className="portal-profile__list">
            {profile.fields.map((row) => (
              <div key={row.label} className="portal-profile__row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </div>
  );
}
