import {
  SOHA_MISTAKE_LOG_COLUMN_DETAILS,
  SOHA_MISTAKE_LOG_SETUP_HEADLINE,
  SOHA_MISTAKE_LOG_SETUP_INTRO,
  SOHA_MISTAKE_LOG_SETUP_STEPS,
  SOHA_MISTAKE_LOG_TRANSITIONS_EXAMPLE,
} from "@/lib/soha-mistake-log-instructions";

export function SohaMistakeLogSetup() {
  const example = SOHA_MISTAKE_LOG_TRANSITIONS_EXAMPLE;

  return (
    <div className="soha-week1__mistake-log" id="mistake-log-setup">
      <h3 className="soha-week1__slides-heading">{SOHA_MISTAKE_LOG_SETUP_HEADLINE}</h3>
      {SOHA_MISTAKE_LOG_SETUP_INTRO.map((paragraph) => (
        <p key={paragraph.slice(0, 40)} className="soha-week1__focus">
          {paragraph}
        </p>
      ))}

      <ol className="soha-week1__setup-steps">
        {SOHA_MISTAKE_LOG_SETUP_STEPS.map((step, index) => (
          <li key={step.title} className="soha-week1__setup-step">
            <span className="soha-week1__setup-num">{index + 1}</span>
            <div>
              <h4 className="soha-week1__setup-title">{step.title}</h4>
              <p className="soha-week1__focus">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="soha-week1__table-wrap">
        <table className="soha-week1__table">
          <thead>
            <tr>
              <th>Column</th>
              <th>What to write</th>
            </tr>
          </thead>
          <tbody>
            {SOHA_MISTAKE_LOG_COLUMN_DETAILS.map((col) => (
              <tr key={col.column}>
                <td>{col.column}</td>
                <td>{col.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="soha-week1__example-card">
        <p className="soha-week1__note-label">Example row · transitions miss</p>
        <dl className="soha-week1__example-dl">
          <div>
            <dt>Question ID</dt>
            <dd>{example.questionId}</dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{example.category}</dd>
          </div>
          <div>
            <dt>Your answer vs. correct</dt>
            <dd>{example.answers}</dd>
          </div>
          <div>
            <dt>Error type</dt>
            <dd>{example.errorType}</dd>
          </div>
          <div>
            <dt>The fix</dt>
            <dd>{example.fix}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
