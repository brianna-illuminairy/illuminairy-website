import Link from "next/link";
import { WEEK3_FORMULA_SHEET_HREF } from "@/lib/danielle-equivalent-expressions-formula-sheet";
import {
  WEEK3_SLIDE_DECK_HREF,
  WEEK3_WHITEBOARD_NOTES_URL
} from "@/lib/danielle-post-session-3-notes";

export function Week3PostSessionResources() {
  return (
    <div className="danielle-week1__note-card" id="post-session-resources">
      <p className="danielle-week1__note-label">Post-session resources</p>
      <h3 className="danielle-week1__note-title">Review after class</h3>
      <ul className="danielle-week1__score-list">
        <li>
          <Link href="/danielle/week-3/exercises/equivalent-expressions" className="danielle-week1__inline-link">
            Equivalent expressions practice hub
          </Link>
          {" · "}
          pattern sort, FOIL builder, missing values
        </li>
        <li>
          <Link href={WEEK3_FORMULA_SHEET_HREF} className="danielle-week1__inline-link">
            Equivalent expressions formula sheet
          </Link>
          {" · "}
          perfect squares, difference of squares, FOIL matching
        </li>
        <li>
          <a
            href={WEEK3_WHITEBOARD_NOTES_URL}
            className="danielle-week1__inline-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Whiteboard notes (Excalidraw)
          </a>
        </li>
        <li>
          <Link href={WEEK3_SLIDE_DECK_HREF} className="danielle-week1__inline-link">
            Patterns deck (fullscreen)
          </Link>
        </li>
      </ul>
    </div>
  );
}
