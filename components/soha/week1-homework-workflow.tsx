import Link from "next/link";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";
import {
  WEEK1_HOMEWORK_WORKFLOW,
  WEEK1_SLIDE_DECK_HREF,
} from "@/lib/soha-post-session-1-notes";

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
                <Link href="#mistake-log-setup" className="soha-week1__inline-link">
                  Mistake log setup instructions
                </Link>
                {" · "}
                <Link href="/soha/plan#error-log" className="soha-week1__inline-link">
                  Study plan error log section
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
                <Link href="#mistake-log-setup" className="soha-week1__inline-link">
                  Example row for a transitions miss
                </Link>
              </p>
            )}
          </div>
        </li>
      ))}
      <li className="soha-week1__workflow-foot">
        <p className="soha-week1__focus">
          Optional review:{" "}
          <Link href={WEEK1_SLIDE_DECK_HREF} className="soha-week1__inline-link">
            reopen the slide deck
          </Link>{" "}
          if you want another pass through the method slides or diagnostic walk-throughs.
        </p>
      </li>
    </ol>
  );
}
