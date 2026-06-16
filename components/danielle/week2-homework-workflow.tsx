import Link from "next/link";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";
import {
  WEEK2_HOMEWORK_WORKFLOW,
  WEEK2_SLIDE_DECK_HREF
} from "@/lib/danielle-post-session-2-notes";

export function Week2HomeworkWorkflow() {
  return (
    <ol className="danielle-week2__workflow">
      {WEEK2_HOMEWORK_WORKFLOW.map((item) => (
        <li key={item.step} className="danielle-week2__workflow-step">
          <span className="danielle-week2__workflow-num">{item.step}</span>
          <div>
            <h4 className="danielle-week2__workflow-title">{item.title}</h4>
            <p className="danielle-week1__focus">{item.detail}</p>
            {item.step === 1 && (
              <p className="danielle-week1__habit">
                <Link href={WEEK2_SLIDE_DECK_HREF} className="danielle-portal__pdf-open">
                  Open slide deck (fullscreen)
                </Link>
                {" · "}
                <Link href="/danielle/week-2/lesson-1" className="danielle-week1__inline-link">
                  Lesson 1 summary
                </Link>
              </p>
            )}
            {item.step === 2 && (
              <p className="danielle-week1__habit">
                <Link href="/danielle/week-2/cheat-sheet" className="danielle-portal__pdf-open">
                  Open cheat sheet
                </Link>
              </p>
            )}
            {item.step === 3 && (
              <p className="danielle-week1__habit">
                <Link
                  href="/danielle/week-2/exercises/transitions-flashcards"
                  className="danielle-portal__pdf-open"
                >
                  Open flashcard deck
                </Link>
              </p>
            )}
            {item.step === 4 || item.step === 5 ? (
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
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
