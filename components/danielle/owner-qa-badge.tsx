"use client";

import { useEffect, useState } from "react";
import type { DaniellePortalRole } from "@/lib/danielle-portal-roles";

type SessionPayload = {
  isOwnerQa: boolean;
  sessionRole: DaniellePortalRole;
  visitorRole: DaniellePortalRole;
};

export function OwnerQaBadge() {
  const [session, setSession] = useState<SessionPayload | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/danielle/session");
        if (!res.ok || cancelled) {
          return;
        }
        setSession((await res.json()) as SessionPayload);
      } catch {
        // Badge is optional UI.
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!session?.isOwnerQa) {
    return null;
  }

  return (
    <span className="danielle-portal__qa-badge" title="Your visits count as owner, not student">
      Owner QA
    </span>
  );
}
