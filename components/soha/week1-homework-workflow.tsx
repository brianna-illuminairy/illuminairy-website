import Link from "next/link";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";
import { WEEK1_HOMEWORK_WORKFLOW } from "@/lib/soha-post-session-1-notes";

export function Week1HomeworkWorkflow() {
  return (
    <ol className="soha-week1__workflow">
      {WEEK1_HOMEWORK_WORKFLOW.map((item) => (
        <li key={item.step} className="soha-week1__workflow-step">
          <span className="soha-week1__workflow-num">{item.step}</span>
          <div>
            <h4 className="soha-week1__workflow-title">{item.title}</h4>
            <p className="soha-week1__focus">{item.detail}</p>
            {item.step === 1 && (
              <p className="soha-week1__habit">
                <Link href="/soha/plan#error-log" className="soha-week1__inline-link">
                  Error log setup on your study plan
                </Link>
              </p>
            )}
            {item.step === 2 && (
              <p className="soha-week1__habit">
                <Link
                  href="/soha/week-1/exercises/transitions-flashcards"
                  className="aurora-btn-primary soha-week1__cta-inline"
                >
                  Open flashcard deck
                </Link>
              </p>
            )}
            {(item.step === 3 || item.step === 4) && (
              <p className="soha-week1__habit">
                <a
                  href={homeworkPortalLoginUrl}
                  className="aurora-btn-secondary soha-week1__cta-inline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Homework Portal
                </a>
              </p>
            )}
            {item.step === 5 && (
              <p className="soha-week1__habit">
                <Link href="/soha/plan#error-log" className="soha-week1__inline-link">
                  Error log column guide
                </Link>
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
