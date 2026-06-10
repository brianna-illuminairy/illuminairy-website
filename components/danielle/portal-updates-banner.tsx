"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  DANIELLE_PORTAL_UPDATES,
  type DaniellePortalUpdate
} from "@/lib/danielle-portal-updates";

const STORAGE_KEY = "illuminairy_danielle_seen_updates";

function readSeenUpdateIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((entry): entry is string => typeof entry === "string");
  } catch {
    return [];
  }
}

function writeSeenUpdateIds(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

function getUnseenUpdates(seenIds: string[]): DaniellePortalUpdate[] {
  const seen = new Set(seenIds);
  return DANIELLE_PORTAL_UPDATES.filter((update) => !seen.has(update.id));
}

function subscribeToPortalUpdates(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener("danielle-portal-updates", handler);
  return () => window.removeEventListener("danielle-portal-updates", handler);
}

export function PortalUpdatesBanner() {
  const unseen = useSyncExternalStore(
    subscribeToPortalUpdates,
    () => getUnseenUpdates(readSeenUpdateIds()),
    () => [] as DaniellePortalUpdate[]
  );

  if (unseen.length === 0) {
    return null;
  }

  function dismissAll() {
    const seen = readSeenUpdateIds();
    const merged = seen.concat(unseen.map((update) => update.id));
    const nextSeen = merged.filter((id, index) => merged.indexOf(id) === index);
    writeSeenUpdateIds(nextSeen);
    window.dispatchEvent(new Event("danielle-portal-updates"));
  }

  return (
    <div className="danielle-portal__updates" role="status" aria-live="polite">
      <div className="danielle-portal__updates-inner">
        <p className="danielle-portal__updates-label">New on your portal</p>
        <ul className="danielle-portal__updates-list">
          {unseen.map((update) => (
            <li key={update.id}>
              <strong>{update.title}</strong>
              <span>{update.summary}</span>
              <Link href={update.href} className="danielle-portal__updates-link">
                {update.cta}
              </Link>
            </li>
          ))}
        </ul>
        <button type="button" className="danielle-portal__updates-dismiss" onClick={dismissAll}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
