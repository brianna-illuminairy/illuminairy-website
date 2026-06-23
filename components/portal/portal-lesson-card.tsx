"use client";

import { useMemo, useState } from "react";
import type { PortalLesson } from "@/lib/portal/load-dashboard";
import {
  formatPortalLessonDateLine,
  googleCalendarUrl,
  portalLessonJoinState,
} from "@/lib/portal/lesson-join";
import { site } from "@/lib/site";

type Props = {
  lesson: PortalLesson;
  studentName: string;
};

function ActionIcon({ children }: { children: React.ReactNode }) {
  return <span className="portal-lesson__action-icon">{children}</span>;
}

export function PortalLessonCard({ lesson, studentName }: Props) {
  const [shareNote, setShareNote] = useState<string | null>(null);
  const join = useMemo(
    () => portalLessonJoinState(lesson.scheduledStart, lesson.meetLink),
    [lesson.scheduledStart, lesson.meetLink]
  );

  const formatted = lesson.scheduledStart
    ? formatPortalLessonDateLine(lesson.scheduledStart)
    : null;

  const calendarHref =
    lesson.scheduledStart &&
    googleCalendarUrl({
      title: `Illuminairy free SAT lesson — ${studentName}`,
      startIso: lesson.scheduledStart,
      durationMin: lesson.durationMin,
      details: "Free 1:1 SAT lesson with your Illuminairy mentor. Join from your portal when the button is active.",
      location: lesson.meetLink ?? undefined,
    });

  async function handleShare() {
    setShareNote(null);
    const origin = typeof window !== "undefined" ? window.location.origin : site.url;
    const text = `Free SAT lesson for ${studentName}. Open your portal: ${origin}/portal`;
    const url = `${origin}/portal`;

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Illuminairy SAT session", text, url });
        setShareNote("Shared");
        return;
      } catch {
        setShareNote("Share cancelled");
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setShareNote("Link copied");
    } catch {
      setShareNote("Could not copy link");
    }
  }

  return (
    <section className="portal-lesson aurora-hover-card" aria-label="Upcoming free SAT lesson">
      {formatted ? (
        <>
          <p className="portal-lesson__date-meta">{formatted.monthDayTz}</p>
          <p className="portal-lesson__date-main">{formatted.weekdayTimeRange}</p>
        </>
      ) : (
        <p className="portal-lesson__date-main">Your lesson time will appear here soon.</p>
      )}

      {join.kind === "active" && join.href ? (
        <a className="portal-lesson__join portal-lesson__join--active" href={join.href} target="_blank" rel="noopener noreferrer">
          {join.label}
        </a>
      ) : (
        <button type="button" className="portal-lesson__join" disabled>
          {join.label}
        </button>
      )}

      <div className="portal-lesson__actions">
        {calendarHref ? (
          <a
            className="portal-lesson__action"
            href={calendarHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ActionIcon>📅</ActionIcon>
            Add to calendar
          </a>
        ) : (
          <button type="button" className="portal-lesson__action" disabled>
            <ActionIcon>📅</ActionIcon>
            Add to calendar
          </button>
        )}
        <button type="button" className="portal-lesson__action" onClick={() => void handleShare()}>
          <ActionIcon>↗</ActionIcon>
          Share lesson link
        </button>
        <a
          className="portal-lesson__action"
          href={site.freeLessonCalendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ActionIcon>🕐</ActionIcon>
          Reschedule
        </a>
      </div>

      {shareNote ? <p className="portal-lesson__share-note">{shareNote}</p> : null}

      <p className="portal-lesson__hint">
        Join opens 5 minutes before start. Use Google Meet on a computer or tablet when possible.
      </p>
    </section>
  );
}
