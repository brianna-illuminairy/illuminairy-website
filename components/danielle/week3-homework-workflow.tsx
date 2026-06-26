import Link from "next/link";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";
import { WEEK3_FORMULA_SHEET_HREF } from "@/lib/danielle-equivalent-expressions-formula-sheet";
import {
  WEEK3_POST_SESSION_WORKFLOW,
  WEEK3_SLIDE_DECK_HREF,
  WEEK3_WHITEBOARD_NOTES_URL
} from "@/lib/danielle-post-session-3-notes";

export function Week3HomeworkWorkflow() {
  return (
    <ol className="danielle-week2__workflow">
      {WEEK3_POST_SESSION_WORKFLOW.map((item) => (
        <li key={item.step} className="danielle-week2__workflow-step">
          <span className="danielle-week2__workflow-num">{item.step}</span>
          <div>
            <h4 className="danielle-week2__workflow-title">{item.title}</h4>
            <p className="danielle-week1__focus">{item.detail}</p>
            {item.step === 1 && (
              <p className="danielle-week1__habit">
                <Link href={WEEK3_FORMULA_SHEET_HREF} className="danielle-portal__pdf-open">
                  Open formula sheet
                </Link>
              </p>
            )}
            {item.step === 2 && (
              <p className="danielle-week1__habit">
                <Link href={WEEK3_SLIDE_DECK_HREF} className="danielle-portal__pdf-open">
                  Open patterns deck (fullscreen)
                </Link>
              </p>
            )}
            {item.step === 3 && (
              <p className="danielle-week1__habit">
                <Link
                  href="/danielle/week-3/exercises/equivalent-expressions"
                  className="danielle-portal__pdf-open"
                >
                  Open practice hub
                </Link>
              </p>
            )}
            {item.step === 4 && (
              <p className="danielle-week1__habit">
                <a
                  href={WEEK3_WHITEBOARD_NOTES_URL}
                  className="danielle-week1__inline-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Whiteboard notes
                </a>
                {" · "}
                <Link href={WEEK3_FORMULA_SHEET_HREF} className="danielle-week1__inline-link">
                  Formula sheet
                </Link>
                {" · "}
                <a
                  href={homeworkPortalLoginUrl}
                  className="danielle-portal__pdf-open"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Homework Portal
                </a>
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
