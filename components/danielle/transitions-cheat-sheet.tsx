import Link from "next/link";
import {
  TRANSITION_CHEAT_SHEET_SECTIONS,
  TRANSITION_COMMON_PHRASE_COUNT
} from "@/lib/danielle-transitions-cheat-sheet";

export function TransitionsCheatSheet() {
  return (
    <div className="danielle-cheat-sheet">
      <div className="danielle-cheat-sheet__method">
        <h3 className="danielle-cheat-sheet__method-title">On test day</h3>
        <ol className="danielle-cheat-sheet__method-steps">
          <li>Cover the answer choices.</li>
          <li>Read both sentences. Name the relationship in plain words.</li>
          <li>Predict a transition that fits.</li>
          <li>Uncover the choices and pick the match.</li>
        </ol>
        <p className="danielle-cheat-sheet__method-note">
          {TRANSITION_COMMON_PHRASE_COUNT} transitions below are the most common on recent Digital SAT
          practice tests (Bluebook Tests 4–11). Memorize the four categories first, then the words in
          each bucket.
        </p>
      </div>

      <div className="danielle-cheat-sheet__sections">
        {TRANSITION_CHEAT_SHEET_SECTIONS.map((section) => (
          <section key={section.id} className={`danielle-cheat-sheet__section is-${section.id}`}>
            <header className="danielle-cheat-sheet__section-head">
              <div>
                <h3 className="danielle-cheat-sheet__section-title">{section.title}</h3>
                {section.tag && (
                  <span className="danielle-cheat-sheet__section-tag">{section.tag}</span>
                )}
              </div>
              <p className="danielle-cheat-sheet__section-desc">{section.description}</p>
            </header>
            <ul className="danielle-cheat-sheet__words">
              {section.phrases.map((phrase) => (
                <li key={phrase}>{phrase}</li>
              ))}
            </ul>
            {section.note && <p className="danielle-cheat-sheet__section-note">{section.note}</p>}
          </section>
        ))}
      </div>

      <p className="danielle-cheat-sheet__footer">
        <Link href="/danielle/week-2/exercises/transitions-flashcards" className="danielle-week1__inline-link">
          Practice with flashcards
        </Link>
        {" · "}
        <Link href="/danielle/week-2/lesson-1" className="danielle-week1__inline-link">
          Back to Lesson 1
        </Link>
      </p>
    </div>
  );
}
