import Link from "next/link";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";
import { WEEK2_HOMEWORK_PORTAL_SETS } from "@/lib/danielle-post-session-2-notes";

export function Week2HomeworkPortalList() {
  return (
    <div className="danielle-week2__homework-list">
      {WEEK2_HOMEWORK_PORTAL_SETS.map((set) => (
        <article key={set.id} className="danielle-week2__homework-card">
          <div className="danielle-week2__homework-card-head">
            <h3 className="danielle-week1__note-title">{set.title}</h3>
            <div className="danielle-week2__homework-badges">
              {set.startLabel && (
                <p className="danielle-week2__homework-start-badge">Opens {set.startLabel}</p>
              )}
              <p className="danielle-week2__homework-due-badge">Due {set.dueLabel}</p>
            </div>
          </div>
          <p className="danielle-week1__focus">{set.note}</p>
        </article>
      ))}
      <p className="danielle-week1__habit">
        <a
          href={homeworkPortalLoginUrl}
          className="danielle-portal__pdf-open"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Homework Portal
        </a>
      </p>
    </div>
  );
}
