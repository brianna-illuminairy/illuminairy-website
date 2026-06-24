import Link from "next/link";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";
import { WEEK1_HOMEWORK_PORTAL_SETS } from "@/lib/soha-post-session-1-notes";

export function Week1HomeworkPortalList() {
  return (
    <div className="soha-week1__homework-list">
      {WEEK1_HOMEWORK_PORTAL_SETS.map((set) => (
        <article key={set.id} className="soha-week1__homework-card">
          <div className="soha-week1__homework-card-head">
            <h3 className="soha-week1__note-title">{set.title}</h3>
            <p className="soha-week1__homework-due-badge">Due {set.dueLabel}</p>
          </div>
          <p className="soha-week1__focus">{set.note}</p>
        </article>
      ))}
      <p className="soha-week1__habit">
        <a
          href={homeworkPortalLoginUrl}
          className="aurora-btn-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Homework Portal
        </a>
      </p>
    </div>
  );
}
